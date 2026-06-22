import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { designRequests } from "@/data/admin-requests";
import { formatPrice } from "@/lib/format";

export function AdminOrders() {
  return (
    <AdminLayout
      title="Orders"
      description="Pantau status pembayaran dan produksi setiap pesanan."
    >
      <div className="overflow-x-auto rounded-luxe border border-champagne/15 bg-white/75 shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-ivory/80 text-xs uppercase tracking-wide text-mink">
            <tr>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pembayaran</th>
              <th className="px-4 py-3">Produksi</th>
            </tr>
          </thead>
          <tbody>
            {designRequests.map((order) => (
              <tr key={order.id} className="border-t border-champagne/10">
                <td className="px-4 py-3 font-medium text-charcoal">{order.id}</td>
                <td className="px-4 py-3 text-mink">{order.customerName}</td>
                <td className="px-4 py-3 font-semibold text-champagne">
                  {formatPrice(order.estimatedPrice)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.productionStatus} type="production" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-mink">
        Pembayaran nyata belum diaktifkan di MVP ini. Status di atas adalah contoh data.
      </p>
    </AdminLayout>
  );
}
