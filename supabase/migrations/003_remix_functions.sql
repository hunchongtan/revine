-- =====================================================
-- Remix Helper Functions
-- =====================================================

-- Function to increment remix view count
CREATE OR REPLACE FUNCTION increment_remix_views(remix_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE remixes
  SET views_count = views_count + 1
  WHERE id = remix_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_remix_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_remix_views(UUID) TO anon;

