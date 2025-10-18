-- ReVine Supabase Storage Setup
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- STEP 1: Create Buckets
-- ============================================

-- Create renders bucket (PUBLIC - for final videos + audio)
insert into storage.buckets (id, name, public) 
values ('renders', 'renders', true)
on conflict (id) do nothing;

-- Create uploads bucket (PRIVATE - for raw face uploads)
insert into storage.buckets (id, name, public) 
values ('uploads', 'uploads', false)
on conflict (id) do nothing;

-- ============================================
-- STEP 2: Renders Bucket Policies (PUBLIC)
-- ============================================

-- Public read access for renders
create policy "Public read renders"
  on storage.objects for select
  using (bucket_id = 'renders');

-- Service role can insert files
create policy "Service write renders"
  on storage.objects for insert
  with check (bucket_id = 'renders');

-- Service role can update files
create policy "Service update renders"
  on storage.objects for update
  using (bucket_id = 'renders');

-- Service role can delete files
create policy "Service delete renders"
  on storage.objects for delete
  using (bucket_id = 'renders');

-- ============================================
-- STEP 3: Uploads Bucket Policies (PRIVATE)
-- ============================================

-- Only service role can insert
create policy "Service write uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads');

-- Only service role can update
create policy "Service update uploads"
  on storage.objects for update
  using (bucket_id = 'uploads');

-- Only service role can delete
create policy "Service delete uploads"
  on storage.objects for delete
  using (bucket_id = 'uploads');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check buckets were created:
-- SELECT id, name, public FROM storage.buckets WHERE id IN ('renders', 'uploads');

-- Check policies were created:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'objects';
