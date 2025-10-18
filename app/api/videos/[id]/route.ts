import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Get video by ID
    const { data: video, error } = await supabase
      .from("remixes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user has permission to view
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isOwner = user && video.user_id === user.id;
    const isPublic = video.visibility === "public";

    if (!isOwner && !isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("[api/videos/[id]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

