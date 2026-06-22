import { Check } from "lucide-react";
import { fabrics } from "@/data/fabrics";
import { useCustomizerStore } from "@/store/customizer-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function FabricSelector() {
  const selectedFabric = useCustomizerStore((s) => s.selectedFabric);
  const setFabric = useCustomizerStore((s) => s.setFabric);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fabrics.map((fabric) => {
        const isSelected = selectedFabric?.id === fabric.id;
        return (
          <button
            key={fabric.id}
            type="button"
            onClick={() => setFabric(fabric)}
            aria-pressed={isSelected}
            className={cn(
              "relative rounded-luxe border p-5 text-left transition-all duration-200",
              isSelected
                ? "border-champagne bg-champagne/10 shadow-soft"
                : "border-champagne/20 bg-white/70 hover:border-champagne/45",
            )}
          >
            {isSelected && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-champagne text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <div className="h-16 w-full rounded-xl" style={{ backgroundColor: fabric.swatch }} />
            <h3 className="mt-3 font-semibold text-charcoal">{fabric.name}</h3>
            <p className="mt-1 text-xs text-mink">{fabric.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-mink">
              <span className="rounded-full bg-white/80 px-2 py-0.5">{fabric.texture}</span>
              <span className="rounded-full bg-white/80 px-2 py-0.5">{fabric.comfortLevel}</span>
              <span className="rounded-full bg-white/80 px-2 py-0.5">{fabric.thickness}</span>
            </div>
            <p className="mt-3 text-xs font-medium text-champagne">
              {fabric.priceModifier > 0
                ? `+ ${formatPrice(fabric.priceModifier)}`
                : "Tanpa biaya tambahan"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
