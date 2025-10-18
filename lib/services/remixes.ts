import { getSupabaseAuthClient } from "@/lib/supabase-client"
import type { Database } from "@/types/database"

type RemixInsert = Database["public"]["Tables"]["remixes"]["Insert"]

/**
 * Save a generated remix to the database
 */
export async function saveRemix(params: {
  userId: string
  templateId: string
  videoUrl: string
  caption?: string
  isPublic?: boolean
}): Promise<{ success: boolean; remixId?: string; error?: string }> {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    return { success: false, error: "Supabase client not available" }
  }

  try {
    const remix: RemixInsert = {
      user_id: params.userId,
      template_id: params.templateId,
      video_url: params.videoUrl,
      caption: params.caption || null,
      is_public: params.isPublic ?? false,
    }

    const { data, error } = await supabase
      .from("remixes")
      .insert(remix)
      .select("id")
      .single()

    if (error) {
      console.error("Error saving remix:", error)
      return { success: false, error: error.message }
    }

    return { success: true, remixId: data.id }
  } catch (error) {
    console.error("Failed to save remix:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Update a remix (e.g., toggle public/private)
 */
export async function updateRemix(
  remixId: string,
  updates: {
    caption?: string
    isPublic?: boolean
  }
): Promise<boolean> {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from("remixes")
      .update({
        caption: updates.caption,
        is_public: updates.isPublic,
      })
      .eq("id", remixId)

    if (error) {
      console.error("Error updating remix:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to update remix:", error)
    return false
  }
}

/**
 * Fetch user's remixes
 */
export async function fetchUserRemixes(
  userId: string
): Promise<Database["public"]["Tables"]["remixes"]["Row"][]> {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("remixes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user remixes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch user remixes:", error)
    return []
  }
}

/**
 * Delete a remix
 */
export async function deleteRemix(remixId: string): Promise<boolean> {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from("remixes")
      .delete()
      .eq("id", remixId)

    if (error) {
      console.error("Error deleting remix:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to delete remix:", error)
    return false
  }
}

/**
 * Increment view count for a remix
 */
export async function incrementRemixViews(remixId: string): Promise<void> {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    return
  }

  try {
    await supabase.rpc("increment_remix_views", { remix_id: remixId })
  } catch (error) {
    console.error("Failed to increment views:", error)
  }
}

