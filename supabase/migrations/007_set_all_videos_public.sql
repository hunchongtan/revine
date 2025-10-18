-- =====================================================
-- Set All Existing Videos to Public
-- Migration: 007_set_all_videos_public
-- =====================================================

-- Update all videos to be public
UPDATE remixes 
SET 
  visibility = 'public',
  is_public = true
WHERE visibility IS NULL OR visibility = 'private';

-- Generate slugs for videos that don't have them
UPDATE remixes 
SET slug = generate_slug(caption, id) 
WHERE slug IS NULL;

