-- =====================================================
-- ReVine Video Sharing & Visibility
-- Migration: 003_add_video_sharing
-- =====================================================

-- Add sharing and visibility columns to remixes table
ALTER TABLE remixes 
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_remixes_share_token ON remixes(share_token);
CREATE INDEX IF NOT EXISTS idx_remixes_slug ON remixes(slug);
CREATE INDEX IF NOT EXISTS idx_remixes_visibility ON remixes(visibility);

-- Function to generate unique share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 12-character token (URL-safe)
    token := encode(gen_random_bytes(9), 'base64');
    token := replace(replace(replace(token, '/', '_'), '+', '-'), '=', '');
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM remixes WHERE share_token = token) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique slug from caption or id
CREATE OR REPLACE FUNCTION generate_slug(base_text TEXT, record_id UUID)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INT := 0;
  exists BOOLEAN;
BEGIN
  -- Create base slug from text (lowercase, alphanumeric, hyphens)
  IF base_text IS NOT NULL AND base_text != '' THEN
    slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));
    slug := regexp_replace(slug, '^-+|-+$', '', 'g');
    slug := substring(slug, 1, 50);
  ELSE
    -- Fallback to shortened UUID
    slug := substring(replace(record_id::text, '-', ''), 1, 12);
  END IF;
  
  -- Ensure uniqueness
  LOOP
    IF counter = 0 THEN
      SELECT EXISTS(SELECT 1 FROM remixes WHERE remixes.slug = generate_slug.slug) INTO exists;
    ELSE
      SELECT EXISTS(SELECT 1 FROM remixes WHERE remixes.slug = generate_slug.slug || '-' || counter) INTO exists;
    END IF;
    
    EXIT WHEN NOT exists;
    counter := counter + 1;
  END LOOP;
  
  IF counter > 0 THEN
    slug := slug || '-' || counter;
  END IF;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate share_token on insert
CREATE OR REPLACE FUNCTION auto_generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token := generate_share_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_share_token
  BEFORE INSERT ON remixes
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_share_token();

-- Trigger to auto-generate slug when visibility is set to public
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.visibility = 'public' AND NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.caption, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_slug
  BEFORE INSERT OR UPDATE ON remixes
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

-- Update RLS policies for remixes to support share tokens
DROP POLICY IF EXISTS "Public remixes are viewable by everyone" ON remixes;

CREATE POLICY "Remixes are viewable based on visibility and token"
  ON remixes FOR SELECT
  USING (
    visibility = 'public' OR 
    auth.uid() = user_id OR
    share_token IS NOT NULL
  );

-- Backfill share_token for existing remixes
UPDATE remixes 
SET share_token = generate_share_token() 
WHERE share_token IS NULL;

-- Backfill slug for existing public remixes
UPDATE remixes 
SET slug = generate_slug(caption, id) 
WHERE visibility = 'public' AND slug IS NULL;

-- Add comment documentation
COMMENT ON COLUMN remixes.visibility IS 'Video visibility: private (shareable link only) or public (shown in discover)';
COMMENT ON COLUMN remixes.share_token IS 'Unique token for private shareable links (/v/t/{token})';
COMMENT ON COLUMN remixes.slug IS 'URL-friendly slug for public links (/v/{slug})';

