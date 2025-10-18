import { generateCaption } from "@/lib/providers/caption";
import type { CaptionResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { templateId } = await request.json();

    const caption = await generateCaption(templateId);

    const response: CaptionResponse = {
      caption,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}
