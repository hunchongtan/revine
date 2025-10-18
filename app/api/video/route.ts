import { generateVideo } from "@/lib/providers/video";
import type { VideoResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("[video-api] ===== VIDEO API CALLED =====");
  try {
    const body = await request.json();
    console.log("[video-api] Request body:", JSON.stringify(body, null, 2));

    const { templateId, imageUrl, referenceThumbnail } = body;

    if (!templateId || !imageUrl) {
      console.error("[video-api] Missing required parameters:", {
        templateId,
        imageUrl,
      });
      return NextResponse.json(
        { error: "Missing templateId or imageUrl" },
        { status: 400 }
      );
    }

    console.log("[video-api] Calling generateVideo...");
    try {
      const { videoUrl } = await generateVideo({
        templateId,
        imageUrl,
        referenceThumbnail,
      });
      console.log("[video-api] ✅ Video generated successfully:", videoUrl);

      const response: VideoResponse = {
        videoUrl,
      };

      return NextResponse.json(response);
    } catch (e: any) {
      if (e?.code === "GENERATION_TIMEOUT") {
        return NextResponse.json(
          {
            error:
              "Generation is taking longer than usual. Please try again later.",
          },
          { status: 504 }
        );
      }
      throw e;
    }
  } catch (error: any) {
    console.error("[video-api] ❌ Video generation error:", error);
    const status =
      error?.status && Number.isInteger(error.status) ? error.status : 500;
    const detail = error?.body || error?.message || "Failed to generate video";
    return NextResponse.json({ error: detail }, { status });
  }
}
