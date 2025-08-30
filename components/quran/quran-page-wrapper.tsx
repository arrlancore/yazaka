"use client";

import { ReactNode } from "react";
import PullToRefresh from "@/components/ui/pull-to-refresh";

interface QuranPageWrapperProps {
  children: ReactNode;
}

export default function QuranPageWrapper({ children }: QuranPageWrapperProps) {
  const handleRefresh = async () => {
    // Simulate refresh for static content
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Trigger haptic feedback on refresh completion
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    // For now, just reload. In a real app, we might refetch dynamic content like last read position
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {children}
    </PullToRefresh>
  );
}