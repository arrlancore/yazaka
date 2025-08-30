"use client";

/**
 * Push Notifications Manager for Prayer Times
 * Handles permission requests, scheduling, and prayer time reminders
 */

export interface PrayerTimeNotification {
  name: string;
  time: string;
  beforeMinutes?: number;
}

export interface NotificationPreferences {
  enabled: boolean;
  prayerReminders: boolean;
  reminderMinutes: number;
  sound: boolean;
  vibrate: boolean;
}

export class PrayerNotificationManager {
  private storageKey = 'bekhair-notifications';
  private preferences: NotificationPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  /**
   * Load notification preferences from localStorage
   */
  private loadPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') {
      return this.getDefaultPreferences();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }

    return this.getDefaultPreferences();
  }

  /**
   * Save notification preferences to localStorage
   */
  private savePreferences(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      enabled: false,
      prayerReminders: true,
      reminderMinutes: 10,
      sound: true,
      vibrate: true
    };
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission === 'granted') {
      this.preferences.enabled = true;
      this.savePreferences();
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.preferences.enabled = true;
        this.savePreferences();
      }

      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  /**
   * Schedule prayer time notifications
   */
  async schedulePrayerNotifications(prayerTimes: PrayerTimeNotification[]): Promise<void> {
    if (!this.preferences.enabled || !this.preferences.prayerReminders) {
      return;
    }

    // Clear existing scheduled notifications
    this.clearScheduledNotifications();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (const prayer of prayerTimes) {
      try {
        // Parse prayer time
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerDateTime = new Date(today);
        prayerDateTime.setHours(hours, minutes, 0, 0);

        // If prayer time has passed today, schedule for tomorrow
        if (prayerDateTime <= now) {
          prayerDateTime.setDate(prayerDateTime.getDate() + 1);
        }

        // Schedule main notification
        this.scheduleNotification(
          `prayer-${prayer.name.toLowerCase()}`,
          prayerDateTime,
          `Waktu ${prayer.name}`,
          `Telah tiba waktu shalat ${prayer.name} (${prayer.time})`
        );

        // Schedule reminder notification (if enabled and supported)
        if (this.preferences.reminderMinutes > 0) {
          const reminderTime = new Date(prayerDateTime);
          reminderTime.setMinutes(reminderTime.getMinutes() - this.preferences.reminderMinutes);

          if (reminderTime > now) {
            this.scheduleNotification(
              `reminder-${prayer.name.toLowerCase()}`,
              reminderTime,
              `Pengingat ${prayer.name}`,
              `${this.preferences.reminderMinutes} menit lagi waktu shalat ${prayer.name}`
            );
          }
        }
      } catch (error) {
        console.error(`Error scheduling notification for ${prayer.name}:`, error);
      }
    }

    console.log(`Scheduled notifications for ${prayerTimes.length} prayer times`);
  }

  /**
   * Schedule a single notification using setTimeout (fallback for browsers without proper scheduling)
   */
  private scheduleNotification(
    id: string,
    datetime: Date,
    title: string,
    body: string
  ): void {
    const delay = datetime.getTime() - Date.now();
    
    if (delay <= 0) return; // Don't schedule past notifications

    // Store timeout ID for cleanup
    const timeoutId = setTimeout(() => {
      this.showNotification(title, body);
      this.removeScheduledNotification(id);
    }, delay);

    this.storeScheduledNotification(id, Number(timeoutId));
  }

  /**
   * Show immediate notification
   */
  async showNotification(title: string, body: string, options?: NotificationOptions): Promise<void> {
    if (!this.preferences.enabled || Notification.permission !== 'granted') {
      return;
    }

    const defaultOptions: any = {
      body,
      icon: '/images/icons/icon-192x192.png',
      badge: '/images/icons/icon-72x72.png',
      tag: 'prayer-reminder',
      silent: !this.preferences.sound,
      vibrate: this.preferences.vibrate ? [200, 100, 200] : undefined,
      data: {
        url: '/jadwal-shalat',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'Lihat Jadwal',
          icon: '/images/icons/icon-96x96.png'
        }
      ]
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Check if service worker is available for better notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Let service worker handle the notification
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, finalOptions);
      });
    } else {
      // Fallback to direct notification
      new Notification(title, finalOptions);
    }
  }

  /**
   * Update notification preferences
   */
  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
  }

  /**
   * Get current preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Clear all scheduled notifications
   */
  clearScheduledNotifications(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('scheduled-notifications');
      if (stored) {
        const timeouts = JSON.parse(stored);
        Object.values(timeouts).forEach((timeoutId: any) => {
          if (typeof timeoutId === 'number') {
            clearTimeout(timeoutId as unknown as NodeJS.Timeout);
          }
        });
        localStorage.removeItem('scheduled-notifications');
      }
    } catch (error) {
      console.error('Error clearing scheduled notifications:', error);
    }
  }

  /**
   * Store scheduled notification timeout ID
   */
  private storeScheduledNotification(id: string, timeoutId: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('scheduled-notifications') || '{}';
      const timeouts = JSON.parse(stored);
      timeouts[id] = timeoutId;
      localStorage.setItem('scheduled-notifications', JSON.stringify(timeouts));
    } catch (error) {
      console.error('Error storing scheduled notification:', error);
    }
  }

  /**
   * Remove scheduled notification timeout ID
   */
  private removeScheduledNotification(id: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('scheduled-notifications');
      if (stored) {
        const timeouts = JSON.parse(stored);
        delete timeouts[id];
        localStorage.setItem('scheduled-notifications', JSON.stringify(timeouts));
      }
    } catch (error) {
      console.error('Error removing scheduled notification:', error);
    }
  }

  /**
   * Test notification (for settings page)
   */
  async testNotification(): Promise<void> {
    await this.showNotification(
      'Test Notifikasi Bekhair',
      'Notifikasi berhasil diaktifkan! Anda akan menerima pengingat waktu shalat.',
      {
        tag: 'test-notification'
      }
    );
  }

  /**
   * Clean up when component unmounts
   */
  cleanup(): void {
    this.clearScheduledNotifications();
  }
}

// Create singleton instance
export const notificationManager = new PrayerNotificationManager();