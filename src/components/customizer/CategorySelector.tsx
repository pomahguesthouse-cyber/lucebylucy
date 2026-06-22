import { Check } from "lucide-react";
import { categories } from "@/data/categories";
import { useCustomizerStore } from "@/store/customizer-store";
import { cn } from "@/lib/utils";

export function CategorySelector() {
  const selectedCategory = useCustomizerStore((s) => s.selectedCategory);
  const setCategory = useCustomizerStore((s) => s.setCategory);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategory(category.id)}
            aria-pressed={isSelected}
            className={cn(
              "relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200",
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
            <span className="text-2xl">{category.emoji}</span>
            <span className="mt-3 font-semibold text-charcoal">{category.name}</span>
            <span className="mt-1 text-xs text-mink">{category.description}</span>
          </button>
        );
      })}
    </div>
  );
}
