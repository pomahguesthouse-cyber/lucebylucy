import { cn } from "@/lib/utils";
import { mannequinTone } from "@/lib/helpers";

interface MannequinProps {
  color: string;
  className?: string;
  detailed?: boolean;
}

export function Mannequin({ color, className, detailed }: MannequinProps) {
  return (
    <div className={cn("mannequin-wrap", className)}>
      <div className="mannequin-head" />
      <div className="mannequin-neck" />
      <div className={cn("mannequin-sleeve mannequin-sleeve-left", mannequinTone(color))} />
      <div className={cn("mannequin-sleeve mannequin-sleeve-right", mannequinTone(color))} />
      <div className={cn("mannequin-dress", mannequinTone(color), detailed && "is-detailed")} />
      <div className="mannequin-lines" />
      <div className="mannequin-hand mannequin-hand-left" />
      <div className="mannequin-hand mannequin-hand-right" />
      <div className="mannequin-base" />
    </div>
  );
}
