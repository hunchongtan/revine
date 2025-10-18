/**
 * Template Adapter
 * 
 * This adapter bridges the gap between the old hardcoded template format
 * and the new Supabase database format, allowing both to work seamlessly.
 */

import type { Template as OldTemplate } from "@/lib/templates"
import type { Template as NewTemplate } from "@/lib/services/templates"

export type UnifiedTemplate = {
  id: string
  name: string
  title?: string // New format uses "title"
  description?: string
  category?: string // New format
  thumbnail: string
  thumbnailUrl?: string // New format uses "thumbnail_url"
  year: number
  defaultVoice: string
  defaultVoiceId?: string // New format uses "default_voice_id"
  delivery?: string
  persona?: string // New format
  audioScript: string
  videoPrompt: string
  beatSheet: number[]
  captionPrompt?: string
  isFavourite?: boolean
}

/**
 * Convert old template format to unified format
 */
export function adaptOldTemplate(template: OldTemplate): UnifiedTemplate {
  return {
    id: template.id,
    name: template.name,
    title: template.name,
    description: template.description,
    thumbnail: template.thumbnail,
    thumbnailUrl: template.thumbnail,
    year: template.year,
    defaultVoice: template.defaultVoice,
    defaultVoiceId: template.defaultVoice,
    delivery: template.delivery,
    audioScript: template.audioScript,
    videoPrompt: template.videoPrompt,
    beatSheet: template.beatSheet,
    captionPrompt: template.captionPrompt,
  }
}

/**
 * Convert new Supabase template format to unified format
 */
export function adaptNewTemplate(template: NewTemplate): UnifiedTemplate {
  const beatSheet = Array.isArray(template.beat_sheet)
    ? (template.beat_sheet as number[])
    : [0, 1.5, 3, 5, 6] // Default beat sheet

  return {
    id: template.id,
    name: template.title,
    title: template.title,
    description: `${template.category} • ${template.year}`,
    category: template.category,
    thumbnail: template.thumbnail_url,
    thumbnailUrl: template.thumbnail_url,
    year: template.year,
    defaultVoice: template.default_voice_id || "",
    defaultVoiceId: template.default_voice_id || undefined,
    persona: template.persona || undefined,
    audioScript: template.audio_script,
    videoPrompt: template.video_prompt,
    beatSheet,
    isFavourite: template.isFavourite,
  }
}

/**
 * Convert unified template to old format (for backward compatibility)
 */
export function toOldTemplate(template: UnifiedTemplate): OldTemplate {
  return {
    id: template.id,
    name: template.name,
    description: template.description || "",
    thumbnail: template.thumbnail,
    year: template.year as 2013 | 2014 | 2015 | 2016,
    defaultVoice: template.defaultVoice,
    delivery: template.delivery || "full_line",
    audioScript: template.audioScript,
    videoPrompt: template.videoPrompt,
    beatSheet: template.beatSheet,
    captionPrompt: template.captionPrompt || "",
  }
}

