import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: no incremental cache / queue / tag cache bindings.
// All pages are rendered per request or prerendered at build time and served
// as static assets. To enable ISR/revalidate, add an R2 incremental cache.
export default defineCloudflareConfig();
