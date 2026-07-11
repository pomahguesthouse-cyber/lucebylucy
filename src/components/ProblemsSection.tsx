import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { problems } from "@/data/content";
import type { LucideIcon } from "lucide-react";

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-champagne/20 bg-[#f7efe5] text-champagne">
      <Icon className="h-6 w-6" />
    </span>
  );
}

export function ProblemsSection() {
  return (
    <section className="container py-10 md:py-16">
      <h2 data-reveal className="text-center font-display text-4xl tracking-[-0.045em] md:text-[2.55rem]">
        Belanja busana online sering bikin ragu?
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {problems.map((problem) => (
          <Card key={problem.title} data-reveal className="grid min-h-[130px] grid-cols-[54px_1fr] gap-4 rounded-2xl p-6">
            <IconBadge icon={problem.icon} />
            <div>
              <h3 className="font-bold leading-snug">{problem.title}</h3>
              <p className="mt-2 text-sm text-mink">{problem.text}</p>
            </div>
          </Card>
        ))}
      </div>
      <p data-reveal className="mt-8 text-center text-base font-medium text-mink">
        Di Luse by lucy, kamu tidak hanya memilih produk. Kamu merancang busana yang paling pas untukmu.
      </p>
      <Sparkles className="mx-auto mt-4 h-5 w-5 fill-champagne text-champagne" />
    </section>
  );
}

export { IconBadge };
