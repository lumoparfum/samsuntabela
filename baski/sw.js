const VERSION = 1;
const CACHE = 'uzman-reklam-v' + VERSION;
const urls = [
    '/baski/',
    '/baski/index.html',
    '/baski/css/style.css',
    '/baski/js/data.js',
    '/baski/js/main.js',
    '/baski/manifest.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(urls))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response('Çevrimdışı', { status: 503 })))
    );
});
