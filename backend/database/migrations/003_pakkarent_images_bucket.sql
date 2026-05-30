-- Supabase Storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pakkarent_images',
  'pakkarent_images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
DROP POLICY IF EXISTS "pakkarent_images_public_read" ON storage.objects;
CREATE POLICY "pakkarent_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pakkarent_images');

-- Backend uploads (service role bypasses RLS; this covers anon/admin API uploads)
DROP POLICY IF EXISTS "pakkarent_images_insert" ON storage.objects;
CREATE POLICY "pakkarent_images_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pakkarent_images');

DROP POLICY IF EXISTS "pakkarent_images_update" ON storage.objects;
CREATE POLICY "pakkarent_images_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pakkarent_images');

DROP POLICY IF EXISTS "pakkarent_images_delete" ON storage.objects;
CREATE POLICY "pakkarent_images_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pakkarent_images');
