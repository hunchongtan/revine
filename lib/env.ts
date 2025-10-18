import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  OPENAI_API_KEY: z.string().optional().nullable(),
  ELEVENLABS_API_KEY: z.string().optional().nullable(),
  FAL_API_KEY: z.string().optional().nullable(),
  SUPABASE_URL: z.string().optional().nullable(),
  SUPABASE_ANON_KEY: z.string().optional().nullable(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().nullable(),
});

type EnvSchema = z.infer<typeof envSchema>;

type EnvKey = keyof EnvSchema;

const parsedEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  FAL_API_KEY: process.env.FAL_API_KEY,
  // Allow either NEXT_PUBLIC_* or unprefixed for compatibility
  SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const warnedKeys = new Set<EnvKey>();

export function getEnvVar<K extends EnvKey>(key: K): EnvSchema[K] {
  return parsedEnv[key];
}

export function hasEnvVar(key: EnvKey): boolean {
  const value = parsedEnv[key];
  return typeof value === "string" && value.trim().length > 0;
}

export function requireServerEnv<K extends EnvKey>(key: K): string {
  const value = getEnvVar(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }
  return value;
}

export function warnMissingEnv(key: EnvKey) {
  if (!warnedKeys.has(key)) {
    console.warn(`[env] ${key} is not set; falling back to mock behavior.`);
    warnedKeys.add(key);
  }
}

type EnvSnapshot = Pick<EnvSchema, "NODE_ENV"> & {
  OPENAI_API_KEY: string | undefined;
  ELEVENLABS_API_KEY: string | undefined;
  FAL_API_KEY: string | undefined;
  SUPABASE_URL: string | undefined;
  SUPABASE_ANON_KEY: string | undefined;
  SUPABASE_SERVICE_ROLE_KEY: string | undefined;
};

export const env: EnvSnapshot = {
  NODE_ENV: parsedEnv.NODE_ENV,
  OPENAI_API_KEY: parsedEnv.OPENAI_API_KEY || undefined,
  ELEVENLABS_API_KEY: parsedEnv.ELEVENLABS_API_KEY || undefined,
  FAL_API_KEY: parsedEnv.FAL_API_KEY || undefined,
  SUPABASE_URL: parsedEnv.SUPABASE_URL || undefined,
  SUPABASE_ANON_KEY: parsedEnv.SUPABASE_ANON_KEY || undefined,
  SUPABASE_SERVICE_ROLE_KEY: parsedEnv.SUPABASE_SERVICE_ROLE_KEY || undefined,
};
