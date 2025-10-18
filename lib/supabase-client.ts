import { env, hasEnvVar, warnMissingEnv } from "@/lib/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!hasEnvVar("SUPABASE_URL") || !hasEnvVar("SUPABASE_ANON_KEY")) {
    warnMissingEnv("SUPABASE_URL");
    warnMissingEnv("SUPABASE_ANON_KEY");
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return cachedClient;
}
