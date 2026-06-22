-- Kebijakan akses file pada bucket media-library
CREATE POLICY "Semua orang dapat melihat file media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-library');

CREATE POLICY "Admin dapat mengunggah file media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media-library' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin dapat memperbarui file media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media-library' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin dapat menghapus file media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media-library' AND public.has_role(auth.uid(), 'admin'));

-- Kunci fungsi trigger internal agar tidak bisa dipanggil via API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;