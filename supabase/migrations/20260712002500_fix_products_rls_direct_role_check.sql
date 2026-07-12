-- Perbaiki RLS products agar tidak bergantung pada EXECUTE public.has_role.
-- Migrasi keamanan sebelumnya mencabut EXECUTE has_role dari authenticated,
-- sehingga query admin ke products dapat gagal dengan permission denied.

DROP POLICY IF EXISTS "Admin melihat semua produk" ON public.products;
DROP POLICY IF EXISTS "Admin menambah produk" ON public.products;
DROP POLICY IF EXISTS "Admin memperbarui produk" ON public.products;
DROP POLICY IF EXISTS "Admin menghapus produk" ON public.products;

CREATE POLICY "Admin melihat semua produk"
ON public.products FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

CREATE POLICY "Admin menambah produk"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

CREATE POLICY "Admin memperbarui produk"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

CREATE POLICY "Admin menghapus produk"
ON public.products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);
