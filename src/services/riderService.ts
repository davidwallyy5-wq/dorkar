import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Rider, Order, OrderStatus, UserRole } from '../types';
import { sendAppNotification } from './notificationService';

const RIDERS_COLLECTION = 'riders';
const ORDERS_COLLECTION = 'orders';
const ADMINS_COLLECTION = 'admins';
const RIDER_SESSION_KEY = 'dorkar_rider_session_v2';

// Permanent owner/admin email as defined by the user
export const OWNER_ADMIN_EMAIL = 'davidwallyy5@gmail.com';
export const OWNER_ADMIN_EMAILS = ['davidwallyy5@gmail.com'];

/**
 * Generate a clean, readable Rider ID (e.g. RID-1024)
 */
export function generateRiderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RID-${randomNum}`;
}

/**
 * Generate a random 4-digit numeric PIN (e.g. 5832)
 */
export function generateRiderPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Get stored rider session from localStorage
 */
export function getRiderSavedSession(): Rider | null {
  try {
    const raw = localStorage.getItem(RIDER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Rider;
  } catch {
    return null;
  }
}

/**
 * Save rider session to localStorage
 */
export function saveRiderSession(rider: Rider): void {
  try {
    localStorage.setItem(RIDER_SESSION_KEY, JSON.stringify(rider));
  } catch (e) {
    console.error('Error saving rider session:', e);
  }
}

/**
 * Clear rider session from localStorage
 */
export function clearRiderSession(): void {
  try {
    localStorage.removeItem(RIDER_SESSION_KEY);
  } catch (e) {
    console.error('Error clearing rider session:', e);
  }
}

/**
 * Custom Rider Login using Rider ID or Phone + PIN (NO Firebase Auth)
 */
export async function loginRiderWithPin(identifier: string, pin: string): Promise<Rider> {
  const cleanId = identifier.trim();
  const cleanPin = pin.trim();

  if (!cleanId) {
    throw new Error('অনুগ্রহ করে আপনার রাইডার আইডি বা ফোন নম্বর লিখুন।');
  }
  if (!cleanPin) {
    throw new Error('অনুগ্রহ করে আপনার ৪-ডিজিট পিন নম্বর দিন।');
  }

  // 1. Check direct doc lookup by ID (e.g. RID-1024)
  const riderDocRef = doc(db, RIDERS_COLLECTION, cleanId.toUpperCase());
  const riderSnap = await getDoc(riderDocRef);

  let rider: Rider | null = null;

  if (riderSnap.exists()) {
    rider = riderSnap.data() as Rider;
  } else {
    // 2. Query by phone number or ID in collection
    const q1 = query(collection(db, RIDERS_COLLECTION), where('phone', '==', cleanId));
    const snap1 = await getDocs(q1);

    if (!snap1.empty) {
      rider = snap1.docs[0].data() as Rider;
    } else {
      // Also try matching lowercase/uppercase ID
      const q2 = query(collection(db, RIDERS_COLLECTION), where('id', '==', cleanId));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        rider = snap2.docs[0].data() as Rider;
      }
    }
  }

  if (!rider) {
    throw new Error('এই আইডি বা ফোন নম্বরের কোনো রাইডার অ্যাকাউন্ট পাওয়া যায়নি।');
  }

  // Verify PIN
  if (rider.pin !== cleanPin) {
    throw new Error('ভুল পিন নম্বর! অনুগ্রহ করে সঠিক পিন দিন।');
  }

  // Check Active Status
  if (!rider.active) {
    throw new Error('আপনার রাইডার অ্যাকাউন্টটি সাময়িকভাবে নিষ্ক্রিয় আছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।');
  }

  // Save session
  saveRiderSession(rider);
  return rider;
}

/**
 * Determine a user's role (Admin / Customer / Rider)
 */
export async function determineUserRole(
  email: string | null | undefined,
  uid: string
): Promise<{ role: UserRole; rider?: Rider }> {
  const cleanEmail = (email || '').toLowerCase().trim();

  // 1. Owner / Super Admin check
  if (cleanEmail && (cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase() || OWNER_ADMIN_EMAILS.includes(cleanEmail))) {
    return { role: 'admin' };
  }

  // Check Firestore 'admins' collection
  try {
    const adminDocRef = doc(db, ADMINS_COLLECTION, uid);
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists() && adminSnap.data()?.active === true) {
      return { role: 'admin' };
    }
  } catch (err) {
    console.error('Error checking admin doc:', err);
  }

  return { role: 'customer' };
}

/**
 * Subscribe to orders assigned to a specific rider
 */
export function subscribeToRiderOrders(
  riderId: string,
  riderPhone: string,
  onUpdate: (orders: Order[]) => void
) {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const assignedOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const order = docSnap.data() as Order;
        if (
          order.assignedRiderId === riderId ||
          (riderPhone && order.assignedRiderPhone === riderPhone)
        ) {
          assignedOrders.push(order);
        }
      });
      onUpdate(assignedOrders);
    },
    (error) => {
      console.error('Error subscribing to rider orders:', error);
      onUpdate([]);
    }
  );
}

/**
 * Rider updates the status of their assigned order
 * Supported Statuses: “অর্ডার গ্রহণ করা হয়েছে” / “জিনিস কিনছি” / “ডেলিভারির পথে” / “ডেলিভারি সম্পন্ন”
 */
export async function updateRiderOrderStatus(
  orderId: string,
  status: OrderStatus,
  riderName?: string
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const statusTime = `${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}, ${timeFormatted}`;

  const payload: Partial<Order> = {
    status,
    statusUpdatedAt: statusTime,
    statusUpdatedBy: 'rider',
  };

  await updateDoc(orderRef, payload);

  // Notify Owner of status update
  const notifType = status === 'ডেলিভারি সম্পন্ন' || status === 'সম্পন্ন'
    ? 'order_delivered'
    : status === 'জিনিস কিনছি' || status === 'জিনিস কেনা হচ্ছে'
    ? 'order_picked_up'
    : 'status_update';

  await sendAppNotification({
    type: notifType,
    targetRole: 'owner',
    orderId,
    title: `📦 অর্ডার আপডেট: ${status}`,
    body: `অর্ডার #${orderId}\nরাইডার: ${riderName || 'রাইডার'}\nস্ট্যাটাস: ${status}`,
  });
}

/**
 * Subscribe to all riders for Admin management
 */
export function subscribeToAllRiders(onUpdate: (riders: Rider[]) => void) {
  const q = query(collection(db, RIDERS_COLLECTION), orderBy('timestamp', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const riders: Rider[] = [];
      snapshot.forEach((docSnap) => {
        riders.push(docSnap.data() as Rider);
      });
      onUpdate(riders);
    },
    (error) => {
      console.error('Error subscribing to riders:', error);
      onUpdate([]);
    }
  );
}

/**
 * Admin creates a new rider in Firestore (NO Firebase Auth needed!)
 */
export async function createRider(data: {
  id?: string;
  name: string;
  phone: string;
  pin?: string;
  email?: string;
  active?: boolean;
  vehicleType?: 'মোটরসাইকেল' | 'বাইসাইকেল' | 'হাঁটা' | 'সিএনজি/অন্যান্য';
  nid?: string;
  notes?: string;
}): Promise<Rider> {
  const cleanName = data.name.trim();
  const cleanPhone = data.phone.trim();
  const riderId = (data.id?.trim() || generateRiderId()).toUpperCase();
  const pin = data.pin?.trim() || generateRiderPin();

  if (!cleanName) {
    throw new Error('অনুগ্রহ করে রাইডারের পুরো নাম লিখুন।');
  }
  if (!cleanPhone) {
    throw new Error('অনুগ্রহ করে রাইডারের ফোন নম্বর লিখুন।');
  }
  if (!pin || pin.length < 4) {
    throw new Error('পিন নম্বরটি অবশ্যই কমপক্ষে ৪ ডিজিটের হতে হবে।');
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const newRider: Rider = {
    id: riderId,
    pin,
    name: cleanName,
    phone: cleanPhone,
    email: data.email?.trim() || '',
    active: data.active !== undefined ? data.active : true,
    vehicleType: data.vehicleType || 'মোটরসাইকেল',
    nid: data.nid?.trim() || '',
    createdAt: formattedDate,
    timestamp: Date.now(),
    totalDeliveries: 0,
    notes: data.notes?.trim() || '',
  };

  await setDoc(doc(db, RIDERS_COLLECTION, riderId), newRider);
  return newRider;
}

/**
 * Admin updates rider details
 */
export async function updateRider(riderId: string, updates: Partial<Rider>): Promise<void> {
  const riderRef = doc(db, RIDERS_COLLECTION, riderId);
  await updateDoc(riderRef, updates);
}

/**
 * Admin resets rider PIN
 */
export async function resetRiderPin(riderId: string, newPin?: string): Promise<string> {
  const pinToSet = newPin?.trim() || generateRiderPin();
  const riderRef = doc(db, RIDERS_COLLECTION, riderId);
  await updateDoc(riderRef, { pin: pinToSet });
  return pinToSet;
}

/**
 * Admin updates rider status (Active / Inactive)
 */
export async function toggleRiderActive(riderId: string, active: boolean): Promise<void> {
  const riderRef = doc(db, RIDERS_COLLECTION, riderId);
  await updateDoc(riderRef, { active });
}

/**
 * Admin deletes a rider safely from Firestore database
 */
export async function deleteRider(riderId: string): Promise<void> {
  if (!riderId) {
    throw new Error('রাইডার আইডি পাওয়া যায়নি।');
  }
  // Delete from Firestore riders collection
  await deleteDoc(doc(db, RIDERS_COLLECTION, riderId));
}

/**
 * Admin assigns an order to a rider
 */
export async function assignOrderToRider(
  orderId: string,
  rider: { id: string; name: string; phone: string; address?: string }
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const now = new Date();
  const assignedAt = now.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  await updateDoc(orderRef, {
    assignedRiderId: rider.id,
    assignedRiderName: rider.name,
    assignedRiderPhone: rider.phone,
    assignedAt,
    status: 'অর্ডার গ্রহণ করা হয়েছে',
    statusUpdatedBy: 'admin',
  });

  // Send Push Notification to Rider!
  await sendAppNotification({
    type: 'order_assigned',
    targetRole: 'rider',
    targetRiderId: rider.id,
    orderId,
    title: '🏍️ নতুন ডেলিভারি অ্যাসাইনমেন্ট!',
    body: `অর্ডার #${orderId}\nকাস্টমার: ${rider.address || 'ভাওয়াল মির্জাপুর'}\nবিস্তারিত দেখতে ট্যাপ করুন।`,
  });
}

/**
 * Admin accepts an order
 */
export async function acceptOrder(orderId: string): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    status: 'অর্ডার গ্রহণ করা হয়েছে',
    statusUpdatedBy: 'admin',
  });
}

/**
 * Admin rejects/cancels an order with optional reason
 */
export async function rejectOrder(orderId: string, reason?: string): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    status: 'বাতিল',
    rejectionReason: reason || 'অনিবার্য কারণবশত অর্ডারটি বাতিল করা হয়েছে',
    statusUpdatedBy: 'admin',
  });
}
