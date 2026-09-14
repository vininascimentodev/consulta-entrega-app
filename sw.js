const CACHE_NAME = 'consulta-entrega-v1';
const API_CACHE = 'consulta-entrega-api-v1';

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];


const apiUrls = [
    'https://viacep.com.br/ws/',
    'https://nominatim.openstreetmap.org/reverse'
];


self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache de assets criado');
            return cache.addAll(urlsToCache);
        })
    );
    

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando Service Worker...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Remove caches antigos
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
                        console.log('[SW] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});


self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

   
    if (request.method !== 'GET') {
        return;
    }

    if (isLocalAsset(url)) {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    console.log('[SW] Cache hit (local):', url.pathname);
                    return response;
                }

                return fetch(request).then((response) => {
                
                    if (!response || response.status !== 200) {
                        return response;
                    }

                
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                   
                    return caches.match('./index.html');
                });
            })
        );
        return;
    }

    if (isExternalApi(url)) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Validar resposta
                    if (!response || response.status !== 200) {
                        return response;
                    }

                
                    const responseToCache = response.clone();
                    caches.open(API_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Se falhar, tentar cache
                    console.log('[SW] Usando cache para API:', url.href);
                    return caches.match(request).then((response) => {
                        if (response) {
                            return response;
                        }
                        // Se não tiver cache, retornar erro genérico
                        return new Response(
                            JSON.stringify({
                                erro: 'Modo offline: dados do cache indisponível'
                            }),
                            {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    event.respondWith(
        fetch(request).catch(() => {
            return caches.match('./index.html');
        })
    );
});


function isLocalAsset(url) {
    return (
        url.origin === self.location.origin &&
        (url.pathname.endsWith('.html') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.json') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.webp') ||
         url.pathname.endsWith('.svg') ||
         url.pathname === '/')
    );
}

function isExternalApi(url) {
    return (
        url.href.includes('viacep.com.br') ||
        url.href.includes('nominatim.openstreetmap.org')
    );
}

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
