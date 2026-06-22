import { trusts } from "@/data/content";
import { IconBadge } from "@/components/ProblemsSection";

export function TrustSection() {
  return (
    <section className="container py-12">
      <h2 data-reveal className="text-center font-display text-4xl tracking-[-0.045em] md:text-[2.55rem]">
        Dibuat dengan detail, bukan asal jahit.
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-5">
        {trusts.map(([title, Icon]) => (
          <div key={title} data-reveal className="flex items-center gap-3 rounded-2xl bg-white/65 p-4 shadow-soft">
            <IconBadge icon={Icon} />
            <p className="text-sm font-bold leading-snug">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
