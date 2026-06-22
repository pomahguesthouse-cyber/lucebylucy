import { cn } from "@/lib/utils";

interface SilkBackgroundProps {
  subtle?: boolean;
}

export function SilkBackground({ subtle }: SilkBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", subtle && "opacity-50")}>
      <span className="absolute -right-20 top-0 h-[360px] w-[760px] rotate-[-12deg] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.82),rgba(234,218,200,0.42),transparent_68%)] blur-sm" />
      <span className="absolute right-0 top-40 h-[180px] w-[800px] rotate-[-18deg] rounded-[50%] border-t border-white/80 bg-white/20" />
    </div>
  );
}
