"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { notificationManager, NotificationPreferences } from '@/lib/pwa/notifications';
import { useOneSignal } from './OneSignalProvider';
import { cn } from '@/lib/utils';

interface NotificationSetupProps {
  onPermissionChanged?: (granted: boolean) => void;
}

export default function NotificationSetup({ onPermissionChanged }: NotificationSetupProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSyncingToServer, setIsSyncingToServer] = useState(false);
  const [isPrayerReminderLoading, setIsPrayerReminderLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  
  const { 
    isInitialized, 
    playerId, 
    isSubscribed, 
    subscribeUser, 
    unsubscribeUser, 
    updateUserPreferences 
  } = useOneSignal();

  useEffect(() => {
    if (notificationManager.isSupported()) {
      setPermission(notificationManager.getPermissionStatus());
    }
    setPreferences(notificationManager.getPreferences());
  }, []);

  // Auto-sync existing OneSignal subscription with database
  useEffect(() => {
    const syncExistingSubscription = async () => {
      // Only sync if we have an existing OneSignal subscription but haven't synced to server yet
      if (isInitialized && playerId && isSubscribed && permission === 'granted' && preferences) {
        try {
          console.log('Found existing OneSignal subscription, checking database sync...');
          
          // Check if this subscription already exists in our database
          const response = await fetch(`/api/notifications/onesignal/preferences?playerId=${playerId}`);
          
          if (response.status === 404) {
            // Subscription doesn't exist in database, sync it
            console.log('Subscription not found in database, syncing...');
            await syncPreferencesToServer(playerId, preferences);
            console.log('Existing subscription synced to database');
          } else if (response.ok) {
            console.log('Subscription already exists in database');
            
            // Load server preferences but don't update OneSignal tags automatically to avoid conflicts
            const data = await response.json();
            if (data.success && data.subscription) {
              const serverPrefs = data.subscription.preferences;
              console.log('Server preferences:', serverPrefs);
              
              // Only merge critical preferences, don't trigger OneSignal updates
              // This prevents the rapid-fire tag updates that cause conflicts
            }
          }
        } catch (error) {
          console.error('Error syncing existing subscription:', error);
        }
      }
    };

    // Longer delay to ensure OneSignal is fully initialized and stable
    const timer = setTimeout(syncExistingSubscription, 2000);
    return () => clearTimeout(timer);
  }, [isInitialized, playerId, isSubscribed, permission, preferences]);

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    setIsSyncingToServer(true);
    setError(null);
    
    try {
      // First, request notification permission through the legacy manager
      const result = await notificationManager.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Subscribe user to OneSignal
        const oneSignalPlayerId = await subscribeUser();
        
        if (oneSignalPlayerId) {
          // Sync to server with current preferences
          await syncPreferencesToServer(oneSignalPlayerId, preferences);
          
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          onPermissionChanged?.(true);
        } else {
          throw new Error('Failed to subscribe to OneSignal');
        }
      } else if (result === 'denied') {
        setError('Notification permission was denied. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError(error instanceof Error ? error.message : 'Failed to setup notifications');
    } finally {
      setIsRequesting(false);
      setIsSyncingToServer(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationManager.testNotification();
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  // Get user location for prayer time calculation
  const getUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          // Fallback to Jakarta coordinates
          resolve({
            latitude: -6.200000,
            longitude: 106.816666
          });
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  };

  // Sync preferences to server
  const syncPreferencesToServer = async (oneSignalPlayerId: string, prefs: NotificationPreferences | null) => {
    if (!prefs) return;
    
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const location = await getUserLocation();
      
      if (!location) {
        throw new Error('Unable to get user location for prayer time calculation');
      }
      
      // Sync to server database with location
      const response = await fetch('/api/notifications/onesignal/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: oneSignalPlayerId,
          preferences: prefs,
          timezone,
          latitude: location.latitude,
          longitude: location.longitude
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Update OneSignal user properties with error handling
      try {
        await updateUserPreferences({
          ...prefs,
          timezone
        });
      } catch (tagError) {
        // Tag update failures are non-critical, don't fail the entire sync
        console.warn('OneSignal tag update failed (non-critical):', tagError);
      }
      
      console.log('Preferences synced to server successfully');
    } catch (error) {
      console.error('Error syncing preferences to server:', error);
      throw error; // Re-throw so caller can handle it
    }
  };

  // Update preferences only (no location required)
  const updatePreferencesOnServer = async (oneSignalPlayerId: string, prefs: NotificationPreferences) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch('/api/notifications/onesignal/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: oneSignalPlayerId,
          preferences: prefs,
          timezone
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Also update OneSignal tags
      await updateUserPreferences({
        ...prefs,
        timezone
      });

      console.log('Preferences updated on server successfully');
    } catch (error) {
      console.error('Error updating preferences on server:', error);
      throw error; // Re-throw so caller can handle it
    }
  };

  // Handle prayer reminder toggle with proper UX flow
  const handlePrayerReminderToggle = async (enabled: boolean) => {
    if (!preferences) return;

    setIsPrayerReminderLoading(true);
    setError(null);

    try {
      if (enabled) {
        // Enabling prayer reminders - ensure full subscription flow
        if (!playerId || !isSubscribed) {
          throw new Error('OneSignal subscription not active. Please enable notifications first.');
        }

        // Update server first
        const newPreferences = { ...preferences, prayerReminders: true };
        await updatePreferencesOnServer(playerId, newPreferences);

        // Only update local state after successful server update
        setPreferences(newPreferences);
        notificationManager.updatePreferences({ prayerReminders: true });
      } else {
        // Disabling prayer reminders - simple update to database only
        const newPreferences = { ...preferences, prayerReminders: false };
        
        if (playerId && isSubscribed) {
          await updatePreferencesOnServer(playerId, newPreferences);
        }
        
        // Update local state
        setPreferences(newPreferences);
        notificationManager.updatePreferences({ prayerReminders: false });
      }
    } catch (error) {
      console.error('Error toggling prayer reminders:', error);
      setError(error instanceof Error ? error.message : 'Failed to update prayer reminder settings');
    } finally {
      setIsPrayerReminderLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;

    // Handle prayer reminder toggle specially with proper UX flow
    if (key === 'prayerReminders') {
      return handlePrayerReminderToggle(value);
    }
    
    // Throttle OneSignal updates to prevent conflicts
    const now = Date.now();
    if (now - lastUpdateTime < 500) {
      console.log('Throttling preference update to prevent conflicts');
      return;
    }
    setLastUpdateTime(now);
    
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    notificationManager.updatePreferences({ [key]: value });

    // If OneSignal is subscribed, sync to server
    if (playerId && isSubscribed) {
      setIsSyncingToServer(true);
      try {
        // Use lightweight preferences update endpoint
        await updatePreferencesOnServer(playerId, newPreferences);
        
        // Update OneSignal tags after successful server update
        // All non-prayerReminders preferences can update OneSignal tags
        await updateUserPreferences({
          ...newPreferences,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      } catch (error) {
        console.error('Error updating preferences on server:', error);
        setError('Failed to update preferences. Please try again.');
      } finally {
        setIsSyncingToServer(false);
      }
    }
  };

  const handleUnsubscribe = async () => {
    if (!playerId) return;
    
    setIsSyncingToServer(true);
    try {
      // Unsubscribe from OneSignal
      await unsubscribeUser();
      
      // Notify server
      await fetch('/api/notifications/onesignal/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });
      
      console.log('Successfully unsubscribed from prayer notifications');
    } catch (error) {
      console.error('Error unsubscribing:', error);
    } finally {
      setIsSyncingToServer(false);
    }
  };

  if (!notificationManager.isSupported()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BellOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Browser Anda tidak mendukung notifikasi push
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return null; // Loading state
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifikasi Pengingat Shalat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Status Izin Notifikasi</Label>
              <p className="text-sm text-muted-foreground">
                Izinkan notifikasi untuk mendapatkan pengingat waktu shalat
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isSyncingToServer && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              )}
              {permission === 'granted' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {permission === 'denied' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <div className="text-right">
                <span className={cn(
                  "text-sm font-medium block",
                  permission === 'granted' && "text-green-600",
                  permission === 'denied' && "text-red-600",
                  permission === 'default' && "text-orange-600"
                )}>
                  {permission === 'granted' && 'Diizinkan'}
                  {permission === 'denied' && 'Ditolak'}
                  {permission === 'default' && 'Belum Diatur'}
                </span>
                {isSubscribed && playerId && (
                  <span className="text-xs text-muted-foreground">
                    OneSignal Aktif
                  </span>
                )}
              </div>
            </div>
          </div>

          {permission !== 'granted' && (
            <Button 
              onClick={handleRequestPermission}
              disabled={isRequesting || isSyncingToServer}
              className="w-full"
            >
              {isRequesting ? 'Mengatur Notifikasi...' : 'Izinkan Notifikasi'}
            </Button>
          )}

          {permission === 'granted' && isSubscribed && playerId && (
            <Button 
              variant="outline"
              onClick={handleUnsubscribe}
              disabled={isSyncingToServer}
              className="w-full"
            >
              {isSyncingToServer ? 'Menonaktifkan...' : 'Nonaktifkan Notifikasi Push'}
            </Button>
          )}

          {showSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Notifikasi berhasil diaktifkan!
              </p>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        {permission === 'granted' && (
          <>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="prayer-reminders">Pengingat Waktu Shalat</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi ketika tiba waktu shalat
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isPrayerReminderLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  <Switch
                    id="prayer-reminders"
                    checked={preferences.prayerReminders}
                    disabled={isPrayerReminderLoading}
                    onCheckedChange={(checked) => 
                      updatePreference('prayerReminders', checked)
                    }
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label="Dismiss error"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {preferences.prayerReminders && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Pengingat Sebelumnya</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Berapa menit sebelum waktu shalat
                    </p>
                    <Select
                      value={preferences.reminderMinutes.toString()}
                      onValueChange={(value) => 
                        updatePreference('reminderMinutes', parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Tidak ada pengingat sebelumnya</SelectItem>
                        <SelectItem value="5">5 menit sebelumnya</SelectItem>
                        <SelectItem value="10">10 menit sebelumnya</SelectItem>
                        <SelectItem value="15">15 menit sebelumnya</SelectItem>
                        <SelectItem value="30">30 menit sebelumnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound">Suara Notifikasi</Label>
                      <p className="text-sm text-muted-foreground">
                        Putar suara saat notifikasi muncul
                      </p>
                    </div>
                    <Switch
                      id="sound"
                      checked={preferences.sound}
                      onCheckedChange={(checked) => 
                        updatePreference('sound', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="vibrate">Getaran</Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan getaran pada perangkat mobile
                      </p>
                    </div>
                    <Switch
                      id="vibrate"
                      checked={preferences.vibrate}
                      onCheckedChange={(checked) => 
                        updatePreference('vibrate', checked)
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Test Notification */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleTestNotification}
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                Test Notifikasi
              </Button>
            </div>
          </>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Notifikasi Ditolak</h4>
            <p className="text-sm text-red-700 mb-3">
              Untuk mengaktifkan notifikasi, silakan:
            </p>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              <li>Klik ikon kunci di address bar</li>
              <li>Pilih "Izinkan" untuk notifikasi</li>
              <li>Refresh halaman ini</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}