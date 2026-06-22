import { Check } from "lucide-react";
import { colors } from "@/data/colors";
import { useCustomizerStore } from "@/store/customizer-store";
import { cn } from "@/lib/utils";

export function ColorSwatchSelector() {
  const selectedColor = useCustomizerStore((s) => s.selectedColor);
  const setColor = useCustomizerStore((s) => s.setColor);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {colors.map((color) => {
        const isSelected = selectedColor?.id === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => setColor(color)}
            aria-pressed={isSelected}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200",
              isSelected
                ? "border-champagne bg-champagne/10 shadow-soft"
                : "border-champagne/20 bg-white/70 hover:border-champagne/45",
            )}
          >
            <span
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/5"
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
            </span>
            <span className="text-left">
              <span className="block text-sm font-medium text-charcoal">{color.name}</span>
              <span className="block text-[11px] text-mink">{color.family}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
