import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fabricBg } from "@/lib/helpers";
import { fabrics } from "@/data/content";

function Rating({ count }: { count: number }) {
  return (
    <span className="flex gap-1 text-champagne">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={cn("h-2 w-2 rounded-full", index < count ? "bg-champagne" : "bg-champagne/20")} />
      ))}
    </span>
  );
}

export function FabricsSection() {
  return (
    <section id="bahan" className="container py-10">
      <h2 data-reveal className="mb-5 font-display text-4xl tracking-[-0.04em]">
        Pilih bahan sesuai karakter gayamu
      </h2>
      <div className="grid gap-5 md:grid-cols-5">
        {fabrics.map(([name, desc, tone]) => (
          <Card key={name} data-reveal className="overflow-hidden rounded-2xl bg-white">
            <div className={cn("h-36", fabricBg(tone))} />
            <div className="p-4">
              <h3 className="font-display text-2xl text-[#9a7136]">{name}</h3>
              <p className="text-sm text-charcoal">{desc}</p>
              {["Ketebalan", "Jatuh Kain", "Kilap", "Kenyamanan"].map((row, index) => (
                <div key={row} className="mt-2 grid grid-cols-[74px_1fr] items-center gap-2 text-xs text-mink">
                  <span>{row}</span>
                  <Rating count={index === 2 && name !== "Satin Silk" ? 3 : 4} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
