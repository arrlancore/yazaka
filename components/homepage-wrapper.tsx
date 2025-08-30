"use client";

import { ReactNode } from "react";
import PullToRefresh from "@/components/ui/pull-to-refresh";

interface HomepageWrapperProps {
  children: ReactNode;
}

export default function HomepageWrapper({ children }: HomepageWrapperProps) {
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