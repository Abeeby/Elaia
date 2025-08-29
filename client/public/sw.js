// Service Worker pour ELAÏA Studio
// Gère les notifications push et le cache hors ligne

const CACHE_NAME = 'elaia-studio-v1';
const STATIC_CACHE = 'elaia-static-v1';

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/elaia-logo.svg',
  '/vite.svg',
  // Ajouter d'autres ressources statiques selon les besoins
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installé');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Cache ouvert, ajout des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Erreur lors du cache des ressources statiques:', error);
      })
  );

  // Forcer l'activation immédiate
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Prendre le contrôle de tous les clients
  self.clients.claim();
});

// Gestion des requêtes fetch
self.addEventListener('fetch', (event) => {
  // Pour les requêtes de navigation, essayer le cache d'abord
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  // Pour les autres requêtes, stratégie "Network First" avec fallback au cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est valide, la mettre en cache
        if (response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, essayer le cache
        return caches.match(event.request);
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue:', event);

  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Nouvelle notification d\'ELAÏA Studio',
    icon: '/elaia-logo.svg',
    badge: '/elaia-logo.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      ...data,
    },
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/elaia-logo.svg',
      },
      {
        action: 'dismiss',
        title: 'Fermer',
      },
    ],
    // Personnalisation selon le type de notification
    tag: data.tag || 'elaia-notification',
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'ELAÏA Studio',
      options
    )
  );
});

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification cliquée:', event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'dismiss') {
    return;
  }

  // Ouvrir l'application avec les données de la notification
  const urlToOpen = notificationData.url || '/';

  event.waitUntil(
    clients.matchAll().then((clients) => {
      // Vérifier si l'application est déjà ouverte
      for (const client of clients) {
        if (client.url.includes(urlToOpen)) {
          return client.focus();
        }
      }

      // Sinon, ouvrir une nouvelle fenêtre
      return clients.openWindow(urlToOpen);
    })
  );
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('Synchronisation en arrière-plan:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Logique de synchronisation en arrière-plan
      performBackgroundSync()
    );
  }
});

// Fonction de synchronisation en arrière-plan
async function performBackgroundSync() {
  try {
    console.log('Synchronisation des données en arrière-plan...');

    // Ici, vous pouvez ajouter la logique pour :
    // - Synchroniser les réservations locales
    // - Mettre à jour les données de cache
    // - Envoyer des données en attente

    console.log('Synchronisation terminée');
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('Message reçu du client:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: '1.0.0',
      cacheName: CACHE_NAME
    });
  }
});
