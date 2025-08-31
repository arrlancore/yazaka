// Service Worker for Bekhair PWA
// Provides offline functionality for Quran reading and prayer times

// Import OneSignal SDK Worker for push notifications
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

// Dynamic cache versioning based on build timestamp
const CACHE_VERSION = '0.1.0.1756649416'; // Update this with each deploy
const CACHE_NAME = `bekhair-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `bekhair-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `bekhair-dynamic-v${CACHE_VERSION}`;

// Assets to cache immediately (app shell)
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/quran',
  '/jadwal-shalat',
  '/hafalan-quran',
  '/doa',
  '/arah-kiblat',
  '/manifest.json'
];

// API endpoints to cache for offline access
const QURAN_API_BASE = 'https://quran-api-tau.vercel.app';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static app shell
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('bekhair-') && !cacheName.includes(`v${CACHE_VERSION}`)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content with fallback strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.origin === location.origin) {
    // App shell - Cache First strategy
    event.respondWith(handleAppShell(request));
  } else if (url.origin === QURAN_API_BASE) {
    // Quran API - Network First with cache fallback
    event.respondWith(handleQuranAPI(request));
  } else if (url.protocol === 'https:') {
    // External resources - Cache First
    event.respondWith(handleExternalResources(request));
  }
});

// App Shell - Cache First Strategy
async function handleAppShell(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, serving offline page');
    return caches.match('/offline') || new Response('Offline');
  }
}

// Quran API - Network First Strategy
async function handleQuranAPI(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      
      // Cleanup old cached surahs (keep only last 10)
      cleanupQuranCache();
      
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed for Quran API, checking cache');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response with offline message
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Content not available offline',
        cached: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// External Resources - Cache First Strategy
async function handleExternalResources(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Cleanup function to keep only recent Quran cache entries
async function cleanupQuranCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    // Filter Quran surah requests
    const surahRequests = requests.filter(req => 
      req.url.includes('/surah/') && 
      req.url.includes(QURAN_API_BASE)
    );
    
    // Keep only the 10 most recent (assuming they're added in chronological order)
    if (surahRequests.length > 10) {
      const toDelete = surahRequests.slice(0, surahRequests.length - 10);
      await Promise.all(toDelete.map(req => cache.delete(req)));
      console.log(`[SW] Cleaned up ${toDelete.length} old Quran cache entries`);
    }
  } catch (error) {
    console.error('[SW] Error cleaning up cache:', error);
  }
}

// Background sync for prayer times (if supported)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'prayer-times-sync') {
    event.waitUntil(syncPrayerTimes());
  }
});

// Sync prayer times in background
async function syncPrayerTimes() {
  try {
    // This would sync with prayer times API
    console.log('[SW] Syncing prayer times in background');
    
    // Get stored location from IndexedDB or localStorage
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      clients[0].postMessage({
        type: 'SYNC_PRAYER_TIMES',
        data: { timestamp: Date.now() }
      });
    }
  } catch (error) {
    console.error('[SW] Error syncing prayer times:', error);
  }
}

// Handle push notifications for prayer times
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const { title, body, icon, badge } = data;
    
    const options = {
      body,
      icon: icon || '/images/icons/icon-192x192.png',
      badge: badge || '/images/icons/icon-72x72.png',
      tag: 'prayer-reminder',
      vibrate: [200, 100, 200],
      data: {
        url: '/jadwal-shalat',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'Lihat Jadwal',
          icon: '/images/icons/icon-96x96.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('[SW] Error handling push notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const url = action === 'view' ? data.url : '/';
      
      // Check if app is already open
      const existingClient = clients.find(client => 
        client.url.includes(self.location.origin)
      );
      
      if (existingClient) {
        // Focus existing window and navigate if needed
        existingClient.focus();
        existingClient.postMessage({
          type: 'NAVIGATE',
          data: { url: url }
        });
      } else {
        // Open new window
        self.clients.openWindow(url);
      }
    })
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_SURAH':
      // Pre-cache specific surah
      if (data.surahNumber) {
        const url = `${QURAN_API_BASE}/surah/${data.surahNumber}`;
        caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          fetch(url).then(response => {
            if (response.ok) {
              cache.put(url, response);
            }
          });
        });
      }
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});