import { getSupabaseServiceClient } from "@/lib/supabase-server";
import type { VideoVisibility } from "@/lib/video-sharing";
import { getShareableUrl, updateVideoVisibility } from "@/lib/video-sharing";
import type { Database } from "@/types/database";
import { NextResponse } from "next/server";

type VideoRecord = Database["public"]["Tables"]["remixes"]["Row"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const userId: string | null = null;
    
    if (authHeader) {
      console.log("[api/videos/visibility] Auth header present, but allowing anonymous");
    }

    console.log("[api/videos/visibility] User:", userId || "anonymous");

    const { id } = await params;
    const body = await request.json();
    const { visibility } = body as { visibility: VideoVisibility };

    if (!visibility || !["private", "public"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility value. Must be 'private' or 'public'" },
        { status: 400 }
      );
    }

    // Fetch video to check ownership
    const { data: existingVideo, error: fetchError } = await supabase
      .from("remixes")
      .select("user_id")
      .eq("id", id)
      .single<Pick<VideoRecord, "user_id">>();

    if (fetchError || !existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Verify ownership: 
    // - If video has no owner (user_id is null), anyone can change it
    // - If video has an owner, only that owner can change it
    if (existingVideo.user_id !== null && existingVideo.user_id !== userId) {
      return NextResponse.json({ 
        error: "You don't have permission to change this video's visibility" 
      }, { status: 403 });
    }

    // Update visibility
    const video = await updateVideoVisibility(id, visibility);

    if (!video) {
      return NextResponse.json(
        { error: "Failed to update visibility" },
        { status: 500 }
      );
    }

    // Generate new shareable URL
    const shareUrl = getShareableUrl(video);

    return NextResponse.json({
      video,
      shareUrl,
    });
  } catch (error) {
    console.error("[api/videos/visibility] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
