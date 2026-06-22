import { useState, useCallback } from "react";
import { ArrowRight, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sizeFields = [
  "Tinggi Badan",
  "Lingkar Dada",
  "Lingkar Pinggang",
  "Lingkar Pinggul",
  "Panjang Baju",
  "Panjang Lengan",
];

type SizeData = Record<string, string>;

export function SizeGuideSection() {
  const [sizes, setSizes] = useState<SizeData>(
    Object.fromEntries(sizeFields.map((f) => [f, ""])),
  );
  const [filled, setFilled] = useState(false);

  const handleChange = useCallback((field: string, value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9.]/g, "");
    setSizes((prev) => ({ ...prev, [field]: numericValue }));
    setFilled(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const hasValues = Object.values(sizes).some((v) => v.trim() !== "");
    if (hasValues) {
      localStorage.setItem("luce-custom-sizes", JSON.stringify(sizes));
      setFilled(true);
      setTimeout(() => setFilled(false), 3000);
    }
  }, [sizes]);

  const filledCount = Object.values(sizes).filter((v) => v.trim() !== "").length;

  return (
    <section id="size-guide" className="container grid gap-6 py-5 lg:grid-cols-[0.8fr_1.25fr_0.75fr]">
      <div data-reveal>
        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em]">
          Ukuranmu, desainmu, gayamu.
        </h2>
        <p className="mt-3 text-mink">
          Gunakan ukuran standar atau masukkan ukuran tubuh sendiri. Sistem LUCE akan membantu menyesuaikan setiap detail busana untukmu.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            const el = document.getElementById("size-form");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        >
          Coba Custom Size
        </Button>
      </div>

      <Card id="size-form" data-reveal className="rounded-2xl p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {sizeFields.map((field) => (
            <label key={field} className="relative">
              <span className="sr-only">{field}</span>
              <input
                className={cn(
                  "h-11 w-full rounded-lg border border-champagne/20 bg-white/75 px-4 text-sm outline-none transition focus:border-champagne",
                  sizes[field] && "border-champagne/40 bg-white",
                )}
                placeholder={field}
                value={sizes[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                inputMode="decimal"
                type="text"
              />
              <span className="absolute right-3 top-3 text-xs text-mink">cm</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-mink">
            {filledCount}/{sizeFields.length} field terisi
          </span>
          <Button size="sm" onClick={handleSubmit} disabled={filledCount === 0}>
            Simpan Ukuran
          </Button>
        </div>

        {/* Toast */}
        <div
          className={cn(
            "mt-3 overflow-hidden rounded-xl bg-champagne/10 text-center text-sm font-semibold text-champagne transition-all duration-300",
            filled ? "max-h-12 py-2.5 opacity-100" : "max-h-0 py-0 opacity-0",
          )}
        >
          Ukuran berhasil disimpan! 📐
        </div>
      </Card>

      <Card data-reveal className="relative overflow-hidden rounded-2xl bg-[#f7f0e8] p-6">
        <h3 className="font-bold">Panduan Mengukur</h3>
        <p className="mt-3 text-sm text-mink">Lihat cara mengukur badan dengan benar.</p>
        <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-champagne" href="#kontak">
          Lihat Panduan <ArrowRight className="h-4 w-4" />
        </a>
        <Ruler className="absolute bottom-4 right-4 h-24 w-24 text-champagne/30" />
      </Card>
    </section>
  );
}
