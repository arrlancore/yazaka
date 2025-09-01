"use client";

import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

/**
 * PWA Update Toast Component
 * Listens for PWA update events and shows user-friendly toast notifications
 */
export default function UpdateToast() {
  const { toast } = useToast();

  useEffect(() => {
    console.log('UpdateToast: Setting up event listener for pwa-update-available');
    
    const handlePWAUpdate = (event: CustomEvent) => {
      console.log('UpdateToast: Received pwa-update-available event:', event.detail);
      const { applyUpdate } = event.detail;

      console.log('UpdateToast: Showing toast notification');
      toast({
        title: "App Update Available",
        description: "A new version of Bekhair is ready. Update now for the latest features.",
        duration: 30000, // Show for 30 seconds
        action: (
          <ToastAction onClick={applyUpdate} altText="Apply app update">
            Update Now
          </ToastAction>
        ),
      });
    };

    // Listen for PWA update events
    window.addEventListener('pwa-update-available', handlePWAUpdate as EventListener);
    console.log('UpdateToast: Event listener attached');

    return () => {
      console.log('UpdateToast: Removing event listener');
      window.removeEventListener('pwa-update-available', handlePWAUpdate as EventListener);
    };
  }, [toast]);

  return null;
}