import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductImageSlider } from "@/components/products/ProductImageSlider";
import { Button } from "@/components/ui/button";
import {
  fetchActiveCategories,
  type CollectionCategory,
} from "@/lib/category-service";
import {
  fetchApprovedProductById,
  type ProductItem,
} from "@/lib/product-service";
import { formatPrice } from "@/lib/format";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [categories, setCategories] = useState<CollectionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [productItem, categoryItems] = await Promise.all([
          fetchApprovedProductById(id),
          fetchActiveCategories(),
        ]);

        if (cancelled) return;
        setProduct(productItem);
        setCategories(categoryItems);
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Detail produk belum dapat dimuat.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const categoryName = useMemo(
    () =>
      categories.find((category) => category.id === product?.categoryId)?.name ??
      "Koleksi LUSE",
    [categories, product?.categoryId],
  );

  if (loading) {
    return (
      <SiteLayout>
        <div className="container flex min-h-[55vh] items-center justify-center gap-3 text-mink">
          <Loader2 className="h-5 w-5 animate-spin" />
          Memuat detail produk…
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Detail produk gagal dimuat
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-mink">{error}</p>
          <Link to="/collections" className="mt-5 inline-block text-champagne hover:underline">
            ← Kembali ke koleksi
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Produk tidak ditemukan
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-mink">
            Produk mungkin belum disetujui, sudah diarsipkan, atau telah dihapus admin.
          </p>
          <Link to="/collections" className="mt-5 inline-block text-champagne hover:underline">
            ← Kembali ke koleksi
          </Link>
        </div>
      </SiteLayout>
    );
  }

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
          <div>
            <ProductImageSlider
              images={product.imageUrls}
              alt={product.name}
              fallbackColor={product.imageColor}
              loading="eager"
              className="aspect-[4/5] w-full rounded-luxe shadow-soft"
              imageClassName="transition duration-500"
            />
            {product.imageUrls.length > 1 && (
              <p className="mt-3 text-center text-xs text-mink">
                Geser foto atau gunakan tombol panah untuk melihat {product.imageUrls.length} gambar produk.
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                {categoryName}
              </span>
              <span className="rounded-md bg-champagne/10 px-2.5 py-1 font-mono text-xs font-semibold text-charcoal">
                {product.productCode}
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 leading-relaxed text-mink">
              {product.description || "Produk sleepwear pilihan LUSE by Lucy."}
            </p>
            <p className="mt-6 text-2xl font-semibold text-champagne">
              {formatPrice(product.basePrice)}
            </p>
            {product.bestFor && (
              <p className="mt-2 text-sm text-mink">Cocok untuk {product.bestFor.toLowerCase()}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/contact?product=${encodeURIComponent(product.productCode)}`}>
                <Button variant="gold" size="lg">
                  Tanya produk ini
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline" size="lg">
                  Lihat produk lain
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-mink">
              Sebutkan kode <strong>{product.productCode}</strong> saat menghubungi admin agar produk
              lebih cepat ditemukan. Harga, foto, dan informasi ditampilkan langsung dari database LUSE.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
