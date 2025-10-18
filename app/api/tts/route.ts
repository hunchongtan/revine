import { generateSpeech } from "@/lib/providers/tts";
import type { TTSResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { script, voice, templateId } = await request.json();

    const { audioUrl } = await generateSpeech({ script, voice, templateId });

    const response: TTSResponse = {
      audioUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
