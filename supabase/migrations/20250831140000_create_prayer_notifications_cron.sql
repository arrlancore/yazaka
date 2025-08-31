-- Create Supabase cron job for prayer time notifications
-- Requires pg_cron extension and OneSignal REST API integration

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to send prayer notifications via OneSignal REST API
CREATE OR REPLACE FUNCTION send_prayer_notifications()
RETURNS void AS $$
DECLARE
    subscription_record RECORD;
    prayer_times JSONB;
    next_prayer_info JSONB;
    onesignal_payload JSONB;
    http_response TEXT;
    current_date_str TEXT;
BEGIN
    -- Get current date string for comparison
    current_date_str := TO_CHAR(NOW(), 'YYYY-MM-DD');
    
    -- Log cron job execution
    RAISE LOG 'Prayer notifications cron job started at %', NOW();
    
    -- Find all subscriptions ready for notification
    FOR subscription_record IN
        SELECT *
        FROM notification_subscriptions
        WHERE prayer_notifications_enabled = true
          AND next_prayer_time IS NOT NULL
          AND next_prayer_time <= NOW()
          AND (last_notification_sent IS NULL OR last_notification_sent < next_prayer_time)
    LOOP
        BEGIN
            -- Get prayer times from metadata
            prayer_times := subscription_record.metadata -> 'prayerTimes';
            
            -- Check if prayer times are for today, if not skip (will be updated by app)
            IF subscription_record.metadata ->> 'prayerTimesDate' != current_date_str THEN
                RAISE LOG 'Skipping notification for player % - prayer times outdated', subscription_record.onesignal_player_id;
                CONTINUE;
            END IF;
            
            -- Prepare OneSignal notification payload
            onesignal_payload := jsonb_build_object(
                'app_id', current_setting('app.onesignal_app_id'),
                'include_player_ids', jsonb_build_array(subscription_record.onesignal_player_id),
                'headings', jsonb_build_object('en', '🕌 Waktu ' || subscription_record.next_prayer_name),
                'contents', jsonb_build_object('en', 'Telah tiba waktu shalat ' || subscription_record.next_prayer_name || ' (' || 
                    CASE subscription_record.next_prayer_name
                        WHEN 'Subuh' THEN prayer_times ->> 'fajr'
                        WHEN 'Dzuhur' THEN prayer_times ->> 'dhuhr'
                        WHEN 'Ashar' THEN prayer_times ->> 'asr'
                        WHEN 'Maghrib' THEN prayer_times ->> 'maghrib'
                        WHEN 'Isya' THEN prayer_times ->> 'isha'
                        ELSE '00:00'
                    END || ')'),
                'data', jsonb_build_object(
                    'url', '/jadwal-shalat',
                    'prayer', subscription_record.next_prayer_name,
                    'type', 'prayer_time'
                ),
                'android_sound', CASE WHEN subscription_record.metadata ->> 'playSound' = 'true' THEN 'default' ELSE null END,
                'ios_sound', CASE WHEN subscription_record.metadata ->> 'playSound' = 'true' THEN 'default' ELSE null END,
                'chrome_icon', 'https://bekhair.com/images/icons/icon-192x192.png',
                'firefox_icon', 'https://bekhair.com/images/icons/icon-192x192.png'
            );
            
            -- Send notification via OneSignal REST API using HTTP extension
            -- Note: This requires the http extension to be enabled in Supabase
            SELECT content INTO http_response
            FROM http((
                'POST',
                'https://onesignal.com/api/v1/notifications',
                ARRAY[
                    http_header('Authorization', 'Basic ' || current_setting('app.onesignal_api_key')),
                    http_header('Content-Type', 'application/json')
                ],
                'application/json',
                onesignal_payload::text
            )::http_request);
            
            -- Update last notification sent
            UPDATE notification_subscriptions
            SET last_notification_sent = NOW()
            WHERE id = subscription_record.id;
            
            -- Calculate and update next prayer time
            next_prayer_info := calculate_next_prayer_from_stored_times(
                prayer_times,
                subscription_record.next_prayer_name,
                subscription_record.timezone,
                (subscription_record.metadata ->> 'reminderMinutes')::integer
            );
            
            -- Update next prayer info
            UPDATE notification_subscriptions
            SET 
                next_prayer_time = (next_prayer_info ->> 'timestamp')::timestamptz,
                next_prayer_name = next_prayer_info ->> 'name'
            WHERE id = subscription_record.id;
            
            RAISE LOG 'Sent prayer notification to player % for %', 
                subscription_record.onesignal_player_id, subscription_record.next_prayer_name;
                
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'Error sending notification to player %: %', 
                subscription_record.onesignal_player_id, SQLERRM;
        END;
    END LOOP;
    
    RAISE LOG 'Prayer notifications cron job completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Helper function to calculate next prayer from stored prayer times
CREATE OR REPLACE FUNCTION calculate_next_prayer_from_stored_times(
    prayer_times JSONB,
    current_prayer_name TEXT,
    user_timezone TEXT,
    reminder_minutes INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
    prayer_order TEXT[] := ARRAY['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    current_index INTEGER;
    next_prayer_name TEXT;
    next_prayer_time TEXT;
    next_prayer_timestamp TIMESTAMPTZ;
    result JSONB;
BEGIN
    -- Find current prayer index
    current_index := array_position(prayer_order, current_prayer_name);
    
    IF current_index IS NULL THEN
        RAISE EXCEPTION 'Invalid prayer name: %', current_prayer_name;
    END IF;
    
    -- Get next prayer
    IF current_index = array_length(prayer_order, 1) THEN
        -- If current is Isya (last prayer), next is tomorrow's Subuh
        next_prayer_name := 'Subuh';
        next_prayer_time := prayer_times ->> 'fajr';
        -- Add 1 day for tomorrow
        next_prayer_timestamp := (CURRENT_DATE + INTERVAL '1 day' + next_prayer_time::time)::timestamptz;
    ELSE
        -- Get next prayer today
        next_prayer_name := prayer_order[current_index + 1];
        next_prayer_time := CASE next_prayer_name
            WHEN 'Subuh' THEN prayer_times ->> 'fajr'
            WHEN 'Dzuhur' THEN prayer_times ->> 'dhuhr'
            WHEN 'Ashar' THEN prayer_times ->> 'asr'
            WHEN 'Maghrib' THEN prayer_times ->> 'maghrib'
            WHEN 'Isya' THEN prayer_times ->> 'isha'
        END;
        next_prayer_timestamp := (CURRENT_DATE + next_prayer_time::time)::timestamptz;
    END IF;
    
    -- Apply reminder offset (subtract minutes for "before" notification)
    IF reminder_minutes > 0 THEN
        next_prayer_timestamp := next_prayer_timestamp - (reminder_minutes || ' minutes')::interval;
    END IF;
    
    -- Return result as JSON
    result := jsonb_build_object(
        'name', next_prayer_name,
        'time', next_prayer_time,
        'timestamp', next_prayer_timestamp
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Schedule the cron job to run every 5 minutes
-- Note: This requires superuser privileges in Supabase
SELECT cron.schedule(
    'prayer-notifications-job',
    '*/5 * * * *',
    'SELECT send_prayer_notifications();'
);

-- Set required configuration for OneSignal API (to be set via Supabase dashboard)
-- These need to be configured in Supabase Settings → Database → Custom Config
-- ALTER SYSTEM SET app.onesignal_app_id TO 'your_onesignal_app_id';
-- ALTER SYSTEM SET app.onesignal_api_key TO 'your_onesignal_rest_api_key';

-- Create log table for debugging cron job execution
CREATE TABLE IF NOT EXISTS prayer_notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT NOT NULL,
    prayer_name TEXT NOT NULL,
    notification_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    onesignal_response TEXT
);

-- Index for log cleanup
CREATE INDEX idx_prayer_logs_sent_at ON prayer_notification_logs(notification_sent_at);

-- Function to cleanup old logs (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_prayer_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM prayer_notification_logs 
    WHERE notification_sent_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule log cleanup daily at 2 AM
SELECT cron.schedule(
    'cleanup-prayer-logs',
    '0 2 * * *',
    'SELECT cleanup_prayer_logs();'
);