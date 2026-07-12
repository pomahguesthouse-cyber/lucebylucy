// Helper untuk memuat client backend hanya saat benar-benar dibutuhkan.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BackendClient = SupabaseClient<Database>;

const FALLBACK_BACKEND_URL = "https://rmcxstkchxdzubekgolk.supabase.co";
const FALLBACK_BACKEND_PUBLISHABLE_KEY =
  "sb_publishable_4q24JSBJOX-qevzBMFpMtg_3_vG2FAT";

const getBackendConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL || FALLBACK_BACKEND_URL,
  publishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_BACKEND_PUBLISHABLE_KEY,
});

let backendClient: BackendClient | null = null;

export const getBackendClient = async (): Promise<BackendClient> => {
  if (backendClient) return backendClient;

  const { url, publishableKey } = getBackendConfig();
  backendClient = createClient<Database>(url, publishableKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return backendClient;
};

export const getBackendErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.includes("supabaseUrl is required")) {
    return "Koneksi backend belum tersedia di deployment ini. Silakan update publish aplikasi.";
  }

  return error instanceof Error ? error.message : "Terjadi kesalahan koneksi backend.";
};