/**
 * SERVICE WORKER - Checklist Hospitalar PWA
 * Gerencia cache, offline e sincronização de dados
 */

const CACHE_NAME = 'checklist-app-v1';
const RUNTIME_CACHE = 'checklist-runtime-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/exibir_checklists.html',
  '/styles.css',
  '/app.js',
  '/script.js',
  '/modules/dataManager.js',
  '/modules/notificationManager.js',
  '/modules/themeManager.js',
  '/utils/constants.js',
  '/utils/helpers.js',
  '/utils/storage.js',
  '/manifest.json'
];

// Instalar o Service Worker e cachear arquivos estáticos
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Cache de ativos estáticos');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[Service Worker] Alguns arquivos não puderam ser cacheados:', err);
        // Não falhar a instalação se alguns arquivos externos não estiverem disponíveis
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Ativar o Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Network First para requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições de outros domínios
  if (url.origin !== location.origin) {
    return;
  }

  // Estratégia Network First com fallback para cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cachear resposta bem-sucedida
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Falhou, tentar cache
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('[Service Worker] Usando cache para:', url.pathname);
            return cachedResponse;
          }

          // Sem cache, retornar página offline
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // Para outros tipos de requisição, retornar erro
          return new Response('Offline - Recurso não disponível', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Sincronização de dados em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-checklists') {
    event.waitUntil(syncChecklists());
  }
});

// Função para sincronizar checklists
async function syncChecklists() {
  try {
    console.log('[Service Worker] Sincronizando checklists...');
    // Aqui você pode adicionar lógica para sincronizar dados com um servidor
    // Por enquanto, apenas registramos o evento
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_SUCCESS',
        message: 'Checklists sincronizados com sucesso'
      });
    });
  } catch (error) {
    console.error('[Service Worker] Erro ao sincronizar:', error);
  }
}

// Notificações push
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Novo evento no Checklist Hospitalar',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%233b82f6" width="192" height="192"/><text x="50%" y="50%" font-size="100" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">✓</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect fill="%233b82f6" width="96" height="96"/><text x="50%" y="50%" font-size="50" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">✓</text></svg>',
    tag: 'checklist-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Checklist Hospitalar', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Procurar janela já aberta
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Abrir nova janela se não houver
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
