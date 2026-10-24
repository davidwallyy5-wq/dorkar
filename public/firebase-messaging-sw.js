// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  projectId: "splendid-virtue-gdw77",
  appId: "1:861101425148:web:8563afb4305dda9365f279",
  apiKey: "AIzaSyBQJRV6CmRP6FOsF9Qbbq0iXfGijDZjEwk",
  authDomain: "splendid-virtue-gdw77.firebaseapp.com",
  messagingSenderId: "861101425148",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || '🔔 নতুন অর্ডার এসেছে!';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'দরকার ডেলিভারি সার্ভিসে নতুন অর্ডার যুক্ত হয়েছে।',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: payload.data?.url || '/?panel=admin',
      orderId: payload.data?.orderId,
    },
    vibrate: [200, 100, 200],
    tag: payload.data?.orderId || 'dorkar-fcm-order',
    renotify: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if (targetUrl) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
