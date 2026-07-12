import { createClient } from "@supabase/supabase-js";
import type { CollectionCategory } from "@/lib/category-service";
import type { ProductItem } from "@/lib/product-service";

const FALLBACK_BACKEND_URL = "https://rmcxstkchxdzubekgolk.supabase.co";
const FALLBACK_BACKEND_PUBLISHABLE_KEY =
  "sb_publishable_4q24JSBJOX-qevzBMFpMtg_3_vG2FAT";

const publicClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || FALLBACK_BACKEND_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_BACKEND_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

const PRODUCT_COLUMNS =
  "id, slug, product_code, name, category_id, description, base_price, image_url, image_urls, image_color, best_for, status, sort_order, created_at, updated_at";

const normalizeImageUrls = (values: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => value?.trim() ?? "")
        .filter(Boolean),
    ),
  );

export async function fetchPublicCatalog(): Promise<{
  categories: CollectionCategory[];
  products: ProductItem[];
}> {
  const [categoryResult, productResult] = await Promise.all([
    publicClient
      .from("collection_categories")
      .select("id, name, description, cover_storage_path, sort_order, is_active, created_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    publicClient
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("status", "approved")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  if (categoryResult.error) throw new Error(categoryResult.error.message);
  if (productResult.error) throw new Error(productResult.error.message);

  const categories: CollectionCategory[] = (categoryResult.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    coverStoragePath: row.cover_storage_path,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    coverUrl: null,
  }));

  const products: ProductItem[] = (productResult.data ?? []).map((row: any) => {
    const imageUrls = normalizeImageUrls([
      row.image_url,
      ...(Array.isArray(row.image_urls) ? row.image_urls : []),
    ]);

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
      status: row.status,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  return { categories, products };
}
