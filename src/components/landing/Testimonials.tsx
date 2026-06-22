import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/data/design-details";

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Kata mereka
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Dipercaya para pencinta modest fashion
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.06}>
              <figure className="h-full rounded-luxe border border-champagne/15 bg-white/70 p-7 shadow-soft">
                <Quote className="h-7 w-7 text-champagne/60" />
                <blockquote className="mt-4 text-sm leading-relaxed text-charcoal">
                  “{item.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-charcoal">{item.name}</span>
                  <span className="text-mink"> · {item.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
