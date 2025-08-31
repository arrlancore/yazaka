import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const body = await req.json();
    const { playerId, userId = null } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Find the subscription
    const { data: existingSubscription, error: findError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('onesignal_player_id', playerId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        // Subscription not found, but that's okay for unsubscribe
        return NextResponse.json({
          success: true,
          message: 'Subscription not found, already unsubscribed'
        });
      }
      
      console.error('Error finding subscription:', findError);
      return NextResponse.json(
        { error: 'Database error finding subscription' },
        { status: 500 }
      );
    }

    // Disable notifications instead of deleting the record (keeps history)
    const { data, error: updateError } = await supabase
      .from('notification_subscriptions')
      .update({
        prayer_notifications_enabled: false,
        updated_at: new Date().toISOString()
      })
      .eq('onesignal_player_id', playerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to disable subscription' },
        { status: 500 }
      );
    }

    // TODO: Remove user from OneSignal Journey
    // This would typically involve calling OneSignal's REST API to:
    // 1. Remove player from Journey workflows
    // 2. Clear relevant player tags
    // 3. Update subscription status in OneSignal

    console.log('Subscription disabled successfully:', {
      id: data.id,
      playerId,
      userId,
      enabled: data.prayer_notifications_enabled
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from prayer notifications',
      subscription: {
        id: data.id,
        playerId: data.onesignal_player_id,
        enabled: data.prayer_notifications_enabled,
        timezone: data.timezone,
        preferences: data.metadata
      }
    });

  } catch (error) {
    console.error('Error in OneSignal unsubscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    // Completely delete the subscription record
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .delete()
      .eq('onesignal_player_id', playerId)
      .select();

    if (error) {
      console.error('Error deleting subscription:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      );
    }

    console.log('Subscription deleted completely:', {
      playerId,
      deletedCount: data?.length || 0
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted completely',
      deletedCount: data?.length || 0
    });

  } catch (error) {
    console.error('Error in OneSignal delete subscription API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}