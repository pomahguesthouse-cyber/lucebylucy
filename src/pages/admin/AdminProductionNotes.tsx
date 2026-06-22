import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { designRequests } from "@/data/admin-requests";

export function AdminProductionNotes() {
  return (
    <AdminLayout
      title="Production notes"
      description="Catatan teknis produksi untuk tim pola, potong, dan jahit."
    >
      <div className="space-y-4">
        {designRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-charcoal">
                  {request.customerName} · {request.productName}
                </h3>
                <p className="text-xs text-mink">{request.id}</p>
              </div>
              <StatusBadge status={request.productionStatus} type="production" />
            </div>
            <p className="mt-3 rounded-2xl bg-ivory/70 px-4 py-3 text-sm text-charcoal">
              {request.productionNotes || "Belum ada catatan produksi."}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
