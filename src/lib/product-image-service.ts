import { getBackendClient } from "@/lib/backend-client";

const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getExtension = (file: File): string => {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (extension) return extension;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
};

const sanitizeFileName = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "product";

const validateFiles = (files: File[]) => {
  if (files.length > MAX_FILES_PER_UPLOAD) {
    throw new Error(`Maksimal ${MAX_FILES_PER_UPLOAD} gambar dalam sekali upload.`);
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(`${file.name}: format harus JPG, PNG, atau WebP.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${file.name}: ukuran maksimal 10 MB.`);
    }
  }
};

export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) return [];
  validateFiles(files);

  const supabase = await getBackendClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi admin tidak ditemukan. Silakan masuk kembali.");

  const datePath = new Date().toISOString().slice(0, 10);
  const uploadedPaths: string[] = [];
  const publicUrls: string[] = [];

  try {
    for (const file of files) {
      const extension = getExtension(file);
      const safeName = sanitizeFileName(file.name);
      const objectPath = `admin/${user.id}/${datePath}/${crypto.randomUUID()}-${safeName}.${extension}`;
      const { error } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(objectPath, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });

      if (error) throw new Error(`${file.name}: ${error.message}`);

      uploadedPaths.push(objectPath);
      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(objectPath);
      publicUrls.push(data.publicUrl);
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }

  return publicUrls;
};
