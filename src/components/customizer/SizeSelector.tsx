import { SelectablePill } from "@/components/ui/selectable-pill";
import { useCustomizerStore } from "@/store/customizer-store";
import type { Measurements } from "@/types";
import { cn } from "@/lib/utils";

const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const measurementFields: { key: keyof Measurements; label: string }[] = [
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

export function SizeSelector() {
  const sizeType = useCustomizerStore((s) => s.sizeType);
  const setSizeType = useCustomizerStore((s) => s.setSizeType);
  const selectedSize = useCustomizerStore((s) => s.selectedSize);
  const setSelectedSize = useCustomizerStore((s) => s.setSelectedSize);
  const measurements = useCustomizerStore((s) => s.measurements);
  const setMeasurements = useCustomizerStore((s) => s.setMeasurements);

  return (
    <div className="space-y-7">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setSizeType("standard")}
          className={cn(
            "flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all",
            sizeType === "standard"
              ? "border-champagne bg-champagne/10 text-charcoal"
              : "border-champagne/20 bg-white/70 text-mink hover:border-champagne/45",
          )}
        >
          Ukuran standar
        </button>
        <button
          type="button"
          onClick={() => setSizeType("custom")}
          className={cn(
            "flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all",
            sizeType === "custom"
              ? "border-champagne bg-champagne/10 text-charcoal"
              : "border-champagne/20 bg-white/70 text-mink hover:border-champagne/45",
          )}
        >
          Custom measurement
        </button>
      </div>

      {sizeType === "standard" ? (
        <div>
          <h3 className="text-sm font-semibold text-charcoal">Pilih ukuran</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {standardSizes.map((size) => (
              <SelectablePill
                key={size}
                label={size}
                selected={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-semibold text-charcoal">Masukkan ukuran (cm)</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {measurementFields.map((field) => (
              <label key={field.key} className="text-xs font-medium text-mink">
                {field.label}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={measurements[field.key]}
                  onChange={(e) => setMeasurements({ [field.key]: e.target.value })}
                  placeholder="cm"
                  className="mt-1 w-full rounded-xl border border-champagne/25 bg-white/80 px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                />
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-mink">
            Tim Luse by lucy akan meninjau ukuran Anda sebelum produksi untuk memastikan kenyamanan.
          </p>
        </div>
      )}
    </div>
  );
}
