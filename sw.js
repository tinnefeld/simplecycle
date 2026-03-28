const CACHE_NAME = 'simplecycle-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/src/app.js',
  '/src/bluetooth/bluetooth.js',
  '/src/bluetooth/ftms.js',
  '/src/session/session.js',
  '/src/session/distance.js',
  '/src/workout/workout.js',
  '/src/workout/parser.js',
  '/src/ui/display.js',
  '/src/ui/controls.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Cache-first: serve from cache, fall back to network.
  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request))
  );
});
