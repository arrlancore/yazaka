# Disabled server code

The site is a fully static export (`output: "export"`) served by Cloudflare as
static assets, so there is no server to run API routes. These routes were moved
out of `app/` (Next.js rejects route handlers in a static export). This folder
is not routed and is excluded from `tsconfig.json`.

- `api/upload/route.ts` (S3 presigned uploads)
- `api/notifications/onesignal/{subscribe,preferences,unsubscribe}/route.ts`
  (OneSignal subscription management backed by Supabase)

They are disabled pending a move to a separate Worker or a Supabase Edge
Function. The notification UI and `lib/pwa/notifications.ts` no longer call
these endpoints.
