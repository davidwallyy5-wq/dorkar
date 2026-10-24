import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppNotification, DeviceToken } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';
const DEVICE_TOKENS_COLLECTION = 'device_tokens';
const NOTIFICATION_PERMISSION_KEY = 'dorkar_notif_permission_requested_v1';

/**
 * Generate unique notification ID
 */
export function generateNotificationId(): string {
  return `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Play a high-quality, synthesized dual-tone order notification chime
 * Uses Web Audio API directly so it NEVER fails from missing audio files or network issues!
 */
export function playOrderNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tone 1: High crisp Bell (880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2: Bright Harmonic chime (1318Hz / E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.12);

    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.12);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.warn('Audio notification chime could not play:', e);
  }
}

/**
 * Request browser push notification permission and register token
 */
export async function registerDeviceForNotifications(
  role: 'owner' | 'rider' | 'customer',
  userId?: string
): Promise<{ success: boolean; token?: string; error?: string; permission: NotificationPermission }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      success: false,
      error: 'এই ব্রাউজারে পুশ নোটিফিকেশন সাপোর্ট করে না।',
      permission: 'denied',
    };
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);

    if (permission !== 'granted') {
      return {
        success: false,
        error: 'নোটিফিকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন।',
        permission,
      };
    }

    // Register Service Worker if supported
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch (swErr) {
        console.warn('Service Worker registration note:', swErr);
      }
    }

    // Create a unique client device ID or retrieve existing
    let deviceToken = localStorage.getItem('dorkar_device_token_v1');
    if (!deviceToken) {
      deviceToken = `DEV-${role}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('dorkar_device_token_v1', deviceToken);
    }

    const now = new Date();
    const tokenDoc: DeviceToken = {
      id: deviceToken,
      token: deviceToken,
      role,
      userId: userId || undefined,
      userAgent: navigator.userAgent.substring(0, 150),
      enabled: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timestamp: Date.now(),
    };

    await setDoc(doc(db, DEVICE_TOKENS_COLLECTION, deviceToken), tokenDoc);

    return {
      success: true,
      token: deviceToken,
      permission,
    };
  } catch (err: any) {
    console.error('Error registering device notifications:', err);
    return {
      success: false,
      error: err.message || 'নোটিফিকেশন চালু করতে সমস্যা হয়েছে।',
      permission: Notification.permission,
    };
  }
}

/**
 * Check current notification permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Dispatch an actual notification:
 * 1. Saves Firestore Notification document in real-time
 * 2. Displays native browser/mobile push banner if supported
 * 3. Plays audible alert chime
 */
export async function sendAppNotification(params: {
  type: AppNotification['type'];
  targetRole: 'owner' | 'rider' | 'customer' | 'all';
  targetRiderId?: string;
  orderId?: string;
  title: string;
  body: string;
}): Promise<AppNotification> {
  const notifId = generateNotificationId();
  const now = new Date();
  const dateFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
  });

  const notification: AppNotification = {
    id: notifId,
    type: params.type,
    targetRole: params.targetRole,
    targetRiderId: params.targetRiderId || undefined,
    orderId: params.orderId || undefined,
    title: params.title,
    body: params.body,
    read: false,
    createdAt: dateFormatted,
    timestamp: Date.now(),
  };

  // 1. Save to Firestore
  try {
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notifId), notification);
  } catch (e) {
    console.error('Could not save notification to Firestore:', e);
  }

  // 2. Play audible order bell if it is a new order
  if (params.type === 'new_order' || params.type === 'order_assigned') {
    playOrderNotificationSound();
  }

  // 3. Show native Web Push / Notification if permission granted
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const clickUrl = params.targetRole === 'rider'
        ? `/?panel=rider&orderId=${params.orderId || ''}`
        : `/?panel=admin&orderId=${params.orderId || ''}`;

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(params.title, {
            body: params.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: params.orderId || notifId,
            renotify: true,
            data: { url: clickUrl, orderId: params.orderId },
          } as any);
        });
      } else {
        const notif = new Notification(params.title, {
          body: params.body,
          tag: params.orderId || notifId,
        });
        notif.onclick = () => {
          window.focus();
          if (params.orderId) {
            window.location.href = clickUrl;
          }
        };
      }
    }
  } catch (pushErr) {
    console.warn('Native notification display warning:', pushErr);
  }

  return notification;
}

/**
 * Subscribe in realtime to notifications targeted at Owner or Rider
 */
export function subscribeToNotifications(
  role: 'owner' | 'rider',
  riderId: string | undefined,
  onUpdate: (notifications: AppNotification[]) => void
) {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        const notif = docSnap.data() as AppNotification;
        if (
          notif.targetRole === 'all' ||
          notif.targetRole === role ||
          (role === 'rider' && notif.targetRiderId && notif.targetRiderId === riderId)
        ) {
          list.push(notif);
        }
      });
      onUpdate(list);
    },
    (err) => {
      console.error('Error subscribing to notifications:', err);
      onUpdate([]);
    }
  );
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (e) {
    console.error('Error marking notification as read:', e);
  }
}

/**
 * Mark all notifications for a role as read
 */
export async function markAllNotificationsAsRead(notifications: AppNotification[]): Promise<void> {
  const unread = notifications.filter((n) => !n.read);
  const promises = unread.map((n) => updateDoc(doc(db, NOTIFICATIONS_COLLECTION, n.id), { read: true }));
  await Promise.allSettled(promises);
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
  } catch (e) {
    console.error('Error deleting notification:', e);
  }
}
