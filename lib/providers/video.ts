import { hasEnvVar, warnMissingEnv } from "@/lib/env";

export type GenerateVideoParams = {
  templateId: string;
  imageUrl: string;
};

export type GenerateVideoResult = {
  videoUrl: string;
  isMock: boolean;
};

let warnedAboutStub = false;

export async function generateVideo({
  templateId,
  imageUrl,
}: GenerateVideoParams): Promise<GenerateVideoResult> {
  const requiredKeys = [
    "FAL_API_KEY" as const,
    "SUPABASE_URL" as const,
    "SUPABASE_SERVICE_ROLE_KEY" as const,
  ];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      videoUrl: "/mock/video.mp4",
      isMock: true,
    };
  }

  if (!warnedAboutStub) {
    console.warn(
      "[video] Fal.ai integration not yet implemented. Returning mock video."
    );
    warnedAboutStub = true;
  }

  return {
    videoUrl: "/mock/video.mp4",
    isMock: true,
  };
}
