import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { StatusBadge } from "@/components/ui/status-badge";
import { designRequests } from "@/data/admin-requests";
import { formatPrice } from "@/lib/format";

const myOrders = designRequests.filter((d) => d.paymentStatus !== "unpaid" || d.status === "approved");

export function MyOrders() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Akun"
        title="Pesanan saya"
        description="Lihat status pembayaran dan produksi pesanan custom Anda."
      />
      <section className="container py-12">
        {myOrders.length === 0 ? (
          <div className="rounded-luxe border border-champagne/15 bg-white/60 p-12 text-center text-mink">
            Belum ada pesanan. Setelah desain disetujui, pesanan akan muncul di sini.
          </div>
        ) : (
          <div className="overflow-hidden rounded-luxe border border-champagne/15 bg-white/70 shadow-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory/80 text-xs uppercase tracking-wide text-mink">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Desain</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pembayaran</th>
                  <th className="px-4 py-3">Produksi</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => (
                  <tr key={order.id} className="border-t border-champagne/10">
                    <td className="px-4 py-3 font-medium text-charcoal">{order.id}</td>
                    <td className="px-4 py-3 text-mink">{order.aiRecommendation.designName}</td>
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
        )}
      </section>
    </SiteLayout>
  );
}
