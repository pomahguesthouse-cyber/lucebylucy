import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ImageOff, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import {
  fetchActiveCategories,
  type CollectionCategory,
} from "@/lib/category-service";
import {
  fetchApprovedProducts,
  type ProductItem,
} from "@/lib/product-service";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function ProductImage({ product }: { product: ProductItem }) {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return (
      <div
        className="flex h-64 w-full items-center justify-center"
        style={{ backgroundColor: product.imageColor || "#e6d8c2" }}
      >
        <ImageOff className="h-8 w-8 text-charcoal/35" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={product.imageUrl}
      alt={product.name}
      loading="lazy"
      className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

const normalizeCategory = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function Collections() {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState("all");
  const [categories, setCategories] = useState<CollectionCategory[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoryItems, productItems] = await Promise.all([
        fetchActiveCategories(),
        fetchApprovedProducts(),
      ]);
      setCategories(categoryItems);
      setProducts(productItems);

      const requestedCategory = params.get("category");
      if (requestedCategory) {
        const normalized = normalizeCategory(requestedCategory);
        const matched = categoryItems.find(
          (category) =>
            category.id === requestedCategory ||
            normalizeCategory(category.name) === normalized,
        );
        setActive(matched?.id ?? "all");
      } else {
        setActive("all");
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Katalog belum dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const productCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (!product.categoryId) return;
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    });
    return counts;
  }, [products]);

  const filtered = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((product) => product.categoryId === active),
    [active, products],
  );

  const selectCategory = (categoryId: string) => {
    setActive(categoryId);
    if (categoryId === "all") {
      setParams({}, { replace: true });
      return;
    }

    const category = categories.find((item) => item.id === categoryId);
    setParams(
      { category: category ? normalizeCategory(category.name) : categoryId },
      { replace: true },
    );
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Koleksi"
        title="Koleksi sleepwear LUSE"
        description="Jelajahi produk yang sudah dipublikasikan admin. Foto, harga, kategori, dan deskripsi ditampilkan langsung dari database LUSE."
      />

      <section className="container py-12">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-mink">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat koleksi terbaru…
          </div>
        ) : error ? (
          <div className="rounded-luxe border border-red-200 bg-red-50/80 p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <h2 className="mt-3 font-semibold text-charcoal">Koleksi gagal dimuat</h2>
            <p className="mt-1 text-sm text-mink">{error}</p>
            <button
              type="button"
              onClick={() => void loadCatalog()}
              className="mt-5 rounded-full border border-champagne px-5 py-2 text-sm font-semibold text-charcoal transition hover:bg-champagne/15"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => selectCategory("all")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  active === "all"
                    ? "border-champagne bg-champagne/15 text-charcoal"
                    : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50",
                )}
              >
                Semua <span className="ml-1 text-xs opacity-70">({products.length})</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    active === category.id
                      ? "border-champagne bg-champagne/15 text-charcoal"
                      : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50",
                  )}
                >
                  {category.name}
                  <span className="ml-1 text-xs opacity-70">
                    ({productCountByCategory.get(category.id) ?? 0})
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="mt-12 rounded-luxe border border-champagne/15 bg-white/60 p-12 text-center text-mink">
                Belum ada produk berstatus approved untuk kategori ini.
              </div>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group overflow-hidden rounded-luxe border border-champagne/15 bg-white/75 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe"
                  >
                    <div className="overflow-hidden">
                      <ProductImage product={product} />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne">
                        {product.categoryId
                          ? categoryById.get(product.categoryId) ?? "Koleksi LUSE"
                          : "Koleksi LUSE"}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-charcoal">
                        {product.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-mink">
                        {product.description || "Produk sleepwear pilihan LUSE by Lucy."}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-base font-semibold text-champagne">
                          {formatPrice(product.basePrice)}
                        </span>
                        <span className="text-xs font-medium text-champagne group-hover:underline">
                          Lihat detail →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </SiteLayout>
  );
}