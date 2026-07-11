import { AlertCircle, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HermesDesignerCardProps {
  answer: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
}

export function HermesDesignerCard({
  answer,
  loading,
  error,
  onRetry,
}: HermesDesignerCardProps) {
  if (loading) {
    return (
      <div className="rounded-luxe border border-champagne/25 bg-white/75 p-6 shadow-soft">
        <div className="flex items-center gap-3 text-charcoal">
          <Loader2 className="h-5 w-5 animate-spin text-champagne" />
          <div>
            <p className="text-sm font-semibold">Luse by lucy Fashion Designer sedang bekerja</p>
            <p className="mt-1 text-xs text-mink">Merangkai model, bahan, warna, dan detail pilihan Kak…</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div className="shimmer h-4 w-4/5 rounded-full" />
          <div className="shimmer h-4 w-full rounded-full" />
          <div className="shimmer h-4 w-3/5 rounded-full" />
        </div>
      </div>
    );
  }

  if (answer) {
    return (
      <div className="rounded-luxe border border-champagne/25 bg-white/75 p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/15">
            <Sparkles className="h-4 w-4 text-champagne" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              Luse by lucy Fashion Designer
            </p>
            <h3 className="font-display text-xl font-semibold text-charcoal">
              Rekomendasi personal untuk Kak
            </h3>
          </div>
        </div>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-charcoal">{answer}</p>
        <div className="mt-5 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3.5 w-3.5" />
            Buat ulang rekomendasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-luxe border border-amber-300/40 bg-amber-50/70 p-6">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="text-sm font-semibold text-charcoal">Rekomendasi AI belum tersedia</p>
          <p className="mt-1 text-sm text-mink">{error || "Silakan coba kembali."}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-4">
            <RefreshCw className="h-3.5 w-3.5" />
            Coba lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
