# PRD: Prayer Time Notifications (Next-Prayer Only) via OneSignal Journeys

## Summary
Implement reliable Prayer Time notifications across iOS PWA, Android, and Desktop using OneSignal Journeys for automated time-based workflows and local in-app notifications when the app is active. We leverage OneSignal's Journey builder to handle next prayer scheduling automatically, eliminating the need for custom server-side cron jobs.

## Goals
- Deliver prayer time notifications precisely at user-local prayer times.
- Work on iOS PWAs (installed to Home Screen) over HTTPS.
- Use OneSignal Journeys to automatically schedule next prayer notifications.
- Respect user preferences (enable/disable, reminder minutes, sound/vibrate).

## Non-Goals
- Custom server-side scheduling/cron jobs.
- Full calendar scheduling of all future prayers.
- Native iOS/Android apps.
- Complex segmentation beyond user-level enablement and timezone.

## User Stories
- As a user, I can enable prayer notifications and receive them even when the app is closed.
- As a user with the app open, I receive the notification locally without waiting for push.
- As a user, I can disable notifications at any time.

## Current Implementation
**What's Already Built:**
- ✅ Service Worker (`public/sw.js`) with push/notificationclick handlers
- ✅ `PrayerNotificationManager` class for local notifications with setTimeout scheduling
- ✅ `NotificationSetup.tsx` component with permission UI and preferences
- ✅ localStorage-based preferences storage
- ✅ Support for reminder notifications (X minutes before prayer)
- ✅ Test notification functionality

**Current Limitations:**
- ❌ Only works when app is active (setTimeout approach)
- ❌ No background notifications when app is closed/killed
- ❌ Notifications don't work on iOS PWA when app is backgrounded
- ❌ No server-side scheduling for reliability

## Technical Overview (**Updated: Supabase Cron Approach**)
- Client (active app): schedule only-next-prayer using a single setTimeout; on fire, show local notification and schedule the next.
- Background/killed: **Supabase PostgreSQL cron job** runs every 5 minutes to send notifications via OneSignal REST API.
- Data: Store OneSignal Player ID, timezone, preferences, **next_prayer_time**, and last notification sent.

## Architecture
**Service Worker Integration:**
- Extend existing `public/sw.js`:
  - Add `importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');` at top
  - Keep existing `push` and `notificationclick` handlers (already compatible with OneSignal payload format)
  - Maintain current caching/fetch behavior
- Add OneSignal Worker Files:
  - `public/OneSignalSDKWorker.js`
  - `public/OneSignalSDKUpdaterWorker.js`

**Client Integration:**
- Create new `components/pwa/OneSignalProvider.tsx` for initialization
- Extend existing `components/pwa/NotificationSetup.tsx`:
  - Add OneSignal Player ID registration
  - Keep existing localStorage preferences
  - Integrate with current notification permission flow
- Keep existing `PrayerNotificationManager` for local notifications (when app is active)
- Server (**Updated: Supabase Cron Approach**):
  - Supabase migration: create `notification_subscriptions` table with `next_prayer_time` field.
  - API routes:
    - `POST /api/notifications/onesignal/subscribe` (store player ID + prefs/timezone + next prayer time)
    - `POST /api/notifications/onesignal/unsubscribe` (disable notifications)
  - **Supabase Cron Job**:
    - PostgreSQL function runs every 5 minutes via `pg_cron`
    - Queries subscriptions where `next_prayer_time <= NOW()`
    - Sends notifications via OneSignal REST API
    - Updates `next_prayer_time` for next prayer

## Data Model (Supabase) (**Updated Schema**)
- Table: `notification_subscriptions`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `onesignal_player_id TEXT UNIQUE NOT NULL`
  - `user_id UUID NULL` (references `auth.users.id` if logged in, NULL for anonymous)
  - `prayer_notifications_enabled BOOLEAN DEFAULT FALSE NOT NULL`
  - `timezone TEXT NOT NULL` (IANA, e.g., "Asia/Jakarta")
  - `metadata JSONB DEFAULT '{}'::jsonb` (flexible preferences storage)
  - **`next_prayer_time TIMESTAMPTZ`** (when to send next notification)
  - **`next_prayer_name TEXT`** (name of next prayer: "Subuh", "Dzuhur", etc.)
  - **`last_notification_sent TIMESTAMPTZ`** (prevent duplicate sends)
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ DEFAULT NOW()`

**Metadata JSON Structure:**
```json
{
  "prayerTimeScheduleAdjustment": -10,  // minutes before prayer (negative for "before")
  "playSound": true,
  "enableVibration": true,
  "reminderEnabled": true,
  "customPrayerNames": {
    "fajr": "Subuh",
    "dhuhr": "Dzuhur"
  }
}
```

Future notification types can be added as additional boolean columns. The metadata field allows flexible per-user preferences that OneSignal Journeys can access.

## Client Logic
**Enhanced NotificationSetup.tsx:**
- Extend existing permission flow:
  - On enable: Request permission → Initialize OneSignal → Get Player ID → Sync localStorage preferences to database metadata → POST to backend → Start local timer
  - On disable: Clear local timer → POST unsubscribe → Remove from OneSignal Journey
- Preference sync: Map existing localStorage preferences to database metadata format
- Maintain existing UI (reminderMinutes dropdown, sound/vibration toggles)

**Enhanced PrayerNotificationManager:**
- Keep existing `setTimeout` approach for active app notifications  
- Add OneSignal Player ID integration
- Add metadata sync methods: `syncPreferencesToDatabase()`, `loadPreferencesFromDatabase()`
- Maintain compatibility with existing `schedulePrayerNotifications()` method
- Add Journey subscription/unsubscription methods

## Server Logic (**Updated: Supabase Cron Approach**)
- **Supabase Cron Job** (`pg_cron` extension):
  - Runs every 5 minutes: `*/5 * * * *`
  - PostgreSQL function `send_prayer_notifications()`
  - Queries active subscriptions where `next_prayer_time <= NOW()`
  - Sends HTTP requests to OneSignal REST API
  - Updates `next_prayer_time` and `last_notification_sent`
- **Prayer Time Calculation**:
  - Uses existing prayer times API or calculation library
  - Calculates next prayer based on user timezone
  - Applies reminder offset from metadata (e.g., -10 minutes)
- **Notification Payload** (sent via OneSignal REST API):
```json
{
  "app_id": "YOUR_ONESIGNAL_APP_ID",
  "include_player_ids": ["player_id"],
  "headings": {"en": "🕌 Waktu Dzuhur"},
  "contents": {"en": "Telah tiba waktu shalat Dzuhur (12:15)"},
  "data": {"url": "/jadwal-shalat", "prayer": "Dzuhur"},
  "android_sound": "default",
  "ios_sound": "default"
}
```

## iOS Requirements
- PWA must be installed to Home Screen.
- Origin must be HTTPS.
- Permission prompt must be user-initiated.

## Configuration
- Env vars (Next.js + server):
  - `ONESIGNAL_APP_ID`
  - `ONESIGNAL_API_KEY` (server only)
  - `ONESIGNAL_REST_ENDPOINT` (default OneSignal base)
- Worker paths:
  - `serviceWorkerPath: '/sw.js'`
  - `serviceWorkerParam: { scope: '/' }`
  - `oneSignalWorkerPaths`: `/OneSignalSDKWorker.js`, `/OneSignalSDKUpdaterWorker.js`

## Rollout Plan (**Updated**)
1. ✅ Add worker files + SW importScripts.
2. ✅ Add OneSignal init provider; gate behind user toggle.
3. ✅ Add subscribe/unsubscribe API and migration; store Player ID.
4. **Update database schema** with `next_prayer_time` fields.
5. **Create Supabase cron job** with `pg_cron` extension.
6. **Implement prayer time calculation** and OneSignal REST API integration.
7. QA on iOS PWA (installed), Android, Desktop.
8. Monitor cron job execution and notification delivery.

## Telemetry & Observability
- Log subscription success/failure, Player ID stored.
- Track delivery/open using OneSignal dashboards and Journey analytics.
- App logs for local timer events and SW `push`/`notificationclick`.

## Risks & Mitigations
- iOS PWA not installed -> no web push: show UI hint to install.
- Timezone drift: store and regularly refresh timezone; update Journey user properties on change.
- Duplicate delivery (local + push): prefer local if app visible; Journey still sends push but user may not notice duplicates.

## Test Plan
- iOS PWA installed: background and killed states trigger push at correct times.
- Active app: local timer fires exactly at boundary; next timer scheduled immediately.
- Toggle on/off quickly: no stray notifications after disable.
- Timezone change: reschedule reflects new times.

## Acceptance Criteria (**Updated**)
- Toggling on in `NotificationSetup` registers Player ID and calculates next prayer time.
- Exactly one notification per prayer time is delivered via Supabase cron job.
- After a notification fires, `next_prayer_time` is automatically updated for the next prayer.
- Cron job runs every 5 minutes with ≤5 minute delivery accuracy.
- Works on iOS PWA, Android Chrome, and Desktop.

## Open Questions
- Multi-device support: store multiple Player IDs per user? If yes, use a separate table keyed by device.
- Presence detection to suppress push if user active? Optional future.
