/**
 * Video Sharing Utilities
 * Handles video creation, visibility management, and URL generation
 */

import { getSupabaseServiceClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

export type VideoVisibility = "private" | "public";

export type VideoRecord = Database["public"]["Tables"]["remixes"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["remixes"]["Insert"];
export type VideoUpdate = Database["public"]["Tables"]["remixes"]["Update"];

/**
 * Generate shareable URL for a video
 */
export function getShareableUrl(video: VideoRecord): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (video.visibility === "public" && video.slug) {
    return `${baseUrl}/v/${video.slug}`;
  }

  return `${baseUrl}/v/t/${video.share_token}`;
}

/**
 * Create a new video record in database
 */
export async function createVideoRecord(data: {
  userId: string;
  templateId: string;
  videoUrl: string;
  caption: string;
  visibility?: VideoVisibility;
}): Promise<VideoRecord | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  const { data: video, error } = await supabase
    .from("remixes")
    .insert({
      user_id: data.userId,
      template_id: data.templateId,
      video_url: data.videoUrl,
      caption: data.caption,
      visibility: data.visibility || "private",
    })
    .select()
    .single();

  if (error) {
    console.error("[video-sharing] Failed to create video:", error);
    return null;
  }

  return video;
}

/**
 * Update video visibility and regenerate slug if needed
 */
export async function updateVideoVisibility(
  videoId: string,
  visibility: VideoVisibility
): Promise<VideoRecord | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  const { data: video, error } = await supabase
    .from("remixes")
    .update({
      visibility,
      is_public: visibility === "public",
    })
    .eq("id", videoId)
    .select()
    .single();

  if (error) {
    console.error("[video-sharing] Failed to update visibility:", error);
    return null;
  }

  return video;
}

/**
 * Get video by share token (private link)
 */
export async function getVideoByToken(
  token: string
): Promise<VideoRecord | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  const { data: video, error } = await supabase
    .from("remixes")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error) {
    console.error("[video-sharing] Failed to get video by token:", error);
    return null;
  }

  return video;
}

/**
 * Get video by slug (public link)
 */
export async function getVideoBySlug(
  slug: string
): Promise<VideoRecord | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  const { data: video, error } = await supabase
    .from("remixes")
    .select("*")
    .eq("slug", slug)
    .eq("visibility", "public")
    .single();

  if (error) {
    console.error("[video-sharing] Failed to get video by slug:", error);
    return null;
  }

  return video;
}

/**
 * Increment view count for a video
 */
export async function incrementVideoViews(videoId: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  await supabase.rpc("increment_video_views", { video_id: videoId });
}

/**
 * Get all public videos for discover page
 */
export async function getPublicVideos(limit = 50): Promise<VideoRecord[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[video-sharing] Supabase client not available");
    return null;
  }

  const { data: videos, error } = await supabase
    .from("remixes")
    .select("*")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[video-sharing] Failed to get public videos:", error);
    return [];
  }

  return videos || [];
}

/**
 * Share video using native share API or fallback to clipboard
 */
export async function shareVideo(
  video: VideoRecord,
  options?: { title?: string; text?: string }
): Promise<{ success: boolean; method: "native" | "clipboard" | "error" }> {
  const url = getShareableUrl(video);
  const title = options?.title || "Check out my ReVine!";
  const text = options?.text || video.caption || "Made with ReVine";

  // Try native share API first
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return { success: true, method: "native" };
    } catch (err) {
      // User cancelled or error - fall through to clipboard
      if (
        err instanceof Error &&
        err.name !== "AbortError" &&
        err.name !== "NotAllowedError"
      ) {
        console.error("[video-sharing] Native share failed:", err);
      }
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, method: "clipboard" };
    } catch (err) {
      console.error("[video-sharing] Clipboard copy failed:", err);
    }
  }

  return { success: false, method: "error" };
}
