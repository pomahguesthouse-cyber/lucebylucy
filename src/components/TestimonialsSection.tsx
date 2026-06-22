import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { testimonials } from "@/data/content";

function Rating({ count }: { count: number }) {
  return (
    <span className="flex gap-1 text-champagne">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={cn("h-2 w-2 rounded-full", index < count ? "bg-champagne" : "bg-champagne/20")} />
      ))}
    </span>
  );
}

export function TestimonialsSection() {
  return (
    <section className="container py-4">
      <h2 data-reveal className="text-center font-display text-4xl tracking-[-0.045em] md:text-[2.55rem]">
        Mereka suka karena bisa lihat dulu hasilnya
      </h2>
      <div className="mt-7 grid gap-6 md:grid-cols-3">
        {testimonials.map(([name, quote]) => (
          <Card key={name} data-reveal className="rounded-2xl p-7">
            <p className="text-sm leading-7 text-mink">"{quote}"</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sand to-blush text-sm font-bold">
                  {name[0]}
                </span>
                <strong>{name}</strong>
              </div>
              <Rating count={5} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
