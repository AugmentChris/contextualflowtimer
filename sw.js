// Bump this whenever any precached file changes — otherwise clients keep
// serving the old cached versions indefinitely (the cache-first strategy
// below never re-checks the network for a URL it already has).
const CACHE_NAME = 'cadence-static-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './src/app.js',
  './src/audio.js',
  './src/backup.js',
  './src/chain.js',
  './src/data.js',
  './src/focus.js',
  './src/icons.js',
  './src/notifications.js',
  './src/persistence.js',
  './src/settings.js',
  './src/soundscape.js',
  './src/tokens.js',
  './src/ui.js',
  './src/utils.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Cross-origin (Google Fonts) — let the browser handle it natively rather
  // than proxying through here, so it isn't subject to the service worker's
  // own CSP connect-src.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
