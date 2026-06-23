// Service layer untuk manajemen kategori koleksi (CRUD + cover image).
// Semua akses ke database & storage dirutekan lewat file ini.
import { getBackendClient } from "@/lib/backend-client";
import { MEDIA_BUCKET } from "@/lib/media-service";

const SIGNED_URL_TTL = 60 * 60; // 1 jam

export interface CollectionCategory {
  id: string;
  name: string;
  description: string | null;
  coverStoragePath: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  coverUrl: string | null;
}

interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  cover_storage_path: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Buat signed URL untuk cover image (bucket bersifat privat)
const attachCoverUrls = async (rows: CategoryRow[]): Promise<CollectionCategory[]> => {
  const supabase = await getBackendClient();
  const paths = rows
    .map((row) => row.cover_storage_path)
    .filter((path): path is string => Boolean(path));

  const urlByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL);
    signed?.forEach((entry) => {
      if (entry.signedUrl && entry.path) urlByPath.set(entry.path, entry.signedUrl);
    });
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    coverStoragePath: row.cover_storage_path,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    coverUrl: row.cover_storage_path ? urlByPath.get(row.cover_storage_path) ?? null : null,
  }));
};

const SELECT_COLUMNS =
  "id, name, description, cover_storage_path, sort_order, is_active, created_at";

// Ambil semua kategori untuk dashboard admin
export const fetchAllCategories = async (): Promise<CollectionCategory[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("collection_categories")
    .select(SELECT_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachCoverUrls(data ?? []);
};

// Ambil kategori aktif untuk tampilan publik
export const fetchActiveCategories = async (): Promise<CollectionCategory[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("collection_categories")
    .select(SELECT_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return attachCoverUrls(data ?? []);
};

// Unggah cover image ke storage, kembalikan storage path-nya
const uploadCover = async (file: File): Promise<string> => {
  const supabase = await getBackendClient();
  if (!file.type.startsWith("image/")) {
    throw new Error("Cover harus berupa file gambar.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const storagePath = `categories/${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  return storagePath;
};

interface CategoryInput {
  name: string;
  description?: string;
  coverFile?: File | null;
}

// Buat kategori baru (dengan cover image opsional)
export const createCategory = async ({
  name,
  description,
  coverFile,
}: CategoryInput): Promise<void> => {
  const supabase = await getBackendClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  let coverStoragePath: string | null = null;
  if (coverFile) coverStoragePath = await uploadCover(coverFile);

  const { error } = await supabase.from("collection_categories").insert({
    name: name.trim(),
    description: description?.trim() || null,
    cover_storage_path: coverStoragePath,
    created_by: user.id,
  });

  if (error) {
    if (coverStoragePath) {
      await supabase.storage.from(MEDIA_BUCKET).remove([coverStoragePath]);
    }
    throw error;
  }
};

interface CategoryUpdate extends CategoryInput {
  id: string;
  currentCoverPath?: string | null;
}

// Perbarui kategori (ganti cover jika file baru diberikan)
export const updateCategory = async ({
  id,
  name,
  description,
  coverFile,
  currentCoverPath,
}: CategoryUpdate): Promise<void> => {
  const supabase = await getBackendClient();

  let coverStoragePath = currentCoverPath ?? null;
  if (coverFile) {
    coverStoragePath = await uploadCover(coverFile);
  }

  const { error } = await supabase
    .from("collection_categories")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      cover_storage_path: coverStoragePath,
    })
    .eq("id", id);

  if (error) throw error;

  // Hapus cover lama jika diganti
  if (coverFile && currentCoverPath && currentCoverPath !== coverStoragePath) {
    await supabase.storage.from(MEDIA_BUCKET).remove([currentCoverPath]);
  }
};

// Tampilkan/sembunyikan kategori dari halaman publik
export const toggleCategoryActive = async (
  id: string,
  isActive: boolean,
): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase
    .from("collection_categories")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw error;
};

// Hapus kategori beserta cover image-nya
export const deleteCategory = async (
  id: string,
  coverStoragePath: string | null,
): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase.from("collection_categories").delete().eq("id", id);
  if (error) throw error;
  if (coverStoragePath) {
    await supabase.storage.from(MEDIA_BUCKET).remove([coverStoragePath]);
  }
};
