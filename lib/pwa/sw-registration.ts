"use client";

/**
 * Service Worker Registration and Management
 * Handles registration, updates, and communication with service worker
 */

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private initPromise: Promise<void> | null = null;
  private isUpdateAvailable = false;
  private waitingWorker: ServiceWorker | null = null;
  /** Version (CACHE_VERSION) of the waiting worker we already notified about */
  private notifiedVersion: string | null = null;
  private isApplyingUpdate = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  /**
   * Initialize service worker registration (idempotent)
   */
  init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.doInit();
    }
    return this.initPromise;
  }

  private async doInit() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      // OneSignal registers this same /sw.js but with ?appId=...&sdkVersion=...
      // query params. Re-registering it as plain '/sw.js' changes the script
      // URL, which forces a new (identical) worker to install every time the
      // two fight over it. Reuse an existing registration instead.
      const existing = await navigator.serviceWorker.getRegistration('/');
      const existingUrl =
        existing?.active?.scriptURL || existing?.waiting?.scriptURL || existing?.installing?.scriptURL;
      if (existing && existingUrl && new URL(existingUrl).pathname === '/sw.js') {
        this.registration = existing;
      } else {
        this.registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }

      console.log('Service Worker registered successfully');

      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event);
      });

      // A worker may already be waiting from a previous visit
      if (this.registration.waiting) {
        void this.evaluateWaitingWorker(this.registration.waiting);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Handle service worker update
   */
  private handleUpdateFound() {
    const newWorker = this.registration?.installing;
    if (!newWorker) return;

    console.log('New service worker installing...');

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        void this.evaluateWaitingWorker(newWorker);
      }
    });
  }

  /**
   * Ask a worker for its CACHE_VERSION. Resolves null if it doesn't answer
   * (e.g. an older sw.js without the GET_VERSION handler).
   */
  private getWorkerVersion(worker: ServiceWorker, timeoutMs = 1500): Promise<string | null> {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => resolve(null), timeoutMs);
      channel.port1.onmessage = (event) => {
        clearTimeout(timer);
        resolve(event.data?.version ?? null);
      };
      try {
        worker.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
      } catch {
        clearTimeout(timer);
        resolve(null);
      }
    });
  }

  /**
   * Decide whether a waiting worker is a real new build (show toast) or the
   * same build re-installed under a different URL (activate silently).
   */
  private async evaluateWaitingWorker(worker: ServiceWorker) {
    if (this.isApplyingUpdate) return;

    const active = this.registration?.active;
    const [waitingVersion, activeVersion] = await Promise.all([
      this.getWorkerVersion(worker),
      active ? this.getWorkerVersion(active) : Promise.resolve(null),
    ]);

    if (waitingVersion && activeVersion && waitingVersion === activeVersion) {
      console.log('SW Manager: Waiting worker is the same build, activating silently');
      worker.postMessage({ type: 'SKIP_WAITING' });
      return;
    }

    this.isUpdateAvailable = true;
    this.waitingWorker = worker;

    // Notify once per waiting build (falls back to scriptURL for old workers)
    const key = waitingVersion ?? worker.scriptURL;
    if (this.notifiedVersion === key) return;
    this.notifiedVersion = key;

    console.log('SW Manager: New version available', { activeVersion, waitingVersion });
    this.showUpdateNotification();
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification() {
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: {
        updateAvailable: true,
        applyUpdate: () => this.applyUpdate()
      }
    }));
  }

  /**
   * Activate the waiting worker, then reload once it has taken control
   */
  async applyUpdate() {
    if (this.isApplyingUpdate) return;
    this.isApplyingUpdate = true;

    const worker = this.registration?.waiting ?? this.waitingWorker;
    if (!worker || !navigator.serviceWorker.controller) {
      window.location.reload();
      return;
    }

    console.log('SW Manager: Applying update...');

    let reloaded = false;
    const reload = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };

    // Reload only after the new worker is controlling the page; reloading
    // earlier leaves it "waiting" and the toast comes straight back.
    navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
    worker.postMessage({ type: 'SKIP_WAITING' });

    // Safety net in case controllerchange never fires
    setTimeout(reload, 4000);
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
   * Check for updates on homepage visit using service worker registration
   */
  async checkForHomepageUpdate(): Promise<void> {
    await this.init();
    if (!this.registration) return;

    try {
      console.log('SW Manager: Checking for homepage updates...');
      // Triggers updatefound -> evaluateWaitingWorker if a new sw.js exists
      await this.registration.update();

      if (this.registration.waiting) {
        await this.evaluateWaitingWorker(this.registration.waiting);
      }
    } catch (error) {
      console.error('Error checking homepage update:', error);
    }
  }

  /**
   * Get update status for debugging
   */
  getUpdateStatus() {
    return {
      updateAvailable: this.isUpdateAvailable,
      notifiedVersion: this.notifiedVersion,
      waitingWorker: !!this.waitingWorker,
      registration: !!this.registration
    };
  }
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();