import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderStatus, ContactMessage } from '../types';
import { sendAppNotification } from './notificationService';

const ORDERS_COLLECTION = 'orders';
const MESSAGES_COLLECTION = 'messages';
const LOCAL_STORAGE_ORDER_IDS_KEY = 'dorkar_saved_order_ids_v2';

// Generates a clean, readable, unique DKR-XXXXXX code
export function generateOrderId(): string {
  const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `DKR-${randomPart}`;
}

export function getCustomerOrderIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDER_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomerOrderId(id: string): void {
  try {
    const current = getCustomerOrderIds();
    if (!current.includes(id)) {
      localStorage.setItem(LOCAL_STORAGE_ORDER_IDS_KEY, JSON.stringify([id, ...current]));
    }
  } catch (e) {
    console.error('Error saving order ID locally', e);
  }
}

// Create a real production order in Firestore
export async function createOrder(input: {
  customerName: string;
  phone: string;
  items: string;
  address: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  distanceKm?: number;
  detectedLocationName?: string;
  notes?: string;
  preferredStore?: string;
  category?: string;
}): Promise<Order> {
  const orderId = generateOrderId();
  
  // Format BD readable date/time
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const createdAtFormatted = now.toLocaleString('en-US', dateOptions);

  const newOrder: Order = {
    id: orderId,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    items: input.items.trim(),
    address: input.address.trim(),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.accuracyMeters !== undefined ? { accuracyMeters: input.accuracyMeters } : {}),
    ...(input.distanceKm !== undefined ? { distanceKm: input.distanceKm } : {}),
    ...(input.detectedLocationName ? { detectedLocationName: input.detectedLocationName.trim() } : {}),
    notes: input.notes?.trim() || '',
    preferredStore: input.preferredStore?.trim() || '',
    category: input.category || 'সাধারণ কেনাকাটা',
    createdAt: createdAtFormatted,
    timestamp: Date.now(),
    deliveryCharge: 60, // Maximum strictly capped at ৳60
    status: 'নতুন অর্ডার',
  };

  const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
  await setDoc(orderDocRef, newOrder);
  saveCustomerOrderId(orderId);

  // Send Push Notification to Owner immediately!
  sendAppNotification({
    type: 'new_order',
    targetRole: 'owner',
    orderId,
    title: '🔔 নতুন অর্ডার এসেছে!',
    body: `অর্ডার #${orderId}\nCustomer: ${newOrder.customerName}\nঠিকানা: ${newOrder.address}\nপণ্য: ${newOrder.items.substring(0, 45)}...\nTap to view order.`,
  }).catch((notifErr) => {
    console.warn('Could not dispatch order notification:', notifErr);
  });

  return newOrder;
}

// Fetch a single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const cleanId = orderId.trim().toUpperCase();
    const docRef = doc(db, ORDERS_COLLECTION, cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Order;
    }
    return null;
  } catch (e) {
    console.error('Error fetching order by ID:', e);
    throw e;
  }
}

// Live real-time single order subscription
export function subscribeToOrder(orderId: string, onUpdate: (order: Order | null) => void) {
  const cleanId = orderId.trim().toUpperCase();
  const docRef = doc(db, ORDERS_COLLECTION, cleanId);
  
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as Order);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error subscribing to order:', error);
      onUpdate(null);
    }
  );
}

// Live real-time all orders subscription (for Admin panel)
export function subscribeToAllOrders(onUpdate: (orders: Order[]) => void) {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      onUpdate(orders);
    },
    (error) => {
      console.error('Error fetching all orders in realtime:', error);
      onUpdate([]);
    }
  );
}

// Update order status (Admin)
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  extra?: Partial<Order>
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, {
    status: newStatus,
    ...(extra || {}),
  });
}

// Save contact inquiry in Firestore
export async function saveContactMessage(input: {
  name: string;
  phone: string;
  message: string;
}): Promise<void> {
  const messageDocRef = doc(collection(db, MESSAGES_COLLECTION));
  const contactMsg: ContactMessage = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    createdAt: new Date().toLocaleString(),
    timestamp: Date.now(),
  };
  await setDoc(messageDocRef, contactMsg);
}
