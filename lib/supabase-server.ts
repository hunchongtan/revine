import { hasEnvVar, requireServerEnv, warnMissingEnv } from "@/lib/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type StorageUploadOptions = {
  bucket: string;
  path: string;
  data: ArrayBuffer | Buffer | Blob | File | ReadableStream<any>;
  contentType?: string;
  upsert?: boolean;
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient | null {
  if (!hasEnvVar("SUPABASE_URL") || !hasEnvVar("SUPABASE_SERVICE_ROLE_KEY")) {
    warnMissingEnv("SUPABASE_URL");
    warnMissingEnv("SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(
      requireServerEnv("SUPABASE_URL"),
      requireServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return cachedClient;
}

export async function uploadToStorage({
  bucket,
  path,
  data,
  contentType,
  upsert = true,
}: StorageUploadOptions) {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { publicUrl: null };
  }

  const result = await client.storage.from(bucket).upload(path, data, {
    contentType,
    upsert,
  });

  if (result.error) {
    throw result.error;
  }

  const { data: publicData } = client.storage.from(bucket).getPublicUrl(path);

  return { publicUrl: publicData.publicUrl ?? null };
}

export function getPublicStorageUrl(bucket: string, path: string) {
  const client = getSupabaseServiceClient();
  if (!client) {
    return null;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl ?? null;
}
