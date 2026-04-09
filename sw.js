const CACHE_NAME = 'compressly-v1';

// Aquí listamos TODO lo que la app necesita para funcionar sin internet
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/notificaciones.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.2.1/compressor.min.js',
    'https://unpkg.com/lucide@latest',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// Instalación: Guardamos los archivos en la memoria caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en caché listos para uso offline');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercepción: Cuando la app pide un archivo, lo sacamos del caché si no hay internet
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en el caché, lo devuelve. Si no, va a internet.
                return response || fetch(event.request);
            })
    );
});