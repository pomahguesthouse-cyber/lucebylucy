// Helper untuk memuat client backend hanya saat benar-benar dibutuhkan.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BackendClient = SupabaseClient<Database>;

const FALLBACK_BACKEND_URL = "https://dotifvezrmxynsnktedy.supabase.co";
const FALLBACK_BACKEND_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6ImRvdGlmdmV6cm14eW5zbmt0ZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDI3MzgsImV4cCI6MjA5NzcxODczOH0._JpMJuqcmsVJBwudYODIGR44_c4R9TSirXwEvD5ophY";

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