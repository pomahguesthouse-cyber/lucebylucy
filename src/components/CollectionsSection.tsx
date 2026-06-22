import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mannequin } from "@/components/Mannequin";
import { cn } from "@/lib/utils";
import { productBg } from "@/lib/helpers";
import { collections } from "@/data/content";

export function CollectionsSection() {
  return (
    <section id="koleksi" className="container py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 data-reveal className="font-display text-4xl tracking-[-0.04em]">
          Koleksi unggulan LUCE
        </h2>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          Lihat Semua Koleksi <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-4">
        {collections.map(([title, price, meta, tone]) => (
          <Card key={title} data-reveal className="overflow-hidden rounded-2xl bg-white">
            <div className={cn("relative h-[250px] overflow-hidden", productBg(tone))}>
              <Mannequin
                color={tone === "navy" ? "navy" : tone === "blush" ? "blush" : "sage"}
                className="absolute left-1/2 top-8 -translate-x-1/2 scale-[0.58]"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-charcoal">{price}</p>
              <p className="mt-1 text-xs text-champagne">
                {meta} <Sparkles className="inline h-3 w-3" />
              </p>
              <Button
                size="sm"
                className="mt-3 w-full rounded-md"
                onClick={() => {
                  const el = document.getElementById("custom-studio");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Customize
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
