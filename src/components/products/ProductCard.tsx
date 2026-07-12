import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import type { ProductItem } from "@/lib/product-service";
import { ProductImageSlider } from "@/components/products/ProductImageSlider";

interface ProductCardProps {
  product: ProductItem;
  categoryName: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const detailUrl = `/products/${product.id}`;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-champagne/15 bg-white/80 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe">
      <div className="relative">
        <ProductImageSlider
          images={product.imageUrls}
          alt={product.name}
          fallbackColor={product.imageColor}
          className="aspect-[4/5] w-full"
          imageClassName="transition duration-700 group-hover:scale-[1.025]"
        />

        <Link
          to={detailUrl}
          aria-label={`Lihat detail ${product.name}`}
          className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-champagne"
        />

        <div className="pointer-events-none absolute left-4 top-4 z-20 flex max-w-[70%] flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-soft backdrop-blur">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex rounded-md bg-champagne/10 px-2 py-1 font-mono text-[10px] font-semibold text-charcoal">
              {product.productCode}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-charcoal">
              <Link to={detailUrl} className="transition hover:text-champagne">
                {product.name}
              </Link>
            </h3>
          </div>
          <strong className="shrink-0 pt-1 text-sm text-champagne">
            {formatPrice(product.basePrice)}
          </strong>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-mink">
          {product.description || "Produk sleepwear pilihan LUSE by Lucy."}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-champagne/15 pt-4">
          <span className="text-xs text-mink">
            {product.imageUrls.length > 1
              ? `${product.imageUrls.length} foto produk`
              : "Foto produk"}
          </span>
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-champagne transition hover:gap-3"
          >
            Lihat detail <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
