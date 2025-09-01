"use client";

import { ReactNode, useEffect } from "react";
import PullToRefresh from "@/components/ui/pull-to-refresh";
import { swManager } from "@/lib/pwa/sw-registration";

interface HomepageWrapperProps {
  children: ReactNode;
}

export default function HomepageWrapper({ children }: HomepageWrapperProps) {
  // Check for app updates on homepage visit
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        console.log('HomepageWrapper: Checking for updates...');
        await swManager.checkForHomepageUpdate();
      } catch (error) {
        console.error('HomepageWrapper: Failed to check for updates:', error);
      }
    };

    // Wait a bit longer for both service worker and toast component to be ready
    console.log('HomepageWrapper: Setting up update check timer');
    setTimeout(checkUpdates, 2000);
  }, []);

  const handleRefresh = async () => {
    // Simulate refresh action - in a real app, this would refetch data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trigger haptic feedback on refresh completion
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    // Force page reload for now - could be optimized to just refetch data
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {children}
    </PullToRefresh>
  );
}