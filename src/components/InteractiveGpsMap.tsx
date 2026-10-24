import React, { Component, useEffect, useRef, useState, type ReactNode, type ErrorInfo } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation, Copy, Check, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

export function isValidCoordinate(lat?: any, lng?: any): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (!isFinite(lat) || !isFinite(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

export interface CoordinatesLike {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

export interface InteractiveGpsMapProps {
  latitude?: number;
  longitude?: number;
  customerCoords?: CoordinatesLike | null;
  riderCoords?: CoordinatesLike | null;
  accuracyMeters?: number;
  accuracy?: number;
  distanceKm?: number;
  isLiveTracking?: boolean;
  customerName?: string;
  address?: string;
  height?: string;
  showNavigationButton?: boolean;
  onRetry?: () => void;
}

export interface GpsMapErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface GpsMapErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

// React Error Boundary for GPS / Map components
export class GpsMapErrorBoundary extends Component<GpsMapErrorBoundaryProps, GpsMapErrorBoundaryState> {
  state: GpsMapErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: any): GpsMapErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Map rendering error' };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.warn('GpsMap caught map rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>মানচিত্র এখন লোড করা যাচ্ছে না</span>
          </div>
          <p className="text-slate-600 dark:text-white/70">
            অনুগ্রহ করে নিচের বক্সে আপনার সঠিক ঠিকানা লিখুন অথবা পৃষ্ঠা রিফ্রেশ করে আবার চেষ্টা করুন।
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const InteractiveGpsMap: React.FC<InteractiveGpsMapProps> = ({
  latitude,
  longitude,
  customerCoords,
  riderCoords,
  accuracyMeters,
  accuracy,
  distanceKm,
  isLiveTracking = false,
  customerName,
  address,
  height = '300px',
  showNavigationButton = true,
  onRetry,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [copied, setCopied] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Safe Coordinate Extraction
  const rawLat = latitude ?? customerCoords?.lat ?? customerCoords?.latitude;
  const rawLng = longitude ?? customerCoords?.lng ?? customerCoords?.longitude;

  const validLat = isValidCoordinate(rawLat, rawLng) ? (rawLat as number) : null;
  const validLng = isValidCoordinate(rawLat, rawLng) ? (rawLng as number) : null;

  const rawRiderLat = riderCoords?.lat ?? riderCoords?.latitude;
  const rawRiderLng = riderCoords?.lng ?? riderCoords?.longitude;
  const validRiderLat = isValidCoordinate(rawRiderLat, rawRiderLng) ? (rawRiderLat as number) : null;
  const validRiderLng = isValidCoordinate(rawRiderLat, rawRiderLng) ? (rawRiderLng as number) : null;

  const effectiveAccuracy = accuracyMeters ?? accuracy;

  const googleMapsSearchUrl =
    validLat !== null && validLng !== null
      ? `https://www.google.com/maps?q=${validLat},${validLng}`
      : 'https://www.google.com/maps';

  const googleMapsDirectionsUrl =
    validLat !== null && validLng !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${validLat},${validLng}`
      : 'https://www.google.com/maps';

  useEffect(() => {
    if (validLat === null || validLng === null) {
      return;
    }

    if (!mapContainerRef.current) return;

    try {
      // Clear any preexisting Leaflet state on the container to prevent collision
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      // If map already initialized, just set view and update markers
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.setView([validLat, validLng], 16);
          return;
        } catch {
          // If view update fails, re-create cleanly
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      }

      // Initialize Leaflet Map safely
      const map = L.map(mapContainerRef.current, {
        center: [validLat, validLng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap High-Resolution Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Glowing Dorkar Customer Pin Marker
      const customPinIcon = L.divIcon({
        className: 'custom-dorkar-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
            <div class="absolute -top-1 w-8 h-8 rounded-full bg-[#0284c7]/30 animate-ping"></div>
            <div class="w-10 h-10 rounded-full bg-[#061522] border-2 border-[#0284c7] shadow-2xl flex items-center justify-center text-[#0284c7] z-10">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="absolute -bottom-1 w-3 h-3 bg-[#0284c7] rotate-45 rounded-sm"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -42],
      });

      const customerMarker = L.marker([validLat, validLng], { icon: customPinIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; color: #061522; font-size: 13px; line-height: 1.4; padding: 2px;">
          <strong style="color: #061522; font-size: 14px; display: block; margin-bottom: 2px;">${customerName || 'গ্রাহকের লোকেশন'}</strong>
          ${address ? `<p style="margin: 0 0 4px; color: #4b5563; font-size: 12px;">${address}</p>` : ''}
          <div style="font-family: monospace; font-size: 11px; background: #f3f4f6; padding: 3px 6px; border-radius: 4px; margin-top: 4px; display: inline-block;">
            GPS: ${validLat.toFixed(6)}, ${validLng.toFixed(6)}
          </div>
          ${effectiveAccuracy ? `<div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 3px;">নির্ভুলতা: ±${effectiveAccuracy} মিটার</div>` : ''}
        </div>
      `;
      customerMarker.bindPopup(popupContent);

      // Accuracy Circle if available
      if (effectiveAccuracy && effectiveAccuracy > 0) {
        L.circle([validLat, validLng], {
          radius: Math.min(effectiveAccuracy, 200),
          color: '#0284c7',
          weight: 1.5,
          fillColor: '#0ea5e9',
          fillOpacity: 0.15,
        }).addTo(map);
      }

      // Rider Marker if active live tracking
      if (isLiveTracking && validRiderLat !== null && validRiderLng !== null) {
        const riderIcon = L.divIcon({
          className: 'custom-rider-pin',
          html: `
            <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
              <div class="w-9 h-9 rounded-full bg-[#C69A45] border-2 border-white shadow-xl flex items-center justify-center text-[#061522] z-10 font-bold text-xs">
                🏍️
              </div>
              <div class="absolute -bottom-1 w-2.5 h-2.5 bg-[#C69A45] rotate-45"></div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        });

        const riderMarker = L.marker([validRiderLat, validRiderLng], { icon: riderIcon }).addTo(map);
        riderMarker.bindPopup('<strong style="font-size:12px;">রাইডারের লাইভ অবস্থান 🏍️</strong>');

        // Draw connecting polyline between rider & customer
        L.polyline(
          [
            [validLat, validLng],
            [validRiderLat, validRiderLng],
          ],
          {
            color: '#C69A45',
            dashArray: '6, 8',
            weight: 3,
            opacity: 0.85,
          }
        ).addTo(map);

        // Fit bounds to show both customer and rider
        const bounds = L.latLngBounds([
          [validLat, validLng],
          [validRiderLat, validRiderLng],
        ]);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      // Invalidate size after small timeout to handle container animation
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {
          // ignore
        }
      }, 250);

      setMapError(null);

      return () => {
        clearTimeout(timer);
        try {
          map.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      };
    } catch (err: any) {
      console.warn('Leaflet initialization warning:', err);
      setMapError(err?.message || 'মানচিত্র লোড করতে সমস্যা হয়েছে');
    }
  }, [validLat, validLng, validRiderLat, validRiderLng, effectiveAccuracy, customerName, address, isLiveTracking]);

  const handleCopyCoordinates = () => {
    if (validLat === null || validLng === null) return;
    navigator.clipboard.writeText(`${validLat.toFixed(6)}, ${validLng.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCenterMap = () => {
    if (mapInstanceRef.current && validLat !== null && validLng !== null) {
      try {
        mapInstanceRef.current.setView([validLat, validLng], 16);
      } catch {
        // ignore
      }
    }
  };

  // Safe Fallback Card if coordinates are not available or if map load errored
  if (validLat === null || validLng === null || mapError) {
    return (
      <div className="w-full rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 p-5 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">
            {mapError ? 'মানচিত্র প্রদর্শন করা যাচ্ছে না' : 'সরাসরি GPS স্থানাঙ্ক প্রস্তুত'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/60 max-w-sm mx-auto">
            {address
              ? `প্রদত্ত ঠিকানা: "${address}"`
              : 'আপনার দেওয়া ঠিকানায় রাইডার সরাসরি পৌঁছে যাবে।'}
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#061522] border border-slate-300 dark:border-white/20 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>আবার চেষ্টা করুন</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#061522] border border-slate-200 dark:border-cyan-500/30 shadow-lg transition-colors">
      {/* Map Header / Stats */}
      <div className="p-3 bg-slate-50 dark:bg-[#0B2233] border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-cyan-500/20 border border-sky-300 dark:border-cyan-400/40 flex items-center justify-center text-[#0284c7] dark:text-cyan-300">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-white font-semibold">
              <span>{validLat.toFixed(6)}, {validLng.toFixed(6)}</span>
              <button
                type="button"
                onClick={handleCopyCoordinates}
                title="স্থানাঙ্ক কপি করুন"
                className="text-slate-500 dark:text-white/60 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors p-0.5 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            {effectiveAccuracy !== undefined && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                GPS নির্ভুলতা: ±{effectiveAccuracy} মিটার {effectiveAccuracy <= 20 ? '(অত্যন্ত নিখুঁত)' : effectiveAccuracy <= 50 ? '(ভালো)' : '(মাঝারি)'}
              </p>
            )}
            {distanceKm !== undefined && (
              <p className="text-[10px] text-slate-500 dark:text-white/60">
                ভাওয়াল মির্জাপুর বাজার থেকে দূরত্ব: ~{distanceKm} কিমি
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCenterMap}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium transition-colors border border-slate-200 dark:border-white/10 cursor-pointer shadow-sm"
        >
          সেন্টার করুন
        </button>
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="relative z-0 bg-slate-100 dark:bg-[#0B2233]"
      />

      {/* Map Action Buttons Footer */}
      <div className="p-3 bg-slate-50 dark:bg-[#0B2233] border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-slate-600 dark:text-white/60 truncate max-w-[200px] sm:max-w-xs font-medium">
          {address || 'গ্রাহকের সঠিক অবস্থান'}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#061522] border border-sky-300 dark:border-cyan-500/40 text-[#0284c7] dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-950 hover:text-[#0369a1] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>

          {showNavigationButton && (
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>নেভিগেশন</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
