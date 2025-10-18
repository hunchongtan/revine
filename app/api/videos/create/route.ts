import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createVideoRecord, getShareableUrl } from "@/lib/video-sharing";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, videoUrl, caption, visibility } = body;

    if (!videoUrl || !templateId) {
      return NextResponse.json(
        { error: "Missing required fields: videoUrl, templateId" },
        { status: 400 }
      );
    }

    // Create video record
    const video = await createVideoRecord({
      userId: user.id,
      templateId,
      videoUrl,
      caption: caption || "",
      visibility: visibility || "private",
    });

    if (!video) {
      return NextResponse.json(
        { error: "Failed to create video record" },
        { status: 500 }
      );
    }

    // Generate shareable URL
    const shareUrl = getShareableUrl(video);

    return NextResponse.json({
      video,
      shareUrl,
    });
  } catch (error) {
    console.error("[api/videos/create] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

