-- Media khusus untuk kartu video hero di halaman depan.
CREATE TABLE public.hero_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot text NOT NULL DEFAULT 'home_hero',
  title text NOT NULL DEFAULT 'LUCE Studio Preview',
  caption text NOT NULL DEFAULT 'Preview outfit custom Anda sebelum produksi',
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  storage_path text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slot)
);

GRANT SELECT ON public.hero_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_media TO authenticated;
GRANT ALL ON public.hero_media TO service_role;

ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publik melihat hero media aktif"
ON public.hero_media FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admin melihat semua hero media"
ON public.hero_media FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin menambah hero media"
ON public.hero_media FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin memperbarui hero media"
ON public.hero_media FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin menghapus hero media"
ON public.hero_media FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_hero_media_updated_at
BEFORE UPDATE ON public.hero_media
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
