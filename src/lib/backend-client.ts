// Helper untuk memuat client backend hanya saat benar-benar dibutuhkan.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BackendClient = SupabaseClient<Database>;

export const getBackendClient = async (): Promise<BackendClient> => {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
};

export const getBackendErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.includes("supabaseUrl is required")) {
    return "Koneksi backend belum tersedia di deployment ini. Silakan update publish aplikasi.";
  }

  return error instanceof Error ? error.message : "Terjadi kesalahan koneksi backend.";
};