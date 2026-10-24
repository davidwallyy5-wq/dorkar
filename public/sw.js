// Service Worker for Dorkar PWA & Web Push Background Notifications
const CACHE_NAME = 'dorkar-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push notification event listener
self.addEventListener('push', (event) => {
  let data = { title: '🔔 নতুন নোটিফিকেশন', body: 'দরকার প্ল্যাটফর্মে নতুন আপডেট এসেছে।' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || { url: '/' },
    tag: data.tag || 'dorkar-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || '🔔 দরকার নোটিফিকেশন', options));
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if (targetUrl) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      // If not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
