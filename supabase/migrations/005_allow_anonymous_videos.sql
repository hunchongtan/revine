-- =====================================================
-- Allow Anonymous Video Creation and Management
-- Migration: 005_allow_anonymous_videos
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert their own remixes" ON remixes;
DROP POLICY IF EXISTS "Users can update their own remixes" ON remixes;

-- Create new policies that allow anonymous users
CREATE POLICY "Anyone can insert remixes (authenticated or anonymous)"
  ON remixes FOR INSERT
  WITH CHECK (
    -- Either no auth (anonymous) OR user_id matches authenticated user
    auth.uid() IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Users can update their own remixes (or anonymous videos)"
  ON remixes FOR UPDATE
  USING (
    -- Can update if: no owner (user_id is null) OR user owns it
    user_id IS NULL OR auth.uid() = user_id
  );

-- Update the select policy to handle the new visibility field
DROP POLICY IF EXISTS "Remixes are viewable based on visibility and token" ON remixes;

CREATE POLICY "Remixes are viewable based on visibility and token"
  ON remixes FOR SELECT
  USING (
    visibility = 'public' OR 
    auth.uid() = user_id OR
    user_id IS NULL OR  -- Anonymous videos are viewable
    share_token IS NOT NULL
  );

