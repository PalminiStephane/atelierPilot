// Service Worker AtelierPilot — Cache-first pour fonctionnement hors-ligne
const CACHE_NAME = 'atelierpilot-v1';

// Fichiers à mettre en cache lors de l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// Installation : pré-cache des fichiers essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : cache-first, puis réseau, puis fallback
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes vers des API externes
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Ne pas cacher les réponses non valides
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cacher la réponse pour usage hors-ligne
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      // Fallback hors-ligne : retourner la page d'accueil pour les navigations
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
