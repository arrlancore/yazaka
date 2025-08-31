-- Create notification_subscriptions table for OneSignal integration
-- This table stores notification preferences and OneSignal Player IDs for prayer time notifications

CREATE TABLE notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onesignal_player_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer_notifications_enabled BOOLEAN NOT NULL DEFAULT false,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notification_subscriptions_player_id ON notification_subscriptions(onesignal_player_id);
CREATE INDEX idx_notification_subscriptions_user_id ON notification_subscriptions(user_id);
CREATE INDEX idx_notification_subscriptions_enabled ON notification_subscriptions(prayer_notifications_enabled);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notification_subscriptions_updated_at
    BEFORE UPDATE ON notification_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own subscriptions (when authenticated)
CREATE POLICY "Users can manage own subscriptions" ON notification_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Policy: Anonymous users can manage subscriptions by player ID (for unauthenticated users)
CREATE POLICY "Manage anonymous subscriptions" ON notification_subscriptions
    FOR ALL USING (
        user_id IS NULL OR 
        auth.uid() = user_id OR
        auth.role() = 'anon'
    );

-- Policy: Service role can access all subscriptions (for server-side operations)
CREATE POLICY "Service role full access" ON notification_subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comment on table and important columns
COMMENT ON TABLE notification_subscriptions IS 'Stores OneSignal notification subscriptions for prayer time reminders';
COMMENT ON COLUMN notification_subscriptions.onesignal_player_id IS 'Unique OneSignal Player ID for this subscription';
COMMENT ON COLUMN notification_subscriptions.user_id IS 'Associated user ID (NULL for anonymous users)';
COMMENT ON COLUMN notification_subscriptions.prayer_notifications_enabled IS 'Whether prayer notifications are enabled for this subscription';
COMMENT ON COLUMN notification_subscriptions.timezone IS 'IANA timezone identifier for prayer time calculations';
COMMENT ON COLUMN notification_subscriptions.metadata IS 'JSON object storing user preferences like reminderMinutes, sound, vibration, etc.';