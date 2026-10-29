/**
 * Service Worker · Sanctum Rosarium PWA · Beta 1 (v2)
 * Estrategia: Precache de activos críticos + Stale-While-Revalidate + soporte de audios .m4a y 3 Crucifijos PNG.
 */
const CACHE_VERSION = 'sanctum-rosarium-beta1-v2';
const CC0_IMAGE_CACHE = 'sanctum-rosarium-cc0-art-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './data/oraciones-tradicionales.json',
  './data/oraciones-pronunciacion.json',
  './data/misterios-meditaciones.json',
  './data/banco-arte-sacro-cc0.json',
  './data/compendio-rosario-crvxvincet.json',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.svg',
  './assets/img/cover-sanctum-rosarium.jpg',
  './assets/img/crucifijo-1.png',
  './assets/img/crucifijo-2.png',
  './assets/img/crucifijo-3.png',
  './audio/manifest-audio.json',
  './audio/paternoster.m4a',
  './audio/avemaria.m4a',
  './audio/gloria.m4a'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== CC0_IMAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DOWNLOAD_CC0_PACK') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CC0_IMAGE_CACHE).then(async (cache) => {
        let completed = 0;
        for (const u of urls) {
          try {
            const res = await fetch(u);
            if (res.ok) await cache.put(u, res.clone());
          } catch (e) {}
          completed++;
        }
        const clients = await self.clients.matchAll();
        clients.forEach((c) => c.postMessage({ type: 'CC0_PACK_READY', count: completed }));
      })
    );
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'image' || event.request.url.includes('/misterios/')) {
            return caches.match('./assets/img/crucifijo-1.png');
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
