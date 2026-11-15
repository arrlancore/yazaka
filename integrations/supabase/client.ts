import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Supabase/auth is optional. Without NEXT_PUBLIC_SUPABASE_* env vars the app still
// builds and runs; auth calls simply fail at runtime. Placeholders keep
// createBrowserClient from throwing at import time (e.g. during `next build`).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
