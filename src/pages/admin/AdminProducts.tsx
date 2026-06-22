import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";

export function AdminProducts() {
  return (
    <AdminLayout title="Products" description="Kelola model dasar busana yang tersedia.">
      <div className="overflow-x-auto rounded-luxe border border-champagne/15 bg-white/75 shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-ivory/80 text-xs uppercase tracking-wide text-mink">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga dasar</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-champagne/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-lg"
                      style={{ backgroundColor: product.imageColor }}
                    />
                    <span className="font-medium text-charcoal">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-mink">
                  {categories.find((c) => c.id === product.category)?.name}
                </td>
                <td className="px-4 py-3 font-semibold text-champagne">
                  {formatPrice(product.basePrice)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status="approved" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
