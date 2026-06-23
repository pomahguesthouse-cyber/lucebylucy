import { getBackendClient } from "@/lib/backend-client";
import { MEDIA_BUCKET, type MediaType } from "@/lib/media-service";

const HERO_SLOT = "home_hero";
const SIGNED_URL_TTL = 60 * 60;

export interface HeroMedia {
  id: string;
  title: string;
  caption: string;
  mediaType: MediaType;
  storagePath: string;
  isActive: boolean;
  signedUrl: string | null;
  createdAt: string;
}

interface HeroMediaRow {
  id: string;
  title: string;
  caption: string;
  media_type: string;
  storage_path: string;
  is_active: boolean;
  created_at: string;
}

const resolveMediaType = (file: File): MediaType | null => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "svg") return "image";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
};

const getUploadContentType = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "svg") return "image/svg+xml";
  return file.type || undefined;
};

const attachSignedUrl = async (row: HeroMediaRow | null): Promise<HeroMedia | null> => {
  if (!row) return null;

  const supabase = await getBackendClient();
  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(row.storage_path, SIGNED_URL_TTL);

  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    mediaType: row.media_type as MediaType,
    storagePath: row.storage_path,
    isActive: row.is_active,
    createdAt: row.created_at,
    signedUrl: data?.signedUrl ?? null,
  };
};

const SELECT_COLUMNS = "id, title, caption, media_type, storage_path, is_active, created_at";

export const fetchActiveHeroMedia = async (): Promise<HeroMedia | null> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("hero_media")
    .select(SELECT_COLUMNS)
    .eq("slot", HERO_SLOT)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return attachSignedUrl(data);
};

export const fetchHeroMediaAdmin = async (): Promise<HeroMedia | null> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("hero_media")
    .select(SELECT_COLUMNS)
    .eq("slot", HERO_SLOT)
    .maybeSingle();

  if (error) throw error;
  return attachSignedUrl(data);
};

interface SaveHeroMediaParams {
  file?: File | null;
  title: string;
  caption: string;
  isActive: boolean;
  currentStoragePath?: string | null;
  currentMediaType?: MediaType | null;
}

export const saveHeroMedia = async ({
  file,
  title,
  caption,
  isActive,
  currentStoragePath,
  currentMediaType,
}: SaveHeroMediaParams): Promise<void> => {
  const supabase = await getBackendClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  let storagePath = currentStoragePath ?? null;
  let mediaType: MediaType | null = null;

  if (file) {
    mediaType = resolveMediaType(file);
    if (!mediaType) {
      throw new Error("Format file tidak didukung. Gunakan gambar, SVG, atau video.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    storagePath = `hero/${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
      cacheControl: "3600",
      contentType: getUploadContentType(file),
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }

  if (!storagePath) {
    throw new Error("Pilih gambar atau video untuk hero.");
  }

  const payload = {
    slot: HERO_SLOT,
    title: title.trim() || "LUCE Studio Preview",
    caption: caption.trim() || "Preview outfit custom Anda sebelum produksi",
    storage_path: storagePath,
    media_type: mediaType ?? currentMediaType ?? "image",
    is_active: isActive,
    created_by: user.id,
  };

  const { error } = await supabase.from("hero_media").upsert(payload, { onConflict: "slot" });
  if (error) {
    if (file && storagePath) {
      await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    }
    throw error;
  }

  if (file && currentStoragePath && currentStoragePath !== storagePath) {
    await supabase.storage.from(MEDIA_BUCKET).remove([currentStoragePath]);
  }
};

export const deleteHeroMedia = async (storagePath: string): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase.from("hero_media").delete().eq("slot", HERO_SLOT);
  if (error) throw error;
  await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
};
