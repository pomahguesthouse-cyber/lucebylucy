// Service layer untuk manajemen produk LUSE.
// Semua operasi database produk dirutekan melalui file ini.
import { getBackendClient } from "@/lib/backend-client";

export type ProductStatus = "draft" | "approved" | "archived";

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  imageColor: string;
  bestFor: string | null;
  status: ProductStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  description: string | null;
  base_price: number;
  image_url: string | null;
  image_color: string;
  best_for: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  categoryId?: string | null;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  imageColor?: string;
  bestFor?: string;
  status?: ProductStatus;
  sortOrder?: number;
}

const SELECT_COLUMNS =
  "id, slug, name, category_id, description, base_price, image_url, image_color, best_for, status, sort_order, created_at, updated_at";

const mapProduct = (row: ProductRow): ProductItem => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  categoryId: row.category_id,
  description: row.description,
  basePrice: Number(row.base_price),
  imageUrl: row.image_url,
  imageColor: row.image_color,
  bestFor: row.best_for,
  status: row.status as ProductStatus,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createUniqueSlug = async (name: string): Promise<string> => {
  const supabase = await getBackendClient();
  const baseSlug = slugify(name) || `produk-${Date.now()}`;
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return baseSlug;
  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
};

export const fetchAllProducts = async (): Promise<ProductItem[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
};

export const fetchApprovedProducts = async (): Promise<ProductItem[]> => {
  const supabase = await getBackendClient();
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("status", "approved")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
};

export const createProduct = async (input: ProductInput): Promise<void> => {
  const supabase = await getBackendClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  const slug = await createUniqueSlug(input.name);
  const { error } = await supabase.from("products").insert({
    slug,
    name: input.name.trim(),
    category_id: input.categoryId || null,
    description: input.description?.trim() || null,
    base_price: input.basePrice,
    image_url: input.imageUrl?.trim() || null,
    image_color: input.imageColor || "#e6d8c2",
    best_for: input.bestFor?.trim() || null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
    created_by: user.id,
  });

  if (error) throw error;
};

export const updateProduct = async (
  id: string,
  input: ProductInput,
): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      category_id: input.categoryId || null,
      description: input.description?.trim() || null,
      base_price: input.basePrice,
      image_url: input.imageUrl?.trim() || null,
      image_color: input.imageColor || "#e6d8c2",
      best_for: input.bestFor?.trim() || null,
      status: input.status ?? "draft",
      sort_order: input.sortOrder ?? 0,
    })
    .eq("id", id);

  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const supabase = await getBackendClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};
