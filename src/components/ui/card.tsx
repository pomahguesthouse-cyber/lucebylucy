import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-luxe border border-champagne/15 bg-white/72 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-luxe",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export { Card };
