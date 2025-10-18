import { getSupabaseServiceClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    // Check if video exists with this slug
    const { data: video, error } = await supabase
      .from("remixes")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.log("[debug-video] Error finding video:", error);
      
      // Try to find any videos with similar slugs
      const { data: similarVideos } = await supabase
        .from("remixes")
        .select("id, slug, caption, visibility")
        .ilike("slug", `%${slug}%`)
        .limit(5);

      return NextResponse.json({
        error: "Video not found",
        details: error.message,
        similarVideos: similarVideos || [],
        searchedSlug: slug
      });
    }

    return NextResponse.json({
      found: true,
      video: {
        id: video.id,
        slug: video.slug,
        caption: video.caption,
        visibility: video.visibility,
        video_url: video.video_url,
        created_at: video.created_at
      }
    });

  } catch (error) {
    console.error("[debug-video] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
