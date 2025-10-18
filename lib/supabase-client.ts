import { env, hasEnvVar, warnMissingEnv } from "@/lib/env";
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

  if (!hasEnvVar("SUPABASE_URL") || !hasEnvVar("SUPABASE_ANON_KEY")) {
    warnMissingEnv("SUPABASE_URL");
    warnMissingEnv("SUPABASE_ANON_KEY");
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(
      env.SUPABASE_URL!,
      env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return cachedClient;
}

/**
 * Get Supabase client with auth enabled
 * Used for authenticated operations (favourites, remixes, etc.)
 */
export function getSupabaseAuthClient(): SupabaseClient<Database> | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!hasEnvVar("SUPABASE_URL") || !hasEnvVar("SUPABASE_ANON_KEY")) {
    warnMissingEnv("SUPABASE_URL");
    warnMissingEnv("SUPABASE_ANON_KEY");
    return null;
  }

  if (!cachedAuthClient) {
    cachedAuthClient = createClient<Database>(
      env.SUPABASE_URL!,
      env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage:
            typeof window !== "undefined" ? window.localStorage : undefined,
        },
      }
    );
  }

  return cachedAuthClient;
}
