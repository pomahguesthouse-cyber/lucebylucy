import { Link } from "react-router-dom";
import { ClipboardList, ShoppingBag, Scissors, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { designRequests } from "@/data/admin-requests";
import { formatPrice } from "@/lib/format";

export function AdminDashboard() {
  const total = designRequests.length;
  const waitingReview = designRequests.filter(
    (r) => r.status === "submitted" || r.status === "waiting_review",
  ).length;
  const inProduction = designRequests.filter((r) => r.productionStatus !== "pending_confirmation").length;
  const revenue = designRequests
    .filter((r) => r.paymentStatus !== "unpaid")
    .reduce((sum, r) => sum + r.estimatedPrice, 0);

  const stats = [
    { label: "Total design requests", value: String(total), icon: ClipboardList },
    { label: "Menunggu review", value: String(waitingReview), icon: Sparkles },
    { label: "Dalam produksi", value: String(inProduction), icon: Scissors },
    { label: "Estimasi pendapatan", value: formatPrice(revenue), icon: ShoppingBag },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      description="Ringkasan aktivitas Luse by lucy."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-luxe border border-champagne/15 bg-white/75 p-5 shadow-soft"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/15">
              <stat.icon className="h-4 w-4 text-champagne" />
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-charcoal">{stat.value}</p>
            <p className="mt-1 text-xs text-mink">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-charcoal">
            Design request terbaru
          </h2>
          <Link
            to="/admin/design-requests"
            className="text-sm font-semibold text-champagne hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-mink">
              <tr>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Kategori</th>
                <th className="py-2 pr-4">Estimasi</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {designRequests.map((request) => (
                <tr key={request.id} className="border-t border-champagne/10">
                  <td className="py-3 pr-4 font-medium text-charcoal">{request.customerName}</td>
                  <td className="py-3 pr-4 text-mink">{request.category}</td>
                  <td className="py-3 pr-4 font-semibold text-champagne">
                    {formatPrice(request.estimatedPrice)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
