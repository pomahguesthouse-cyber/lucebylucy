// Service layer untuk media library (foto/video)
// Semua akses ke database & storage dirutekan lewat file ini.
import { getBackendClient } from "@/lib/backend-client";

export const MEDIA_BUCKET = "media-library";
const SIGNED_URL_TTL = 60 * 60; // 1 jam

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  mediaType: MediaType;
  storagePath: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  signedUrl: string | null;
}

interface MediaRow {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  storage_path: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Buat signed URL untuk setiap file karena bucket bersifat privat
const attachSignedUrls = async (rows: MediaRow[]): Promise<MediaItem[]> => {
  if (rows.length === 0) return [];

  const supabase = await getBackendClient();
  const paths = rows.map((row) => row.storage_path);
  const { data: signed } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL);

  const urlByPath = new Map<string, string>();
  signed?.forEach((entry) => {
    if (entry.signedUrl && entry.path) {
      urlByPath.set(entry.path, entry.signedUrl);
    }
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    mediaType: row.media_type as MediaType,
    storagePath: row.storage_path,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    signedUrl: urlByPath.get(row.storage_path) ?? null,
  }));
};

// Ambil media aktif untuk tampilan publik (galeri halaman depan)
export const fetchActiveMedia = async (): Promise<MediaItem[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("id, title, description, media_type, storage_path, sort_order, is_active, created_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachSignedUrls(data ?? []);
};

// Ambil semua media untuk dashboard admin
export const fetchAllMedia = async (): Promise<MediaItem[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("id, title, description, media_type, storage_path, sort_order, is_active, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachSignedUrls(data ?? []);
};

const resolveMediaType = (file: File): MediaType | null => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "svg") return "image";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
};

interface UploadParams {
  file: File;
  title: string;
  description?: string;
}

// Unggah file baru ke storage lalu simpan metadata-nya
export const uploadMedia = async ({ file, title, description }: UploadParams): Promise<void> => {
  const supabase = await getBackendClient();
  const mediaType = resolveMediaType(file);
  if (!mediaType) {
    throw new Error("Format file tidak didukung. Gunakan foto atau video.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: extension === "svg" ? "image/svg+xml" : file.type || undefined,
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from("media_items").insert({
    title: title.trim(),
    description: description?.trim() || null,
    media_type: mediaType,
    storage_path: storagePath,
    url: storagePath,
    created_by: user.id,
  });

  if (insertError) {
    // Bersihkan file jika penyimpanan metadata gagal
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    throw insertError;
  }
};

// Ubah judul/deskripsi media
export const renameMedia = async (
  id: string,
  title: string,
  description?: string,
): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase
    .from("media_items")
    .update({ title: title.trim(), description: description?.trim() || null })
    .eq("id", id);
  if (error) throw error;
};

// Tampilkan/sembunyikan media dari galeri publik
export const toggleMediaActive = async (id: string, isActive: boolean): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase.from("media_items").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
};

// Hapus media beserta file-nya
export const deleteMedia = async (id: string, storagePath: string): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) throw error;
  await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
};
