import { getSupabaseAuthClient } from "@/lib/supabase-client";
import type { Database } from "@/types/database";

export type Template = Database["public"]["Tables"]["templates"]["Row"] & {
  isFavourite?: boolean;
};

/**
 * Fetch all templates from Supabase
 */
export async function fetchTemplates(
  userId?: string | null
): Promise<Template[]> {
  console.log("[Templates] fetchTemplates called, userId:", userId);

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    console.error(
      "[Templates] ❌ Supabase client is null - check environment variables!"
    );
    return [];
  }

  console.log("[Templates] ✓ Supabase client created");

  try {
    // Fetch templates
    console.log("[Templates] Fetching templates from database...");
    const { data: templates, error } = await supabase
      .from("templates")
      .select("*")
      .order("year", { ascending: true });

    if (error) {
      console.error("[Templates] ❌ Error fetching templates:", error);
      console.error("[Templates] Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return [];
    }

    console.log(
      "[Templates] ✓ Successfully fetched templates:",
      templates?.length || 0
    );

    if (!templates || templates.length === 0) {
      console.warn(
        "[Templates] ⚠️ Database returned 0 templates! Did you run the seed migration?"
      );
      console.warn(
        "[Templates] Run this in Supabase SQL Editor: supabase/migrations/002_seed_templates.sql"
      );
    }

    // If user is logged in, fetch their favourites
    if (userId) {
      console.log("[Templates] Fetching favourites for user:", userId);
      const { data: favourites } = await supabase
        .from("favourites")
        .select("template_id")
        .eq("user_id", userId);

      const favouriteIds = new Set(favourites?.map((f) => f.template_id) || []);
      console.log("[Templates] User has", favouriteIds.size, "favourites");

      return templates.map((template) => ({
        ...template,
        isFavourite: favouriteIds.has(template.id),
      }));
    }

    return templates || [];
  } catch (error) {
    console.error("[Templates] ❌ Failed to fetch templates:", error);
    return [];
  }
}

/**
 * Fetch a single template by ID
 */
export async function fetchTemplate(id: string): Promise<Template | null> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching template:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch template:", error);
    return null;
  }
}

/**
 * Get Supabase storage URL for a thumbnail
 */
export function getTemplateThumbnailUrl(thumbnailPath: string): string {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return thumbnailPath;
  }

  // If it's already a full URL, return as-is
  if (thumbnailPath.startsWith("http")) {
    return thumbnailPath;
  }

  // If it starts with /, it's a local public path
  if (thumbnailPath.startsWith("/")) {
    return thumbnailPath;
  }

  // Otherwise, get from Supabase storage
  const { data } = supabase.storage
    .from("templates")
    .getPublicUrl(thumbnailPath);

  return data.publicUrl;
}

/**
 * Add template to favourites
 */
export async function addToFavourites(
  userId: string,
  templateId: string
): Promise<boolean> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from("favourites")
      .insert({ user_id: userId, template_id: templateId });

    if (error) {
      console.error("Error adding to favourites:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to add to favourites:", error);
    return false;
  }
}

/**
 * Remove template from favourites
 */
export async function removeFromFavourites(
  userId: string,
  templateId: string
): Promise<boolean> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("user_id", userId)
      .eq("template_id", templateId);

    if (error) {
      console.error("Error removing from favourites:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to remove from favourites:", error);
    return false;
  }
}

/**
 * Sync localStorage favourites to Supabase when user logs in
 */
export async function syncLocalFavourites(userId: string): Promise<void> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return;
  }

  try {
    // Get local favourites from localStorage
    const localFavourites = localStorage.getItem("revine_favourites");
    if (!localFavourites) {
      return;
    }

    const favouriteIds = JSON.parse(localFavourites) as string[];
    if (favouriteIds.length === 0) {
      return;
    }

    // Fetch existing favourites from Supabase
    const { data: existing } = await supabase
      .from("favourites")
      .select("template_id")
      .eq("user_id", userId);

    const existingIds = new Set(existing?.map((f) => f.template_id) || []);

    // Insert new favourites (skip existing ones)
    const toInsert = favouriteIds
      .filter((id) => !existingIds.has(id))
      .map((template_id) => ({ user_id: userId, template_id }));

    if (toInsert.length > 0) {
      await supabase.from("favourites").insert(toInsert);
    }

    // Clear local storage after sync
    localStorage.removeItem("revine_favourites");
  } catch (error) {
    console.error("Failed to sync local favourites:", error);
  }
}
