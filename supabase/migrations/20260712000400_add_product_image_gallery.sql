-- Tambahkan galeri gambar untuk kartu dan detail produk.
-- image_url tetap dipertahankan sebagai cover/kompatibilitas untuk integrasi lama.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT ARRAY[]::text[];

UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND btrim(image_url) <> ''
  AND cardinality(image_urls) = 0;

COMMENT ON COLUMN public.products.image_urls IS
  'Daftar URL gambar produk berurutan. Elemen pertama digunakan sebagai cover dan slider menampilkan seluruh elemen.';
