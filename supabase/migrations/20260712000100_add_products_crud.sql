-- Database produk LUSE: katalog produk yang dapat dikelola dari dashboard admin.

CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category_id uuid REFERENCES public.collection_categories(id) ON DELETE SET NULL,
  description text,
  base_price bigint NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  image_url text,
  image_color text NOT NULL DEFAULT '#e6d8c2',
  best_for text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publik melihat produk approved"
ON public.products FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Admin melihat semua produk"
ON public.products FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin menambah produk"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin memperbarui produk"
ON public.products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin menghapus produk"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_products_status_sort
  ON public.products (status, sort_order, created_at DESC);

CREATE INDEX idx_products_category
  ON public.products (category_id);

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pertahankan isi katalog lama sebagai data awal agar halaman admin tidak kosong.
INSERT INTO public.collection_categories (name, slug, description, sort_order, is_active)
SELECT seed.name, seed.slug, seed.description, seed.sort_order, true
FROM (
  VALUES
    ('Gamis', 'gamis', 'Koleksi gamis elegan.', 10),
    ('Abaya', 'abaya', 'Koleksi abaya premium.', 20),
    ('Tunik', 'tunik', 'Koleksi tunik harian.', 30),
    ('Outer', 'outer', 'Koleksi outer berlapis.', 40),
    ('Dress', 'dress', 'Koleksi dress modest.', 50),
    ('Hijab Set', 'hijab-set', 'Koleksi hijab set.', 60)
) AS seed(name, slug, description, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.collection_categories existing
  WHERE existing.slug = seed.slug OR lower(existing.name) = lower(seed.name)
);

INSERT INTO public.products (
  slug,
  name,
  category_id,
  description,
  base_price,
  image_color,
  best_for,
  status,
  sort_order
)
VALUES
  (
    'gamis-aline-elegance',
    'Gamis A-Line Elegance',
    (SELECT id FROM public.collection_categories WHERE slug = 'gamis' OR lower(name) = 'gamis' ORDER BY created_at LIMIT 1),
    'Gamis potongan A-line yang melangsingkan dengan flare lembut di bawah.',
    385000,
    '#e6d8c2',
    'Acara keluarga & semi formal',
    'approved',
    10
  ),
  (
    'abaya-flow-premium',
    'Abaya Flow Premium',
    (SELECT id FROM public.collection_categories WHERE slug = 'abaya' OR lower(name) = 'abaya' ORDER BY created_at LIMIT 1),
    'Abaya flowy dengan jatuh kain mewah dan detail minimalis.',
    520000,
    '#cdbfa8',
    'Acara formal & undangan',
    'approved',
    20
  ),
  (
    'tunik-daily-soft',
    'Tunik Daily Soft',
    (SELECT id FROM public.collection_categories WHERE slug = 'tunik' OR lower(name) = 'tunik' ORDER BY created_at LIMIT 1),
    'Tunik ringan yang nyaman untuk aktivitas harian.',
    245000,
    '#dcdbc7',
    'Kerja & kasual',
    'approved',
    30
  ),
  (
    'outer-raya-layer',
    'Outer Raya Layer',
    (SELECT id FROM public.collection_categories WHERE slug = 'outer' OR lower(name) = 'outer' ORDER BY created_at LIMIT 1),
    'Outer berlapis dengan siluet anggun untuk tampilan istimewa.',
    410000,
    '#e7cfc9',
    'Lebaran & acara spesial',
    'approved',
    40
  ),
  (
    'dress-modest-classic',
    'Dress Modest Classic',
    (SELECT id FROM public.collection_categories WHERE slug = 'dress' OR lower(name) = 'dress' ORDER BY created_at LIMIT 1),
    'Dress modest klasik dengan potongan timeless dan elegan.',
    365000,
    '#d7c4b0',
    'Pesta & dinner',
    'approved',
    50
  ),
  (
    'hijab-set-minimal',
    'Hijab Set Minimal',
    (SELECT id FROM public.collection_categories WHERE slug = 'hijab-set' OR lower(name) = 'hijab set' ORDER BY created_at LIMIT 1),
    'Set hijab serasi dengan warna senada untuk tampilan menyatu.',
    195000,
    '#c8cdb9',
    'Sehari-hari & travel',
    'approved',
    60
  )
ON CONFLICT (slug) DO NOTHING;
