import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculatePrayerTimes, calculateNextPrayerFromStored, formatPrayerTimesForStorage } from '@/lib/prayer-time-calculator';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const body = await req.json();
    const { 
      playerId, 
      userId = null, 
      preferences = {}, 
      timezone = 'Asia/Jakarta',
      latitude,
      longitude
    } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Calculate today's prayer times using lat/long
    const todayPrayerTimes = await calculatePrayerTimes(latitude, longitude, timezone);
    const prayerTimesStorage = formatPrayerTimesForStorage(todayPrayerTimes);
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Calculate next prayer time
    const nextPrayer = calculateNextPrayerFromStored(
      prayerTimesStorage,
      timezone,
      preferences.reminderMinutes || 0
    );

    // Prepare metadata with location and prayer times
    const metadata = {
      latitude,
      longitude,
      prayerTimes: prayerTimesStorage,
      prayerTimesDate: currentDate,
      reminderMinutes: preferences.reminderMinutes || 0,
      playSound: preferences.sound ?? true,
      enableVibration: preferences.vibrate ?? true,
      reminderEnabled: preferences.prayerReminders ?? true,
      customPrayerNames: {
        fajr: "Subuh",
        dhuhr: "Dzuhur",
        asr: "Ashar",
        maghrib: "Maghrib", 
        isha: "Isya"
      }
    };

    // Check if subscription already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('onesignal_player_id', playerId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return NextResponse.json(
        { error: 'Database error checking subscription' },
        { status: 500 }
      );
    }

    let subscription;

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('notification_subscriptions')
        .update({
          user_id: userId,
          prayer_notifications_enabled: true,
          timezone,
          metadata,
          next_prayer_time: nextPrayer.timestamp.toISOString(),
          next_prayer_name: nextPrayer.name,
          updated_at: new Date().toISOString()
        })
        .eq('onesignal_player_id', playerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      subscription = data;
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from('notification_subscriptions')
        .insert({
          onesignal_player_id: playerId,
          user_id: userId,
          prayer_notifications_enabled: true,
          timezone,
          metadata,
          next_prayer_time: nextPrayer.timestamp.toISOString(),
          next_prayer_name: nextPrayer.name
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      subscription = data;
    }

    // TODO: Add user to OneSignal Journey for automated prayer notifications
    // This would typically involve calling OneSignal's REST API to:
    // 1. Update player tags with timezone and preferences
    // 2. Add player to Journey for prayer time workflows
    
    console.log('Subscription saved successfully:', {
      id: subscription.id,
      playerId,
      userId,
      enabled: subscription.prayer_notifications_enabled
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        playerId: subscription.onesignal_player_id,
        enabled: subscription.prayer_notifications_enabled,
        timezone: subscription.timezone,
        preferences: subscription.metadata
      }
    });

  } catch (error) {
    console.error('Error in OneSignal subscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}