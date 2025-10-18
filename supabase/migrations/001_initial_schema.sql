-- =====================================================
-- ReVine Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (User accounts)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- 2. TEMPLATES TABLE (Vine templates)
-- =====================================================
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 2013 AND year <= 2016),
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  audio_script TEXT NOT NULL,
  video_prompt TEXT NOT NULL,
  beat_sheet JSONB,
  default_voice_id TEXT,
  persona TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for templates (public read)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly readable"
  ON templates FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- 3. FAVOURITES TABLE (User saved templates)
-- =====================================================
CREATE TABLE favourites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, template_id)
);

-- RLS Policies for favourites
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favourites"
  ON favourites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favourites"
  ON favourites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favourites"
  ON favourites FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. REMIXES TABLE (User-generated videos)
-- =====================================================
CREATE TABLE remixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id TEXT REFERENCES templates(id) ON DELETE SET NULL,
  video_url TEXT NOT NULL,
  caption TEXT,
  is_public BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for remixes
ALTER TABLE remixes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public remixes are viewable by everyone"
  ON remixes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own remixes"
  ON remixes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own remixes"
  ON remixes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own remixes"
  ON remixes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_remix_updated
  BEFORE UPDATE ON remixes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. INDEXES
-- =====================================================
CREATE INDEX idx_templates_year ON templates(year);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_favourites_user_id ON favourites(user_id);
CREATE INDEX idx_favourites_template_id ON favourites(template_id);
CREATE INDEX idx_remixes_user_id ON remixes(user_id);
CREATE INDEX idx_remixes_template_id ON remixes(template_id);
CREATE INDEX idx_remixes_is_public ON remixes(is_public);
CREATE INDEX idx_remixes_created_at ON remixes(created_at DESC);

-- =====================================================
-- 7. STORAGE BUCKETS
-- =====================================================

-- Create templates bucket (for template thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('templates', 'templates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for templates bucket (public read)
CREATE POLICY "Template thumbnails are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'templates');

-- Admin/service role can upload templates
CREATE POLICY "Service role can upload templates"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'templates' AND auth.role() = 'service_role');

-- Ensure renders bucket exists (for user-generated content)
INSERT INTO storage.buckets (id, name, public)
VALUES ('renders', 'renders', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for renders bucket
CREATE POLICY "Renders are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'renders');

CREATE POLICY "Authenticated users can upload renders"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'renders' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own renders"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'renders'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own renders"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'renders'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

