import { StatusBadge } from "@/components/ui/status-badge";
import type { DesignRequest } from "@/types";
import { formatPrice } from "@/lib/format";

interface AdminDesignRequestCardProps {
  request: DesignRequest;
}

const measurementLabels: Record<string, string> = {
  height: "Tinggi",
  weight: "Berat",
  bust: "Dada",
  waist: "Pinggang",
  hip: "Pinggul",
  shoulder: "Bahu",
  armLength: "P. lengan",
  armCircumference: "L. lengan",
  dressLength: "P. baju",
};

export function AdminDesignRequestCard({ request }: AdminDesignRequestCardProps) {
  const measurementEntries = Object.entries(request.measurements).filter(([, v]) => v);

  return (
    <article className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-mink">
            <span>{request.id}</span>
            <span>·</span>
            <span>{request.createdAt}</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold text-charcoal">
            {request.customerName}
          </h3>
          <p className="text-sm text-mink">
            {request.category} · {request.productName}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="Bahan" value={request.fabric} />
        <Field label="Warna" value={request.color} />
        <Field
          label="Ukuran"
          value={request.sizeType === "custom" ? "Custom measurement" : "Standar"}
        />
        <Field label="Estimasi" value={formatPrice(request.estimatedPrice)} />
      </dl>

      {measurementEntries.length > 0 && (
        <div className="mt-4 rounded-2xl bg-ivory/70 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-mink">Measurement (cm)</p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal">
            {measurementEntries.map(([key, value]) => (
              <span key={key}>
                {measurementLabels[key] ?? key}: <strong>{value}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-champagne/15 bg-ivory/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-mink">Rekomendasi AI</p>
        <p className="mt-1 text-sm text-charcoal">
          {request.aiRecommendation.designName} — {request.aiRecommendation.designDetails}
        </p>
        <p className="mt-1 text-xs text-mink">{request.aiRecommendation.productionNotes}</p>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium text-champagne">
          Lihat video prompt
        </summary>
        <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-ivory/60 px-4 py-3 text-xs text-mink">
          {request.videoPrompt}
        </p>
      </details>

      {request.productionNotes && (
        <div className="mt-4 rounded-2xl border border-champagne/15 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-mink">Catatan produksi</p>
          <p className="mt-1 text-sm text-charcoal">{request.productionNotes}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-mink">Video:</span>
        <StatusBadge status={request.videoStatus} type="video" />
        <span className="ml-2 text-mink">Bayar:</span>
        <StatusBadge status={request.paymentStatus} type="payment" />
        <span className="ml-2 text-mink">Produksi:</span>
        <StatusBadge status={request.productionStatus} type="production" />
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ivory/70 px-4 py-2.5">
      <dt className="text-[11px] uppercase tracking-wide text-mink">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-charcoal">{value}</dd>
    </div>
  );
}
