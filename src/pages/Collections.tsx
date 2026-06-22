import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Collections() {
  const [params] = useSearchParams();
  const initial = params.get("category") ?? "all";
  const [active, setActive] = useState(initial);

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Koleksi"
        title="Jelajahi koleksi LUCE"
        description="Temukan model dasar favorit Anda, lalu lanjutkan untuk menyesuaikan bahan, warna, dan ukuran di customizer."
      />
      <section className="container py-12">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              active === "all"
                ? "border-champagne bg-champagne/15 text-charcoal"
                : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50",
            )}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                active === category.id
                  ? "border-champagne bg-champagne/15 text-charcoal"
                  : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-luxe border border-champagne/15 bg-white/60 p-12 text-center text-mink">
            Belum ada model untuk kategori ini. Anda tetap bisa mendesain custom di customizer.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group overflow-hidden rounded-luxe border border-champagne/15 bg-white/70 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="h-52 w-full" style={{ backgroundColor: product.imageColor }} />
                <div className="p-5">
                  <h3 className="font-semibold text-charcoal">{product.name}</h3>
                  <p className="mt-1 text-sm text-mink">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-champagne">
                      {formatPrice(product.basePrice)}
                    </span>
                    <span className="text-xs text-champagne group-hover:underline">
                      Lihat detail →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
