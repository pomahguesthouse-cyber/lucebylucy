import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-champagne/25 bg-white/70 px-3 py-1 text-xs font-semibold text-[#9a7136]",
        className,
      )}
      {...props}
    />
  );
}
