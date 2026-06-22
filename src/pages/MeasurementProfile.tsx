import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useCustomizerStore } from "@/store/customizer-store";
import type { Measurements } from "@/types";

const fields: { key: keyof Measurements; label: string }[] = [
  { key: "height", label: "Tinggi badan" },
  { key: "weight", label: "Berat badan" },
  { key: "bust", label: "Lingkar dada" },
  { key: "waist", label: "Lingkar pinggang" },
  { key: "hip", label: "Lingkar pinggul" },
  { key: "shoulder", label: "Lebar bahu" },
  { key: "armLength", label: "Panjang lengan" },
  { key: "armCircumference", label: "Lingkar lengan" },
  { key: "dressLength", label: "Panjang baju" },
];

export function MeasurementProfile() {
  const measurements = useCustomizerStore((s) => s.measurements);
  const setMeasurements = useCustomizerStore((s) => s.setMeasurements);
  const customerName = useCustomizerStore((s) => s.customerName);
  const setCustomerName = useCustomizerStore((s) => s.setCustomerName);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Akun"
        title="Profil ukuran"
        description="Simpan ukuran Anda agar proses desain berikutnya lebih cepat. Ukuran dalam sentimeter (cm)."
      />
      <section className="container py-12">
        <div className="mx-auto max-w-2xl rounded-luxe border border-champagne/15 bg-white/70 p-7 shadow-soft">
          <label className="block text-xs font-medium text-mink">
            Nama profil
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Mis. Ukuran utama"
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white/80 px-3 py-2.5 text-sm text-charcoal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
            />
          </label>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field.key} className="text-xs font-medium text-mink">
                {field.label}
                <input
                  type="number"
                  min="0"
                  value={measurements[field.key]}
                  onChange={(e) => setMeasurements({ [field.key]: e.target.value })}
                  placeholder="cm"
                  className="mt-1 w-full rounded-xl border border-champagne/25 bg-white/80 px-3 py-2.5 text-sm text-charcoal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-mink">Tersimpan otomatis untuk sesi ini.</p>
            <Button variant="gold">Simpan ukuran</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
