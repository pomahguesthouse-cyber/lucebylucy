import { Shirt, Scissors, Ruler, WandSparkles, ShoppingBag } from "lucide-react";
import { steps } from "@/data/content";

const stepIcons = [Shirt, Scissors, Ruler, WandSparkles, ShoppingBag];

export function StepsSection() {
  return (
    <section className="container py-12">
      <h2 data-reveal className="text-center font-display text-4xl tracking-[-0.045em] md:text-[2.55rem]">
        Cara pesan busana custom di LUCE
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map(([title, text], index) => {
          const Icon = stepIcons[index];
          return (
            <div key={title} data-reveal className="relative text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-champagne/20 bg-white/75 text-champagne shadow-soft">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-bold">
                {index + 1}. {title}
              </h3>
              <p className="mx-auto mt-2 max-w-[150px] text-sm text-mink">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
