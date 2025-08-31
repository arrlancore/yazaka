import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  try {
    const supabase = createClient();

    const body = await req.json();
    const { 
      playerId, 
      preferences = {},
      timezone
    } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Find existing subscription
    const { data: existingSubscription, error: findError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('onesignal_player_id', playerId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Subscription not found. Please subscribe first.' },
          { status: 404 }
        );
      }
      
      console.error('Error finding subscription:', findError);
      return NextResponse.json(
        { error: 'Database error finding subscription' },
        { status: 500 }
      );
    }

    // Merge new preferences with existing metadata
    const currentMetadata = existingSubscription.metadata as any || {};
    const updatedMetadata = {
      ...currentMetadata,
      prayerTimeScheduleAdjustment: preferences.reminderMinutes ? -Math.abs(preferences.reminderMinutes) : currentMetadata.prayerTimeScheduleAdjustment || -10,
      playSound: preferences.sound ?? currentMetadata.playSound ?? true,
      enableVibration: preferences.vibrate ?? currentMetadata.enableVibration ?? true,
      reminderEnabled: preferences.prayerReminders ?? currentMetadata.reminderEnabled ?? true,
      customPrayerNames: {
        ...currentMetadata.customPrayerNames,
        fajr: "Subuh",
        dhuhr: "Dzuhur", 
        asr: "Ashar",
        maghrib: "Maghrib",
        isha: "Isya"
      }
    };

    // Update subscription preferences
    const updateData: any = {
      metadata: updatedMetadata,
      updated_at: new Date().toISOString()
    };

    // Update timezone if provided
    if (timezone) {
      updateData.timezone = timezone;
    }

    // Update enabled status if provided
    if (typeof preferences.prayerReminders === 'boolean') {
      updateData.prayer_notifications_enabled = preferences.prayerReminders;
    }

    const { data, error: updateError } = await supabase
      .from('notification_subscriptions')
      .update(updateData)
      .eq('onesignal_player_id', playerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription preferences:', updateError);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    // TODO: Update OneSignal Journey user properties
    // This would typically involve calling OneSignal's REST API to:
    // 1. Update player tags with new preferences
    // 2. Re-enroll in Journey if preferences changed significantly
    // 3. Update timezone for prayer time calculations

    console.log('Preferences updated successfully:', {
      id: data.id,
      playerId,
      enabled: data.prayer_notifications_enabled,
      timezone: data.timezone,
      metadata: data.metadata
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      subscription: {
        id: data.id,
        playerId: data.onesignal_player_id,
        enabled: data.prayer_notifications_enabled,
        timezone: data.timezone,
        preferences: data.metadata
      }
    });

  } catch (error) {
    console.error('Error in OneSignal preferences API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();

    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Find subscription by player ID
    const { data: subscription, error } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('onesignal_player_id', playerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      
      console.error('Error finding subscription:', error);
      return NextResponse.json(
        { error: 'Database error finding subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        playerId: subscription.onesignal_player_id,
        enabled: subscription.prayer_notifications_enabled,
        timezone: subscription.timezone,
        preferences: subscription.metadata,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at
      }
    });

  } catch (error) {
    console.error('Error in OneSignal get preferences API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}