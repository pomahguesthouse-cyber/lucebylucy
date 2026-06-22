-- Kunci fungsi trigger dari PUBLIC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- has_role hanya untuk pengguna terautentikasi
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Pisahkan kebijakan baca media agar anon tidak memanggil has_role
DROP POLICY "Semua orang dapat melihat media aktif" ON public.media_items;

CREATE POLICY "Publik melihat media aktif"
  ON public.media_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin melihat semua media"
  ON public.media_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));