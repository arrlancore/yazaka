"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { installManager } from '@/lib/pwa/install-prompt';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallPromptProps {
  variant?: 'banner' | 'card' | 'modal';
  className?: string;
  onDismiss?: () => void;
  autoShow?: boolean;
}

export default function InstallPrompt({ 
  variant = 'card', 
  className,
  onDismiss,
  autoShow = false
}: InstallPromptProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check initial state
    setCanInstall(installManager.canInstall());
    setIsInstalled(installManager.isAppInstalled());

    // Listen for install availability changes
    const unsubscribe = installManager.onInstallAvailable((available) => {
      setCanInstall(available && !isDismissed);
    });

    return unsubscribe;
  }, [isDismissed]);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const result = await installManager.showInstallPrompt();
      
      if (result?.outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
      } else if (!result) {
        // Show manual instructions if prompt failed
        setShowInstructions(true);
      }
    } catch (error) {
      console.error('Error installing app:', error);
      setShowInstructions(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setCanInstall(false);
    onDismiss?.();
  };

  // Don't show if installed or dismissed
  if (isInstalled || isDismissed || (!canInstall && !showInstructions && !autoShow)) {
    return null;
  }

  const instructions = installManager.getInstallInstructions();

  if (variant === 'banner') {
    return (
      <AnimatePresence>
        {canInstall && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={cn(
              "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-lg",
              className
            )}
          >
            <div className="flex items-center justify-between p-3 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Install Bekhair</p>
                  <p className="text-xs opacity-80">Akses lebih cepat dari layar utama</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="text-xs"
                >
                  {isInstalling ? 'Installing...' : 'Install'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="w-5 h-5 text-primary" />
            Install Aplikasi
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showInstructions ? (
          <>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Dapatkan pengalaman terbaik dengan menginstall Bekhair di perangkat Anda
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Akses Offline
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Notifikasi Push
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Loading Lebih Cepat
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                {isInstalling ? 'Menginstall...' : 'Install Sekarang'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowInstructions(true)}
                className="px-3"
              >
                Manual
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{instructions.platform}</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Langkah-langkah install manual:
                </p>
                <ol className="text-sm space-y-1">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowInstructions(false)}
              className="w-full"
            >
              Kembali ke Auto Install
            </Button>
          </>
        )}

        {isInstalled && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Aplikasi berhasil diinstall!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}