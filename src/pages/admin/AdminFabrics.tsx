import { AdminLayout } from "@/components/admin/AdminLayout";
import { fabrics } from "@/data/fabrics";
import { formatPrice } from "@/lib/format";

export function AdminFabrics() {
  return (
    <AdminLayout title="Fabrics" description="Kelola pustaka bahan dan biaya tambahannya.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fabrics.map((fabric) => (
          <div
            key={fabric.id}
            className="rounded-luxe border border-champagne/15 bg-white/75 p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg" style={{ backgroundColor: fabric.swatch }} />
              <div>
                <h3 className="font-semibold text-charcoal">{fabric.name}</h3>
                <p className="text-xs text-mink">{fabric.texture}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-mink">{fabric.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-mink">
                {fabric.comfortLevel} · {fabric.thickness}
              </span>
              <span className="font-semibold text-champagne">
                {fabric.priceModifier > 0 ? `+ ${formatPrice(fabric.priceModifier)}` : "Standar"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
