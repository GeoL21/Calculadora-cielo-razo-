// Cambia la versión cada vez que actualices archivos para forzar la recarga
const CACHE = 'cielo-raso-v6';
const ARCHIVOS = ['./', 'index.html', 'calculo.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Fuentes de Google: se guardan la primera vez para que funcionen sin internet
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const guardada = await c.match(e.request);
      const red = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }).catch(() => guardada);
      return guardada || red;
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
