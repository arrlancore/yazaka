"use client";

/**
 * Service Worker Registration and Management
 * Handles registration, updates, and communication with service worker
 */

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isUpdateAvailable = false;
  private updateNotificationShown = false;
  private waitingWorker: ServiceWorker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  /**
   * Initialize service worker registration
   */
  async init() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Listen for controller changes (don't auto-reload)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed - ready for manual reload');
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event);
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Handle service worker update
   */
  private handleUpdateFound() {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    console.log('New service worker installing...');

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New service worker is available
          console.log('New service worker available');
          this.isUpdateAvailable = true;
          this.waitingWorker = newWorker;
          
          // Only show notification once
          if (!this.updateNotificationShown) {
            this.showUpdateNotification();
            this.updateNotificationShown = true;
          }
        }
      }
    });
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification() {
    // Dispatch custom event for toast notification
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: {
        updateAvailable: true,
        applyUpdate: () => this.applyUpdate()
      }
    }));
  }

  /**
   * Apply update and reload app
   */
  applyUpdate() {
    if (!this.waitingWorker) return;

    this.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    
    // Wait a moment for service worker to activate, then reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /**
   * Skip waiting and activate new service worker (legacy method)
   */
  skipWaiting() {
    this.applyUpdate();
  }

  /**
   * Handle messages from service worker
   */
  private handleMessage(event: MessageEvent) {
    // Safely extract data from event
    if (!event.data) {
      console.log('Received empty message from service worker');
      return;
    }

    const { type, data } = event.data;

    switch (type) {
      case 'SYNC_PRAYER_TIMES':
        console.log('Background sync completed for prayer times');
        // Refresh prayer times data
        window.dispatchEvent(new CustomEvent('prayertimes-sync', { detail: data }));
        break;

      case 'NAVIGATE':
        if (data && data.url) {
          console.log('Navigating to:', data.url);
          window.location.href = data.url;
        } else {
          console.log('Navigate message received but no URL provided');
        }
        break;

      case 'NOTIFICATION_CLICK':
        // Handle OneSignal notification clicks
        if (data && data.url) {
          console.log('Notification clicked, navigating to:', data.url);
          window.location.href = data.url;
        } else {
          console.log('Notification clicked, navigating to default page');
          // Default to prayer times page for prayer notifications
          window.location.href = '/jadwal-shalat';
        }
        break;

      default:
        console.log('Unknown message from SW:', type, data);
    }
  }

  /**
   * Request background sync for prayer times
   */
  async requestPrayerTimesSync() {
    if (!this.registration) return;

    try {
      // Check if sync is supported
      if ('sync' in this.registration) {
        await (this.registration as any).sync.register('prayer-times-sync');
        console.log('Prayer times background sync requested');
      } else {
        console.log('Background sync not supported in this browser');
      }
    } catch (error) {
      console.error('Background sync not supported:', error);
    }
  }

  /**
   * Cache specific surah for offline access
   */
  cacheSurah(surahNumber: number) {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_SURAH',
      data: { surahNumber }
    });
  }

  /**
   * Check if app is running in standalone mode (installed PWA)
   */
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  /**
   * Check if service worker is ready
   */
  isReady(): boolean {
    return !!this.registration && !!navigator.serviceWorker.controller;
  }

  /**
   * Get cache status for debugging
   */
  async getCacheStatus(): Promise<{ static: number; dynamic: number; total: number }> {
    if (!('caches' in window)) {
      return { static: 0, dynamic: 0, total: 0 };
    }

    try {
      const cacheNames = await caches.keys();
      let staticCount = 0;
      let dynamicCount = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        if (cacheName.includes('static')) {
          staticCount += keys.length;
        } else if (cacheName.includes('dynamic')) {
          dynamicCount += keys.length;
        }
      }

      return {
        static: staticCount,
        dynamic: dynamicCount,
        total: staticCount + dynamicCount
      };
    } catch (error) {
      console.error('Error getting cache status:', error);
      return { static: 0, dynamic: 0, total: 0 };
    }
  }

  /**
   * Clear all caches (for debugging)
   */
  async clearAllCaches(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }

  /**
   * Manually check for updates
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return this.isUpdateAvailable;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  /**
   * Get update status for debugging
   */
  getUpdateStatus() {
    return {
      updateAvailable: this.isUpdateAvailable,
      notificationShown: this.updateNotificationShown,
      waitingWorker: !!this.waitingWorker,
      registration: !!this.registration
    };
  }
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();