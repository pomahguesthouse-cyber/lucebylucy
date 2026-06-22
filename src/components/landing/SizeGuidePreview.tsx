import { Link } from "react-router-dom";
import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const measurementPoints = [
  "Tinggi & berat",
  "Lingkar dada",
  "Lingkar pinggang",
  "Lingkar pinggul",
  "Bahu & lengan",
  "Panjang baju",
];

export function SizeGuidePreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Ukuran & measurement
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Ukuran standar atau custom, sesuka Anda
            </h2>
            <p className="mt-4 text-mink">
              Gunakan ukuran standar untuk cepat, atau masukkan measurement custom agar
              busana benar-benar pas. Tim kami meninjau ukuran sebelum produksi.
            </p>
            <Link to="/size-guide" className="mt-8 inline-block">
              <Button variant="outline">
                <Ruler className="h-4 w-4" />
                Lihat panduan ukuran
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            {measurementPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-champagne/15 bg-white/70 px-4 py-5 text-sm font-medium text-charcoal shadow-soft"
              >
                {point}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
