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
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-champagne/15 bg-white/90 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe sm:rounded-[28px]">
      <div className="relative">
        <ProductImageSlider
          images={product.imageUrls}
          alt={product.name}
          fallbackColor={product.imageColor}
          className="aspect-[4/5] w-full"
          imageClassName="group-hover:scale-[1.025]"
          autoPlay
          autoPlayInterval={3900}
          transition="fade"
          pauseOnHover
          compactControls
        />

        <Link
          to={detailUrl}
          aria-label={`Lihat detail ${product.name}`}
          className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-champagne"
        />

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[68%] flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-soft backdrop-blur sm:px-3 sm:py-1.5 sm:text-[10px]">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-md bg-champagne/10 px-2 py-1 font-mono text-[9px] font-semibold text-charcoal sm:text-[10px]">
            {product.productCode}
          </span>
          <strong className="shrink-0 text-sm font-semibold text-champagne sm:text-base">
            {formatPrice(product.basePrice)}
          </strong>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold leading-[1.08] text-charcoal sm:text-2xl">
          <Link to={detailUrl} className="transition hover:text-champagne">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-mink sm:mt-3 sm:text-sm">
          {product.description || "Produk sleepwear pilihan LUSE by Lucy."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-champagne/15 pt-4 sm:mt-5">
          <span className="text-[11px] leading-4 text-mink sm:text-xs">
            {product.imageUrls.length > 1
              ? `${product.imageUrls.length} foto`
              : "Foto produk"}
          </span>
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne transition hover:gap-2.5 sm:text-sm"
          >
            <span className="sm:hidden">Detail</span>
            <span className="hidden sm:inline">Lihat detail</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
