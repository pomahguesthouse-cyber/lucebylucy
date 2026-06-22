import { Sparkles } from "lucide-react";
import type { AIRecommendation } from "@/types";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
}

const rows: { key: keyof AIRecommendation; label: string }[] = [
  { key: "category", label: "Kategori" },
  { key: "fabric", label: "Bahan" },
  { key: "color", label: "Warna" },
  { key: "cutting", label: "Cutting" },
  { key: "designDetails", label: "Detail desain" },
  { key: "suitableOccasion", label: "Cocok untuk" },
];

export function AIRecommendationCard({ recommendation }: AIRecommendationCardProps) {
  return (
    <div className="rounded-luxe border border-champagne/25 bg-white/75 p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/15">
          <Sparkles className="h-4 w-4 text-champagne" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            Rekomendasi AI Stylist
          </p>
          <h3 className="font-display text-xl font-semibold text-charcoal">
            {recommendation.designName}
          </h3>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className="rounded-2xl bg-ivory/70 px-4 py-3">
            <dt className="text-[11px] uppercase tracking-wide text-mink">{row.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-charcoal">{recommendation[row.key]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-2xl border border-champagne/15 bg-ivory/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-mink">Catatan produksi</p>
        <p className="mt-1 text-sm leading-relaxed text-charcoal">
          {recommendation.productionNotes}
        </p>
      </div>

      <p className="mt-4 text-xs italic text-mink">
        Kak, rekomendasi ini adalah panduan ya. Harga final dan ketersediaan bahan akan
        dikonfirmasi tim setelah review. 💛
      </p>
    </div>
  );
}
