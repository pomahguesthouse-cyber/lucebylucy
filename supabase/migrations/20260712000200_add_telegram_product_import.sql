-- Integrasi Telegram Product Bot LUSE.
-- Bot memakai service role Supabase dari proses backend di VPS.

CREATE TABLE IF NOT EXISTS public.telegram_product_imports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_id bigint NOT NULL UNIQUE,
  telegram_user_id bigint,
  chat_id bigint NOT NULL,
  message_id bigint NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'success', 'failed', 'skipped')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_telegram_product_import_message
  ON public.telegram_product_imports (chat_id, message_id);

CREATE INDEX IF NOT EXISTS idx_telegram_product_import_created
  ON public.telegram_product_imports (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_telegram_product_import_product
  ON public.telegram_product_imports (product_id)
  WHERE product_id IS NOT NULL;

ALTER TABLE public.telegram_product_imports ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.telegram_product_imports TO authenticated;
GRANT ALL ON public.telegram_product_imports TO service_role;

DROP POLICY IF EXISTS "Admin melihat riwayat import Telegram"
ON public.telegram_product_imports;

CREATE POLICY "Admin melihat riwayat import Telegram"
ON public.telegram_product_imports FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Bucket publik khusus gambar produk. Upload dilakukan oleh service role bot.
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Publik melihat gambar produk"
ON storage.objects;

CREATE POLICY "Publik melihat gambar produk"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');
