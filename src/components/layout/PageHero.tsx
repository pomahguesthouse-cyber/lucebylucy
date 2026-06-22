import type { ReactNode } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

// Header standar untuk halaman bagian dalam
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-champagne/15 bg-porcelain">
      <div className="container py-12 md:py-16">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-mink">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export { SiteLayout };
