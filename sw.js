// اولویت با اینترنت؛ اگر نبود از کش. فایل جدید همیشه جایگزین می‌شود.
const CACHE = 'hmi-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      const res = await fetch(e.request, {cache: 'no-cache'});
      if (res && res.ok && new URL(e.request.url).origin === location.origin) {
        const c = await caches.open(CACHE); c.put(e.request, res.clone());
      }
      return res;
    } catch (err) {
      const hit = await caches.match(e.request);
      if (hit) return hit;
      throw err;
    }
  })());
});
