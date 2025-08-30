"use client";

import { useEffect } from 'react';
import { swManager } from '@/lib/pwa/sw-registration';

/**
 * Service Worker Provider Component
 * Initializes service worker when component mounts
 */
export default function ServiceWorkerProvider() {
  useEffect(() => {
    // Initialize service worker
    swManager.init();

    // Listen for prayer times sync events
    const handlePrayerTimesSync = (event: CustomEvent) => {
      console.log('Prayer times synced:', event.detail);
      // You could dispatch a global state update here
    };

    window.addEventListener('prayertimes-sync', handlePrayerTimesSync as EventListener);

    return () => {
      window.removeEventListener('prayertimes-sync', handlePrayerTimesSync as EventListener);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}