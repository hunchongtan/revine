-- =====================================================
-- Fix generate_slug function
-- Migration: 006_fix_generate_slug
-- =====================================================

-- Drop and recreate the function with proper variable scoping
CREATE OR REPLACE FUNCTION generate_slug(base_text TEXT, record_id UUID)
RETURNS TEXT AS $$
DECLARE
  result_slug TEXT;
  counter INT := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Create base slug from text (lowercase, alphanumeric, hyphens)
  IF base_text IS NOT NULL AND base_text != '' THEN
    result_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));
    result_slug := regexp_replace(result_slug, '^-+|-+$', '', 'g');
    result_slug := substring(result_slug, 1, 50);
  ELSE
    -- Fallback to shortened UUID
    result_slug := substring(replace(record_id::text, '-', ''), 1, 12);
  END IF;
  
  -- Ensure uniqueness
  LOOP
    IF counter = 0 THEN
      SELECT EXISTS(
        SELECT 1 FROM remixes WHERE slug = result_slug
      ) INTO slug_exists;
    ELSE
      SELECT EXISTS(
        SELECT 1 FROM remixes WHERE slug = result_slug || '-' || counter
      ) INTO slug_exists;
    END IF;
    
    EXIT WHEN NOT slug_exists;
    counter := counter + 1;
  END LOOP;
  
  IF counter > 0 THEN
    result_slug := result_slug || '-' || counter;
  END IF;
  
  RETURN result_slug;
END;
$$ LANGUAGE plpgsql;

