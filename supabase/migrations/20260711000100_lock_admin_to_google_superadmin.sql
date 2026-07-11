-- Batasi administrator LUSE pada satu identitas Google yang telah disetujui.
-- Database tetap menggunakan enum `admin` untuk kompatibilitas dengan seluruh RLS;
-- frontend menampilkan identitas tersebut sebagai `superadmin`.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      updated_at = now();

  DELETE FROM public.user_roles WHERE user_id = NEW.id;

  IF lower(COALESCE(NEW.email, '')) = 'ical.smg@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  END IF;

  RETURN NEW;
END;
$$;

-- Hanya akun yang disetujui boleh mempertahankan role admin.
DELETE FROM public.user_roles ur
WHERE ur.role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = ur.user_id
      AND lower(COALESCE(au.email, '')) = 'ical.smg@gmail.com'
  );

-- Jika akun Google sudah pernah login, promosikan sekarang tanpa menunggu login ulang.
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'::public.app_role
FROM auth.users au
WHERE lower(COALESCE(au.email, '')) = 'ical.smg@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_roles ur
USING auth.users au
WHERE ur.user_id = au.id
  AND ur.role = 'customer'
  AND lower(COALESCE(au.email, '')) = 'ical.smg@gmail.com';
