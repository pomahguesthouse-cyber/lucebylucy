-- Tabel kategori koleksi yang dikelola admin (nama, deskripsi singkat, cover image)
CREATE TABLE public.collection_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text,
  description text,
  cover_storage_path text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.collection_categories TO authenticated;
GRANT SELECT ON public.collection_categories TO anon;
GRANT ALL ON public.collection_categories TO service_role;

ALTER TABLE public.collection_categories ENABLE ROW LEVEL SECURITY;

-- Publik hanya melihat kategori yang aktif
CREATE POLICY "Publik melihat kategori aktif"
ON public.collection_categories FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Admin melihat semua kategori (cek langsung ke user_roles agar tidak butuh EXECUTE has_role)
CREATE POLICY "Admin melihat semua kategori"
ON public.collection_categories FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin menambah kategori"
ON public.collection_categories FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin memperbarui kategori"
ON public.collection_categories FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin menghapus kategori"
ON public.collection_categories FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Trigger updated_at
CREATE TRIGGER update_collection_categories_updated_at
BEFORE UPDATE ON public.collection_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();