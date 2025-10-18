import type { Database } from "@/types/database";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient<Database> | null = null;
let cachedAuthClient: SupabaseClient<Database> | null = null;

/**
 * Get Supabase client for storage operations (no auth persistence)
 * Used for public file uploads/downloads
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Read from public vars, with fallback to non-prefixed names for compatibility
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return cachedClient;
}

/**
 * Get Supabase client with auth enabled
 * Used for authenticated operations (favourites, remixes, etc.)
 */
export function getSupabaseAuthClient(): SupabaseClient<Database> | null {
  if (typeof window === "undefined") {
    console.log("[Supabase] Running on server, returning null");
    return null;
  }

  // Read from public vars, with fallback to non-prefixed names for compatibility
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  console.log("[Supabase] Environment check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPrefix: supabaseUrl?.substring(0, 30),
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Supabase] Missing credentials! Check your .env.local file");
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL:",
      supabaseUrl ? "SET" : "MISSING"
    );
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      supabaseAnonKey ? "SET" : "MISSING"
    );
    return null;
  }

  if (!cachedAuthClient) {
    console.log("[Supabase] Creating new auth client");
    cachedAuthClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
      },
    });
  } else {
    console.log("[Supabase] Using cached auth client");
  }

  return cachedAuthClient;
}
