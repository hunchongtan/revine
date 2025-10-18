-- =====================================================
-- ReVine View Counter RPC
-- Migration: 004_add_view_counter_rpc (Optional)
-- =====================================================

-- Function to safely increment view count
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE remixes 
  SET views_count = views_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_video_views(UUID) TO authenticated, anon;

