-- Cabut akses EXECUTE langsung dari peran API untuk fungsi SECURITY DEFINER.
-- Fungsi-fungsi ini hanya dipakai di dalam kebijakan RLS dan trigger,
-- sehingga pencabutan ini tidak memengaruhi fungsionalitas aplikasi.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;