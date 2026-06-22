import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({ steps, current, onStepClick }: StepIndicatorProps) {
  return (
    <div>
      {/* Versi ringkas untuk mobile */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-semibold text-charcoal">
          Langkah {current + 1} dari {steps.length}
        </span>
        <span className="text-xs text-mink">{steps[current]}</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-champagne/15 sm:hidden">
        <div
          className="h-full rounded-full bg-champagne transition-all"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Versi lengkap untuk layar besar */}
      <ol className="hidden flex-wrap gap-2 sm:flex">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={index > current}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  isCurrent && "border-champagne bg-champagne/15 text-charcoal",
                  isDone && "border-champagne/30 bg-white/70 text-charcoal",
                  !isCurrent && !isDone && "border-champagne/15 bg-white/40 text-mink",
                  index > current && "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                    isDone ? "bg-champagne text-white" : "bg-champagne/20 text-champagne",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                {step}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
