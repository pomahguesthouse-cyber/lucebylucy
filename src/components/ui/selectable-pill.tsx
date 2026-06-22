import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectablePillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

// Chip pilihan yang dapat dipilih, dipakai di seluruh customizer
export function SelectablePill({ label, selected, onClick }: SelectablePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        selected
          ? "border-champagne bg-champagne/15 text-charcoal"
          : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50 hover:text-charcoal",
      )}
    >
      {selected && <Check className="h-3.5 w-3.5 text-champagne" />}
      {label}
    </button>
  );
}
