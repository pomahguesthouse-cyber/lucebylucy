import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageOff, Images, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductImageManager } from "@/components/products/ProductImageManager";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice } from "@/lib/format";
import { fetchAllCategories, type CollectionCategory } from "@/lib/category-service";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
  type ProductItem,
  type ProductStatus,
} from "@/lib/product-service";

interface ProductFormState {
  productCode: string;
  name: string;
  categoryId: string;
  description: string;
  basePrice: string;
  imageUrls: string;
  imageColor: string;
  bestFor: string;
  status: ProductStatus;
  sortOrder: string;
}

const emptyForm: ProductFormState = {
  productCode: "",
  name: "",
  categoryId: "",
  description: "",
  basePrice: "",
  imageUrls: "",
  imageColor: "#e6d8c2",
  bestFor: "",
  status: "draft",
  sortOrder: "",
};

const PRODUCT_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,39}$/;

const parseImageUrls = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

const isValidImageUrl = (value: string): boolean => {
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const putCoverFirst = (imageUrls: string[], coverUrl: string): string[] => {
  if (!coverUrl || !imageUrls.includes(coverUrl)) return imageUrls;
  return [coverUrl, ...imageUrls.filter((imageUrl) => imageUrl !== coverUrl)];
};

export function AdminProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CollectionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyForm);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [productItems, categoryItems] = await Promise.all([
        fetchAllProducts(),
        fetchAllCategories(),
      ]);
      setProducts(productItems);
      setCategories(categoryItems);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditingId(null);
    setCoverImageUrl("");
    setForm(emptyForm);
  };

  const startEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setCoverImageUrl(product.imageUrls[0] ?? "");
    setForm({
      productCode: product.productCode,
      name: product.name,
      categoryId: product.categoryId ?? "",
      description: product.description ?? "",
      basePrice: String(product.basePrice),
      imageUrls: product.imageUrls.join("\n"),
      imageColor: product.imageColor || "#e6d8c2",
      bestFor: product.bestFor ?? "",
      status: product.status,
      sortOrder: String(product.sortOrder),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nama produk wajib diisi.");
      return;
    }

    const productCode = form.productCode.trim().toUpperCase();
    if (productCode && !PRODUCT_CODE_PATTERN.test(productCode)) {
      toast.error("Kode produk harus 2-40 karakter dan hanya berisi huruf, angka, atau tanda hubung.");
      return;
    }

    const basePrice = Number(form.basePrice);
    if (!Number.isFinite(basePrice) || basePrice < 0) {
      toast.error("Harga dasar harus berupa angka nol atau lebih.");
      return;
    }

    const parsedImages = parseImageUrls(form.imageUrls);
    const invalidImageUrl = parsedImages.find((imageUrl) => !isValidImageUrl(imageUrl));
    if (invalidImageUrl) {
      toast.error(`URL gambar tidak valid: ${invalidImageUrl}`);
      return;
    }

    const imageUrls = putCoverFirst(parsedImages, coverImageUrl);
    const parsedSortOrder = Number.parseInt(form.sortOrder, 10);
    const sortOrder = Number.isNaN(parsedSortOrder) ? products.length * 10 : parsedSortOrder;

    setSaving(true);
    try {
      const input = {
        productCode,
        name: form.name,
        categoryId: form.categoryId || null,
        description: form.description,
        basePrice,
        imageUrls,
        imageColor: form.imageColor,
        bestFor: form.bestFor,
        status: form.status,
        sortOrder,
      };

      if (editingId) {
        await updateProduct(editingId, input);
        toast.success("Produk berhasil diperbarui.");
      } else {
        await createProduct(input);
        toast.success(
          productCode
            ? `Produk berhasil ditambahkan dengan kode ${productCode}.`
            : "Produk berhasil ditambahkan dengan kode otomatis.",
        );
      }

      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: ProductItem) => {
    if (!window.confirm(`Hapus produk "${product.name}" (${product.productCode})?`)) return;

    try {
      await deleteProduct(product.id);
      toast.success("Produk berhasil dihapus.");
      if (editingId === product.id) resetForm();
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus produk.");
    }
  };

  return (
    <AdminLayout
      title="Products"
      description="Kelola kode, produk, harga, kategori, galeri gambar, cover, dan status publikasi."
    >
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-luxe border border-champagne/20 bg-white/75 p-6 shadow-soft"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal">
              {editingId ? "Edit produk" : "Tambah produk"}
            </h2>
            <p className="mt-1 text-xs text-mink">
              Kosongkan kode agar sistem menghasilkan LU-0001, LU-0002, dan seterusnya.
            </p>
          </div>
          {editingId && (
            <Button type="button" size="sm" variant="outline" onClick={resetForm}>
              <X className="h-3.5 w-3.5" /> Batal edit
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Kode produk
            </label>
            <input
              type="text"
              value={form.productCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  productCode: event.target.value.toUpperCase(),
                }))
              }
              maxLength={40}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 font-mono text-sm uppercase outline-none focus:border-champagne"
              placeholder="Otomatis, contoh LU-0079"
            />
            <p className="mt-1 text-[11px] text-mink">
              Opsional. Custom: LUSE-SATIN-01 atau PYJ-2026-08.
            </p>
          </div>

          <div className="xl:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Nama produk
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Contoh: Satin Pajama Set"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Harga dasar
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={form.basePrice}
              onChange={(event) =>
                setForm((current) => ({ ...current, basePrice: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="289000"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Kategori</label>
            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((current) => ({ ...current, categoryId: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
            >
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={3}
              className="mt-1 w-full resize-y rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Deskripsi singkat produk dan keunggulannya."
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Cocok untuk</label>
            <input
              type="text"
              value={form.bestFor}
              onChange={(event) =>
                setForm((current) => ({ ...current, bestFor: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Tidur malam dan bersantai"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-4">
            <ProductImageManager
              value={form.imageUrls}
              coverUrl={coverImageUrl}
              disabled={saving}
              onChange={(imageUrls) =>
                setForm((current) => ({ ...current, imageUrls }))
              }
              onCoverChange={setCoverImageUrl}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Warna pratinjau</label>
            <div className="mt-1 flex items-center gap-3 rounded-xl border border-champagne/25 bg-white px-3 py-2">
              <input
                type="color"
                value={form.imageColor}
                onChange={(event) =>
                  setForm((current) => ({ ...current, imageColor: event.target.value }))
                }
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Pilih warna pratinjau produk"
              />
              <span className="text-sm uppercase text-mink">{form.imageColor}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Status</label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ProductStatus,
                }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Urutan</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({ ...current, sortOrder: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder={String(products.length * 10)}
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" variant="gold" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…
                </>
              ) : editingId ? (
                <>
                  <Pencil className="h-4 w-4" /> Simpan perubahan
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Tambah produk
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-mink">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memuat produk…
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-luxe border border-dashed border-champagne/30 bg-white/60 py-16 text-center text-mink">
          Belum ada produk. Tambahkan produk pertama dari formulir di atas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-luxe border border-champagne/15 bg-white/75 shadow-soft">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-ivory/80 text-xs uppercase tracking-wide text-mink">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga dasar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-champagne/10 align-middle">
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-champagne/10 px-2.5 py-1 font-mono text-xs font-semibold text-charcoal">
                      {product.productCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-champagne/15"
                        style={{ backgroundColor: product.imageColor }}
                      >
                        {product.imageUrls[0] ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-4 w-4 text-charcoal/35" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-charcoal">{product.name}</p>
                          {product.imageUrls.length > 1 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-champagne/10 px-2 py-0.5 text-[10px] font-semibold text-champagne">
                              <Images className="h-3 w-3" /> {product.imageUrls.length} foto
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 max-w-md truncate text-xs text-mink">
                          {product.description || product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-mink">
                    {product.categoryId
                      ? categoryNameById.get(product.categoryId) ?? "Kategori dihapus"
                      : "Tanpa kategori"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-champagne">
                    {formatPrice(product.basePrice)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => startEdit(product)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void handleDelete(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
