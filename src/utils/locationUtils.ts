// Service Area Constants for Bhawal Mirzapur, Gazipur
export const BHAWAL_MIRZAPUR_LOCATION = {
  lat: 24.0886,
  lng: 90.3582,
  name: 'ভাওয়াল মির্জাপুর',
  fullName: 'ভাওয়াল মির্জাপুর, গাজীপুর সদর, গাজীপুর',
};

export const MAX_DELIVERY_RADIUS_KM = 5.0;

export function isValidCoordinate(lat?: any, lng?: any): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (!isFinite(lat) || !isFinite(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates
 * using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number = BHAWAL_MIRZAPUR_LOCATION.lat,
  lon2: number = BHAWAL_MIRZAPUR_LOCATION.lng
): number {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return 1.2;
  }
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 1.8 km)
}

/**
 * Checks if coordinates are within the 5 km service boundary of Bhawal Mirzapur
 */
export function isWithinServiceArea(lat: number, lng: number): {
  isAllowed: boolean;
  distanceKm: number;
} {
  const distanceKm = calculateDistanceKm(lat, lng);
  return {
    isAllowed: distanceKm <= MAX_DELIVERY_RADIUS_KM,
    distanceKm,
  };
}

/**
 * Attempt reverse geocoding via OpenStreetMap Nominatim with fallback
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  if (!isValidCoordinate(lat, lng)) {
    return 'ভাওয়াল মির্জাপুর এলাকা';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=bn,en`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const parts = [
          addr.road || addr.suburb || addr.neighbourhood || addr.village || addr.hamlet,
          addr.subdistrict || addr.county || addr.city_district || 'ভাওয়াল মির্জাপুর',
          addr.state_district || addr.city || 'গাজীপুর',
        ].filter(Boolean);

        if (parts.length > 0) {
          return parts.join(', ');
        }
      }
      if (data.display_name) {
        // Take first 3 comma-separated tokens
        return data.display_name.split(',').slice(0, 3).join(', ').trim();
      }
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  // Fallback representation
  return `ভাওয়াল মির্জাপুর এলাকা (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

/**
 * Promise-based current GPS location retriever with high accuracy and safety
 */
export function getCurrentGPSLocation(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('আপনার ব্রাউজারে GPS লোকেশন সুবিধা সাপোর্ট করে না। চাইলে ম্যানুয়ালি ঠিকানা লিখতে পারেন।'));
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position || !position.coords) {
            reject(new Error('সঠিক GPS স্থানাঙ্ক পাওয়া যায়নি। অনুগ্রহ করে ঠিকানা নিজে লিখুন।'));
            return;
          }

          const rawLat = position.coords.latitude;
          const rawLng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 0);

          if (!isValidCoordinate(rawLat, rawLng)) {
            reject(new Error('অকার্যকর GPS স্থানাঙ্ক পাওয়া গেছে। অনুগ্রহ করে ঠিকানা ম্যানুয়ালি লিখুন।'));
            return;
          }

          resolve({
            lat: rawLat,
            lng: rawLng,
            accuracy,
          });
        },
        (error) => {
          let msg = 'আপনার অবস্থান ব্যবহারের অনুমতি পাওয়া যায়নি। চাইলে ঠিকানা নিজে লিখতে পারেন।';
          if (error) {
            if (error.code === error.PERMISSION_DENIED) {
              msg = 'আপনার অবস্থান ব্যবহারের অনুমতি পাওয়া যায়নি। চাইলে নিচে ঠিকানা নিজে লিখতে পারেন।';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              msg = 'আপনার ডিভাইসের বর্তমান GPS স্যাটেলাইট সংযোগ পাওয়া যাচ্ছে না।';
            } else if (error.code === error.TIMEOUT) {
              msg = 'GPS সিগন্যাল পেতে সময় বেশি লেগেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা ঠিকানা লিখুন।';
            }
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    } catch (e: any) {
      reject(new Error(e?.message || 'GPS সক্রিয় করতে সমস্যা হয়েছে। চাইলে ঠিকানা নিজে লিখতে পারেন।'));
    }
  });
}
