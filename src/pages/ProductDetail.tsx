import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { useCustomizerStore } from "@/store/customizer-store";

export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const setCategory = useCustomizerStore((s) => s.setCategory);
  const setModel = useCustomizerStore((s) => s.setModel);

  if (!product) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Produk tidak ditemukan
          </h1>
          <Link to="/collections" className="mt-4 inline-block text-champagne hover:underline">
            ← Kembali ke koleksi
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const categoryName = categories.find((c) => c.id === product.category)?.name ?? "";

  const startDesigning = () => {
    setCategory(product.category);
    setModel(product);
  };

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-sm text-mink hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke koleksi
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div
            className="aspect-[4/5] w-full rounded-luxe shadow-soft"
            style={{ backgroundColor: product.imageColor }}
          />
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              {categoryName}
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-mink">{product.description}</p>
            <p className="mt-6 text-2xl font-semibold text-champagne">
              {formatPrice(product.basePrice)}
            </p>
            <p className="mt-1 text-sm text-mink">Cocok untuk {product.bestFor.toLowerCase()}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/customize" onClick={startDesigning}>
                <Button variant="gold" size="lg">
                  Sesuaikan model ini
                </Button>
              </Link>
              <Link to="/ai-stylist">
                <Button variant="outline" size="lg">
                  Tanya AI Stylist
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-mink">
              Harga dasar belum termasuk pilihan bahan dan ukuran custom. Estimasi final
              dikonfirmasi tim setelah review.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
