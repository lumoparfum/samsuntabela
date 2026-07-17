const CACHE = 'uzman-reklam-v3';

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll([
            '/baski/', '/baski/index.html', '/baski/css/style.css',
            '/baski/js/data.js', '/baski/js/main.js', '/baski/manifest.json'
        ]))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        )).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).then(res => {
            if (res.ok) {
                caches.open(CACHE).then(cache => cache.put(e.request, res.clone()));
            }
            return res;
        }).catch(() => caches.match(e.request).then(cached => cached || new Response('Çevrimdışı', { status: 503 })))
    );
});
