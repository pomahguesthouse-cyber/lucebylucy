import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-charcoal text-white shadow-soft hover:-translate-y-0.5 hover:bg-black",
        outline: "border border-champagne/55 bg-white/65 text-charcoal hover:-translate-y-0.5 hover:bg-white",
        gold: "bg-champagne text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#b8893f]",
        ghost: "bg-white/75 text-charcoal hover:bg-white",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
