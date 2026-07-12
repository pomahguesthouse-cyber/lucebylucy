import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/products/ProductCard";
import {
  fetchActiveCategories,
  type CollectionCategory,
} from "@/lib/category-service";
import {
  fetchApprovedProducts,
  type ProductItem,
} from "@/lib/product-service";
import { cn } from "@/lib/utils";

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
      <div className="hidden sm:block">
        <PageHero
          eyebrow="Koleksi"
          title="Koleksi sleepwear LUSE"
          description="Jelajahi produk yang sudah dipublikasikan admin. Geser foto pada kartu untuk melihat detail produk dari berbagai sisi."
        />
      </div>

      <section className="container py-6 sm:py-12">
        <div className="mb-6 sm:hidden">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-champagne">
            Koleksi
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-none text-charcoal">
            Sleepwear LUSE
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-5 text-mink">
            Pilih koleksi, lalu geser kartu untuk melihat produk lainnya.
          </p>
        </div>

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
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              <button
                type="button"
                onClick={() => selectCategory("all")}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition",
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
                    "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition",
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
              <div className="mt-10 rounded-luxe border border-champagne/15 bg-white/60 p-10 text-center text-mink sm:mt-12 sm:p-12">
                Belum ada produk berstatus approved untuk kategori ini.
              </div>
            ) : (
              <div
                aria-label="Daftar produk"
                className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-5 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-7 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
              >
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="w-[61vw] min-w-[228px] max-w-[264px] shrink-0 snap-start snap-always sm:w-auto sm:min-w-0 sm:max-w-none"
                  >
                    <ProductCard
                      product={product}
                      categoryName={
                        product.categoryId
                          ? categoryById.get(product.categoryId) ?? "Koleksi LUSE"
                          : "Koleksi LUSE"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </SiteLayout>
  );
}
