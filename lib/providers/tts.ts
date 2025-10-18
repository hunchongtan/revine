import { env, hasEnvVar, warnMissingEnv } from "@/lib/env";
import { uploadToStorage } from "@/lib/supabase-server";
import { Buffer } from "node:buffer";

export type GenerateSpeechParams = {
  script: string;
  voice: string;
  templateId?: string;
};

export type GenerateSpeechResult = {
  audioUrl: string;
  isMock: boolean;
};

export async function generateSpeech({
  script,
  voice,
  templateId,
}: GenerateSpeechParams): Promise<GenerateSpeechResult> {
  const requiredKeys = [
    "ELEVENLABS_API_KEY" as const,
    "SUPABASE_URL" as const,
    "SUPABASE_SERVICE_ROLE_KEY" as const,
  ];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      audioUrl: "/mock/audio.wav",
      isMock: true,
    };
  }

  try {
    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
      }),
    });

    if (!response.ok) {
      console.warn(
        `[tts] ElevenLabs responded with status ${response.status}. Falling back to mock.`
      );
      return {
        audioUrl: "/mock/audio.wav",
        isMock: true,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const filename = `${templateId ?? "general"}-${Date.now()}.mp3`;
    const storagePath = `renders/audio/${filename}`;

    const uploadResult = await uploadToStorage({
      bucket: "renders",
      path: storagePath,
      data: audioBuffer,
      contentType: "audio/mpeg",
    });

    if (!uploadResult.publicUrl) {
      console.warn(
        "[tts] Failed to resolve public URL after upload. Falling back to mock."
      );
      return {
        audioUrl: "/mock/audio.wav",
        isMock: true,
      };
    }

    return {
      audioUrl: uploadResult.publicUrl,
      isMock: false,
    };
  } catch (error) {
    console.error("[tts] Failed to generate audio via ElevenLabs:", error);
    return {
      audioUrl: "/mock/audio.wav",
      isMock: true,
    };
  }
}
