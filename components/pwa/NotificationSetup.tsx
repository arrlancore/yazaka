"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationManager, NotificationPreferences } from '@/lib/pwa/notifications';
import { cn } from '@/lib/utils';

interface NotificationSetupProps {
  onPermissionChanged?: (granted: boolean) => void;
}

export default function NotificationSetup({ onPermissionChanged }: NotificationSetupProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (notificationManager.isSupported()) {
      setPermission(notificationManager.getPermissionStatus());
    }
    setPreferences(notificationManager.getPreferences());
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    
    try {
      const result = await notificationManager.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onPermissionChanged?.(true);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationManager.testNotification();
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    notificationManager.updatePreferences({ [key]: value });
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
              {permission === 'granted' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {permission === 'denied' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={cn(
                "text-sm font-medium",
                permission === 'granted' && "text-green-600",
                permission === 'denied' && "text-red-600",
                permission === 'default' && "text-orange-600"
              )}>
                {permission === 'granted' && 'Diizinkan'}
                {permission === 'denied' && 'Ditolak'}
                {permission === 'default' && 'Belum Diatur'}
              </span>
            </div>
          </div>

          {permission !== 'granted' && (
            <Button 
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="w-full"
            >
              {isRequesting ? 'Meminta Izin...' : 'Izinkan Notifikasi'}
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
                <Switch
                  id="prayer-reminders"
                  checked={preferences.prayerReminders}
                  onCheckedChange={(checked) => 
                    updatePreference('prayerReminders', checked)
                  }
                />
              </div>

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