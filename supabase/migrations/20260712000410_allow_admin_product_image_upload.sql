-- Izinkan admin terautentikasi mengelola gambar pada bucket product-images.
-- Policy publik SELECT sudah dibuat pada migration Telegram product import.

DROP POLICY IF EXISTS "Admin upload gambar produk"
ON storage.objects;

CREATE POLICY "Admin upload gambar produk"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin hapus gambar produk"
ON storage.objects;

CREATE POLICY "Admin hapus gambar produk"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);
