import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Supabase Client
// Guards against missing env vars gracefully so dev works without credentials.
// ─────────────────────────────────────────────────────────────────────────────

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// createClient requires the bare project URL (https://xyz.supabase.co).
// Strip any path suffix (/rest/v1, /auth/v1, etc.) and trailing slashes so a
// misconfigured URL does not silently redirect OAuth to the wrong endpoint.
const supabaseUrl = rawUrl
  .replace(/\/(rest|auth|storage|realtime)(\/v\d+)?.*$/, "")
  .replace(/\/+$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  }
);

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type SupabaseClient = typeof supabase;
