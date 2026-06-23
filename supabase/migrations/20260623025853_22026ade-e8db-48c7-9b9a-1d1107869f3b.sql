
-- media_items: ganti pemakaian has_role dengan subquery langsung ke user_roles
DROP POLICY IF EXISTS "Admin dapat menambah media" ON public.media_items;
DROP POLICY IF EXISTS "Admin dapat memperbarui media" ON public.media_items;
DROP POLICY IF EXISTS "Admin dapat menghapus media" ON public.media_items;
DROP POLICY IF EXISTS "Admin melihat semua media" ON public.media_items;

CREATE POLICY "Admin dapat menambah media" ON public.media_items
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin dapat memperbarui media" ON public.media_items
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin dapat menghapus media" ON public.media_items
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin melihat semua media" ON public.media_items
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- storage.objects: ganti pemakaian has_role dengan subquery langsung ke user_roles
DROP POLICY IF EXISTS "Admin dapat mengunggah file media" ON storage.objects;
DROP POLICY IF EXISTS "Admin dapat memperbarui file media" ON storage.objects;
DROP POLICY IF EXISTS "Admin dapat menghapus file media" ON storage.objects;

CREATE POLICY "Admin dapat mengunggah file media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media-library' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin dapat memperbarui file media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'media-library' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin dapat menghapus file media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'media-library' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
