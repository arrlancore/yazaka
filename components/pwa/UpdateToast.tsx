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
    const handlePWAUpdate = (event: CustomEvent) => {
      const { applyUpdate } = event.detail;

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

    return () => {
      window.removeEventListener('pwa-update-available', handlePWAUpdate as EventListener);
    };
  }, [toast]);

  return null;
}