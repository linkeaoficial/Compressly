// 🚀 Aumentamos la versión del caché a v4
const CACHE_NAME = 'compressly-v6';

const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/idioma.js',
    '/interfaz.js',
    '/script.js',
    '/modales.js', // 🚀 ¡Nuestro nuevo módulo entra al caché!
    '/motor-lotes.js',
    '/chatbot-Compressly.js',
    '/notificaciones.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.2.1/compressor.min.js',
    'https://unpkg.com/lucide@latest',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // 🚀 Obliga al nuevo Service Worker a instalarse inmediatamente
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Iniciando carga de caché versión:', CACHE_NAME);
            return Promise.all(
                urlsToCache.map(url => {
                    return fetch(url, { mode: url.includes('http') ? 'no-cors' : 'cors' })
                        .then(response => cache.put(url, response))
                        .catch(err => console.log('No se pudo cachear:', url, err));
                })
            );
        })
    );
});

// 🚀 NUEVO: Limpiador de Caché. Elimina la basura de versiones pasadas automáticamente
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control de inmediato sin recargar
    );
});

// 🚀 ESTRATEGIA: "Network First" (Internet Primero, Caché de respaldo)
self.addEventListener('fetch', event => {
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => caches.match(event.request))
    );
});