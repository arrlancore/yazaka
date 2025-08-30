"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export default function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      console.log('Network: Back online');
      setIsOnline(true);
      
      // Show "back online" message briefly
      if (wasOffline) {
        setShowIndicator(true);
        setTimeout(() => {
          setShowIndicator(false);
          setWasOffline(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      console.log('Network: Gone offline');
      setIsOnline(false);
      setWasOffline(true);
      setShowIndicator(true);
    };

    // Listen to network changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check network connectivity periodically
    const checkConnection = async () => {
      try {
        // Try to fetch a small resource to test connectivity
        const response = await fetch('/manifest.json', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        const online = response.ok;
        if (online !== isOnline) {
          setIsOnline(online);
          
          if (!online) {
            setWasOffline(true);
            setShowIndicator(true);
          }
        }
      } catch {
        // Network request failed, likely offline
        if (isOnline) {
          setIsOnline(false);
          setWasOffline(true);
          setShowIndicator(true);
        }
      }
    };

    // Check connection every 30 seconds when online
    // Check every 10 seconds when offline
    const interval = setInterval(checkConnection, isOnline ? 30000 : 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, wasOffline]);

  const handleRetry = async () => {
    try {
      const response = await fetch('/manifest.json', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setIsOnline(true);
        setShowIndicator(false);
        setWasOffline(false);
        
        // Reload the page to refresh content
        window.location.reload();
      }
    } catch {
      console.log('Retry failed, still offline');
    }
  };

  // Don't show indicator if online and was never offline
  if (!showIndicator && (isOnline || !wasOffline)) {
    return null;
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 shadow-lg",
            isOnline 
              ? "bg-green-500 text-white" 
              : "bg-orange-500 text-white",
            className
          )}
        >
          <div className="flex items-center justify-between p-3 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-5 h-5" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isOnline ? 'Kembali Online' : 'Tidak Ada Koneksi'}
                </p>
                <p className="text-xs opacity-90">
                  {isOnline 
                    ? 'Semua fitur tersedia' 
                    : 'Mode offline - fitur terbatas'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isOnline && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRetry}
                  className="text-xs h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowIndicator(false)}
                className="text-xs h-8 px-2 hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to get current online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}