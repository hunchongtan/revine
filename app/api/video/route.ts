import { generateVideo } from "@/lib/providers/video";
import type { VideoResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { templateId, imageUrl } = await request.json();
    const { videoUrl } = await generateVideo({ templateId, imageUrl });

    const response: VideoResponse = {
      videoUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
