-- Update notification_subscriptions table for Supabase cron approach
-- Add fields for prayer time tracking and cron job management

-- Add new columns for prayer time management
ALTER TABLE notification_subscriptions 
ADD COLUMN next_prayer_time TIMESTAMPTZ,
ADD COLUMN next_prayer_name TEXT,
ADD COLUMN last_notification_sent TIMESTAMPTZ;

-- Create indexes for cron job performance
CREATE INDEX idx_notification_subscriptions_next_prayer_time 
ON notification_subscriptions(next_prayer_time) 
WHERE prayer_notifications_enabled = true;

CREATE INDEX idx_notification_subscriptions_cron_query 
ON notification_subscriptions(prayer_notifications_enabled, next_prayer_time, last_notification_sent);

-- Add comments for new fields
COMMENT ON COLUMN notification_subscriptions.next_prayer_time IS 'Timestamp of next prayer time for this subscription';
COMMENT ON COLUMN notification_subscriptions.next_prayer_name IS 'Name of next prayer: Subuh, Dzuhur, Ashar, Maghrib, Isya';
COMMENT ON COLUMN notification_subscriptions.last_notification_sent IS 'Timestamp of last sent notification to prevent duplicates';