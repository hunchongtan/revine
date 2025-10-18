// =====================================================
// Database Types (Generated from Supabase schema)
// =====================================================
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
// Or manually define types below

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          title: string;
          year: number;
          category: string;
          thumbnail_url: string;
          audio_script: string;
          video_prompt: string;
          beat_sheet: Json | null;
          default_voice_id: string | null;
          persona: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          year: number;
          category: string;
          thumbnail_url: string;
          audio_script: string;
          video_prompt: string;
          beat_sheet?: Json | null;
          default_voice_id?: string | null;
          persona?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          year?: number;
          category?: string;
          thumbnail_url?: string;
          audio_script?: string;
          video_prompt?: string;
          beat_sheet?: Json | null;
          default_voice_id?: string | null;
          persona?: string | null;
          created_at?: string;
        };
      };
      favourites: {
        Row: {
          user_id: string;
          template_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          template_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          template_id?: string;
          created_at?: string;
        };
      };
      remixes: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          video_url: string;
          caption: string | null;
          is_public: boolean;
          visibility: 'private' | 'public';
          share_token: string;
          slug: string | null;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          video_url: string;
          caption?: string | null;
          is_public?: boolean;
          visibility?: 'private' | 'public';
          share_token?: string;
          slug?: string | null;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string | null;
          video_url?: string;
          caption?: string | null;
          is_public?: boolean;
          visibility?: 'private' | 'public';
          share_token?: string;
          slug?: string | null;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
