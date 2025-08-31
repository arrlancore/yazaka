"use client";

import { useEffect } from 'react';
import { swManager } from '@/lib/pwa/sw-registration';
import UpdateToast from './UpdateToast';

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

  // Return UpdateToast component to handle update notifications
  return <UpdateToast />;
}