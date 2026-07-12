// Service layer untuk manajemen produk LUSE.
// Semua operasi database produk dirutekan melalui file ini.
import { getBackendClient } from "@/lib/backend-client";

export type ProductStatus = "draft" | "approved" | "archived";

export interface ProductItem {
  id: string;
  slug: string;
  productCode: string;
  name: string;
  categoryId: string | null;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  imageUrls: string[];
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
  product_code: string;
  name: string;
  category_id: string | null;
  description: string | null;
  base_price: number;
  image_url: string | null;
  image_urls?: string[] | null;
  image_color: string;
  best_for: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  productCode?: string;
  categoryId?: string | null;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  imageUrls?: string[];
  imageColor?: string;
  bestFor?: string;
  status?: ProductStatus;
  sortOrder?: number;
}

const LEGACY_SELECT_COLUMNS =
  "id, slug, product_code, name, category_id, description, base_price, image_url, image_color, best_for, status, sort_order, created_at, updated_at";
const SELECT_COLUMNS = `${LEGACY_SELECT_COLUMNS}, image_urls`;

const productsTable = async () => {
  const supabase = await getBackendClient();
  // product_code dan image_urls ditambahkan oleh migration; cast ini menjaga build
  // sampai tipe Supabase diregenerasi dari project remote.
  return { supabase, table: (supabase as any).from("products") };
};

const normalizeImageUrls = (values: Array<string | null | undefined>): string[] =>
  Array.from(
    new Set(
      values
        .map((value) => value?.trim() ?? "")
        .filter(Boolean),
    ),
  );

const productImagesFromRow = (row: ProductRow): string[] =>
  normalizeImageUrls([
    row.image_url,
    ...(Array.isArray(row.image_urls) ? row.image_urls : []),
  ]);

const mapProduct = (row: ProductRow): ProductItem => {
  const imageUrls = productImagesFromRow(row);

  return {
    id: row.id,
    slug: row.slug,
    productCode: row.product_code,
    name: row.name,
    categoryId: row.category_id,
    description: row.description,
    basePrice: Number(row.base_price),
    imageUrl: imageUrls[0] ?? null,
    imageUrls,
    imageColor: row.image_color,
    bestFor: row.best_for,
    status: row.status as ProductStatus,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createUniqueSlug = async (name: string): Promise<string> => {
  const { table } = await productsTable();
  const baseSlug = slugify(name) || `produk-${Date.now()}`;
  const { data, error } = await table
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return baseSlug;
  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
};

const normalizeProductCode = (value?: string): string | undefined => {
  const normalized = value?.trim().toUpperCase();
  return normalized || undefined;
};

const isMissingImageGalleryColumn = (error: { code?: string; message?: string } | null) =>
  Boolean(
    error &&
      (error.code === "42703" ||
        error.message?.toLowerCase().includes("image_urls")),
  );

const runProductRead = async (queryFactory: (columns: string) => any) => {
  let result = await queryFactory(SELECT_COLUMNS);
  if (isMissingImageGalleryColumn(result.error)) {
    result = await queryFactory(LEGACY_SELECT_COLUMNS);
  }
  return result;
};

const runProductWrite = async (
  writeFactory: (payload: Record<string, unknown>) => any,
  payload: Record<string, unknown>,
) => {
  let result = await writeFactory(payload);

  if (isMissingImageGalleryColumn(result.error)) {
    const { image_urls: _imageUrls, ...legacyPayload } = payload;
    result = await writeFactory(legacyPayload);
  }

  return result;
};

const throwProductError = (error: { code?: string; message?: string }): never => {
  if (error.code === "23505" && error.message?.includes("product_code")) {
    throw new Error("Kode produk sudah digunakan. Gunakan kode lain atau kosongkan agar dibuat otomatis.");
  }
  throw error;
};

export const fetchAllProducts = async (): Promise<ProductItem[]> => {
  const { table } = await productsTable();
  const { data, error } = await runProductRead((columns) =>
    table
      .select(columns)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  );

  if (error) throw error;
  return (data ?? []).map((row: ProductRow) => mapProduct(row));
};

export const fetchApprovedProducts = async (): Promise<ProductItem[]> => {
  const { table } = await productsTable();
  const { data, error } = await runProductRead((columns) =>
    table
      .select(columns)
      .eq("status", "approved")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  );

  if (error) throw error;
  return (data ?? []).map((row: ProductRow) => mapProduct(row));
};

export const fetchApprovedProductById = async (
  id: string,
): Promise<ProductItem | null> => {
  const { table } = await productsTable();
  const { data, error } = await runProductRead((columns) =>
    table
      .select(columns)
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle(),
  );

  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
};

export const createProduct = async (input: ProductInput): Promise<void> => {
  const { supabase, table } = await productsTable();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

  const slug = await createUniqueSlug(input.name);
  const productCode = normalizeProductCode(input.productCode);
  const imageUrls = normalizeImageUrls([
    ...(input.imageUrls ?? []),
    input.imageUrl,
  ]);
  const payload = {
    slug,
    ...(productCode ? { product_code: productCode } : {}),
    name: input.name.trim(),
    category_id: input.categoryId || null,
    description: input.description?.trim() || null,
    base_price: input.basePrice,
    image_url: imageUrls[0] ?? null,
    image_urls: imageUrls,
    image_color: input.imageColor || "#e6d8c2",
    best_for: input.bestFor?.trim() || null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
    created_by: user.id,
  };

  const { error } = await runProductWrite((values) => table.insert(values), payload);
  if (error) throwProductError(error);
};

export const updateProduct = async (
  id: string,
  input: ProductInput,
): Promise<void> => {
  const { table } = await productsTable();
  const imageUrls = normalizeImageUrls([
    ...(input.imageUrls ?? []),
    input.imageUrl,
  ]);
  const payload = {
    product_code: normalizeProductCode(input.productCode) ?? null,
    name: input.name.trim(),
    category_id: input.categoryId || null,
    description: input.description?.trim() || null,
    base_price: input.basePrice,
    image_url: imageUrls[0] ?? null,
    image_urls: imageUrls,
    image_color: input.imageColor || "#e6d8c2",
    best_for: input.bestFor?.trim() || null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
  };

  const { error } = await runProductWrite(
    (values) => table.update(values).eq("id", id),
    payload,
  );
  if (error) throwProductError(error);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { table } = await productsTable();
  const { error } = await table.delete().eq("id", id);
  if (error) throw error;
};
