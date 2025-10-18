import { hasEnvVar, warnMissingEnv } from "@/lib/env";

export type MuxMediaParams = {
  audioUrl: string;
  videoUrl: string;
  delayMs?: number;
};

export type MuxMediaResult = {
  finalUrl: string;
  isMock: boolean;
};

let warnedAboutMuxStub = false;

export async function muxMedia({
  audioUrl,
  videoUrl,
}: MuxMediaParams): Promise<MuxMediaResult> {
  const requiredKeys = [
    "SUPABASE_URL" as const,
    "SUPABASE_SERVICE_ROLE_KEY" as const,
  ];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      finalUrl: videoUrl,
      isMock: true,
    };
  }

  if (!warnedAboutMuxStub) {
    console.warn(
      "[mux] Media muxing not yet implemented. Returning original video URL."
    );
    warnedAboutMuxStub = true;
  }

  return {
    finalUrl: videoUrl,
    isMock: true,
  };
}
