-- ReVine Supabase Storage Setup
-- Run this SQL in your Supabase SQL Editor to set up the renders bucket

-- 1. Create the renders bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('renders', 'renders', true)
on conflict (id) do nothing;

-- 2. Enable public read access for all renders
create policy "Public read renders"
  on storage.objects for select
  using (bucket_id = 'renders');

-- 3. Allow service role to insert (create) files
create policy "Service role write renders"
  on storage.objects for insert
  with check (bucket_id = 'renders');

-- 4. Allow service role to update files
create policy "Service role update renders"
  on storage.objects for update
  using (bucket_id = 'renders');

-- 5. Allow service role to delete files
create policy "Service role delete renders"
  on storage.objects for delete
  using (bucket_id = 'renders');

-- Verify the setup
-- Run this to check if policies were created:
-- SELECT * FROM storage.objects WHERE bucket_id = 'renders';
-- SELECT * FROM storage.buckets WHERE id = 'renders';

