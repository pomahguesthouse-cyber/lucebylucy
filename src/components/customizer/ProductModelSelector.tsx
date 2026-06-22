import { Check } from "lucide-react";
import { products } from "@/data/products";
import { useCustomizerStore } from "@/store/customizer-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductModelSelector() {
  const selectedCategory = useCustomizerStore((s) => s.selectedCategory);
  const selectedModel = useCustomizerStore((s) => s.selectedModel);
  const setModel = useCustomizerStore((s) => s.setModel);

  // Tampilkan model sesuai kategori; jika tidak ada, tampilkan semua sebagai fallback
  const filtered = products.filter((p) => p.category === selectedCategory);
  const list = filtered.length > 0 ? filtered : products;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((model) => {
        const isSelected = selectedModel?.id === model.id;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => setModel(model)}
            aria-pressed={isSelected}
            className={cn(
              "relative overflow-hidden rounded-luxe border text-left transition-all duration-200",
              isSelected
                ? "border-champagne shadow-soft"
                : "border-champagne/20 hover:border-champagne/45",
            )}
          >
            <div className="h-40 w-full" style={{ backgroundColor: model.imageColor }} />
            {isSelected && (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-champagne text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
            <div className="bg-white/80 p-4">
              <h3 className="font-semibold text-charcoal">{model.name}</h3>
              <p className="mt-1 text-xs text-mink">{model.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-champagne">
                  {formatPrice(model.basePrice)}
                </span>
                <span className="text-[11px] text-mink">{model.bestFor}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
