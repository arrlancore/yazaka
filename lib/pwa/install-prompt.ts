"use client";

/**
 * PWA Installation Manager
 * Handles app installation prompts and detection
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isStandalone = false;
  private installCallbacks: ((canInstall: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  /**
   * Initialize installation detection
   */
  private init() {
    // Check if already installed
    this.isStandalone = this.checkStandaloneMode();
    this.isInstalled = this.checkInstallationStatus();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallCallbacks(true);
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed');
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstallCallbacks(false);
      
      // Track installation event
      this.trackInstallation('installed');
    });

    // Check for installation changes
    this.detectInstallationChanges();
  }

  /**
   * Check if app is running in standalone mode
   */
  private checkStandaloneMode(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  /**
   * Check if app is already installed
   */
  private checkInstallationStatus(): boolean {
    // Multiple ways to detect installation
    const isStandalone = this.checkStandaloneMode();
    const hasStandaloneHistory = localStorage.getItem('pwa-standalone') === 'true';
    
    if (isStandalone && !hasStandaloneHistory) {
      localStorage.setItem('pwa-standalone', 'true');
    }
    
    return isStandalone || hasStandaloneHistory;
  }

  /**
   * Detect installation changes (when user adds/removes app)
   */
  private detectInstallationChanges() {
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    
    standaloneQuery.addEventListener('change', (e) => {
      this.isStandalone = e.matches;
      console.log('PWA: Standalone mode changed:', e.matches);
    });
  }

  /**
   * Notify callbacks about install availability
   */
  private notifyInstallCallbacks(canInstall: boolean) {
    this.installCallbacks.forEach(callback => callback(canInstall));
  }

  /**
   * Show installation prompt
   */
  async showInstallPrompt(): Promise<{ outcome: string; platform: string } | null> {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available');
      return null;
    }

    try {
      // Show the prompt
      this.deferredPrompt.prompt();
      
      // Wait for user choice
      const choiceResult = await this.deferredPrompt.userChoice;
      console.log('PWA: User choice:', choiceResult.outcome);
      
      // Track the result
      this.trackInstallation(choiceResult.outcome);
      
      // Clear the prompt
      this.deferredPrompt = null;
      this.notifyInstallCallbacks(false);
      
      return choiceResult;
    } catch (error) {
      console.error('PWA: Error showing install prompt:', error);
      return null;
    }
  }

  /**
   * Check if install prompt is available
   */
  canInstall(): boolean {
    return !this.isInstalled && !!this.deferredPrompt;
  }

  /**
   * Check if app is installed
   */
  isAppInstalled(): boolean {
    return this.isInstalled || this.isStandalone;
  }

  /**
   * Check if running in standalone mode
   */
  isRunningStandalone(): boolean {
    return this.isStandalone;
  }

  /**
   * Register callback for install availability changes
   */
  onInstallAvailable(callback: (canInstall: boolean) => void) {
    this.installCallbacks.push(callback);
    
    // Call immediately with current state
    callback(this.canInstall());
    
    // Return unsubscribe function
    return () => {
      const index = this.installCallbacks.indexOf(callback);
      if (index > -1) {
        this.installCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get platform-specific install instructions
   */
  getInstallInstructions(): { platform: string; steps: string[] } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
      return {
        platform: 'Android Chrome',
        steps: [
          'Tap menu (⋮) di browser',
          'Pilih "Tambahkan ke layar utama"',
          'Konfirmasi untuk menginstal aplikasi'
        ]
      };
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return {
        platform: 'iOS Safari',
        steps: [
          'Tap tombol Bagikan (□↗)',
          'Gulir dan tap "Tambah ke Layar Utama"',
          'Tap "Tambah" untuk menginstal'
        ]
      };
    } else if (userAgent.includes('mac')) {
      return {
        platform: 'macOS Safari/Chrome',
        steps: [
          'Klik menu browser atau address bar',
          'Pilih "Install Bekhair" atau "Add to Dock"',
          'Konfirmasi untuk menginstal aplikasi'
        ]
      };
    } else {
      return {
        platform: 'Desktop',
        steps: [
          'Klik ikon install di address bar',
          'Atau buka menu browser dan pilih "Install Bekhair"',
          'Konfirmasi untuk menginstal aplikasi'
        ]
      };
    }
  }

  /**
   * Track installation events (can be extended for analytics)
   */
  private trackInstallation(outcome: string) {
    try {
      // Store install metrics
      const installData = {
        outcome,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        standalone: this.isStandalone
      };
      
      localStorage.setItem('pwa-install-data', JSON.stringify(installData));
      
      // You can extend this to send to analytics
      console.log('PWA: Install tracked:', installData);
    } catch (error) {
      console.error('PWA: Error tracking installation:', error);
    }
  }

  /**
   * Get install metrics for debugging
   */
  getInstallMetrics(): any {
    try {
      const data = localStorage.getItem('pwa-install-data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Reset installation state (for debugging)
   */
  resetInstallState() {
    localStorage.removeItem('pwa-standalone');
    localStorage.removeItem('pwa-install-data');
    this.isInstalled = false;
    this.isStandalone = this.checkStandaloneMode();
    console.log('PWA: Install state reset');
  }
}

// Create singleton instance
export const installManager = new PWAInstallManager();