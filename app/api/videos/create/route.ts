import { getSupabaseServiceClient } from "@/lib/supabase-server";
import { createVideoRecord, getShareableUrl } from "@/lib/video-sharing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    // Get user ID from request headers if available (optional - allows anonymous)
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    
    // Try to extract user from auth header, but don't fail if not present
    if (authHeader) {
      try {
        // This is a simplified approach - in production you'd verify the token
        // For now, we'll just allow anonymous creation
        console.log("[api/videos/create] Auth header present, but allowing anonymous");
      } catch (e) {
        console.log("[api/videos/create] Could not parse auth, proceeding as anonymous");
      }
    }

    console.log("[api/videos/create] User:", userId || "anonymous");

    const body = await request.json();
    const { templateId, videoUrl, caption, visibility } = body;

    if (!videoUrl || !templateId) {
      return NextResponse.json(
        { error: "Missing required fields: videoUrl, templateId" },
        { status: 400 }
      );
    }

    // Create video record (use null userId for anonymous users)
    const video = await createVideoRecord({
      userId: userId,
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
