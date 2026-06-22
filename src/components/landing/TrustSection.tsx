import { HeartHandshake, Ruler, Sparkles, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const items = [
  {
    icon: Sparkles,
    title: "Desain personal",
    text: "Setiap busana dirancang sesuai selera dan kebutuhan Anda.",
  },
  {
    icon: Ruler,
    title: "Ukuran lebih pas",
    text: "Pilihan ukuran standar atau custom measurement untuk kenyamanan.",
  },
  {
    icon: HeartHandshake,
    title: "Preview sebelum produksi",
    text: "Lihat gambaran outfit lewat video preview sebelum memesan.",
  },
  {
    icon: ShieldCheck,
    title: "Review admin",
    text: "Tim meninjau setiap desain sebelum konfirmasi produksi.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-porcelain py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Kenapa LUCE
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Pengalaman custom yang tenang & terpercaya
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <div className="h-full rounded-luxe border border-champagne/15 bg-white/70 p-7 text-center shadow-soft">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15">
                  <item.icon className="h-6 w-6 text-champagne" />
                </div>
                <h3 className="mt-4 font-semibold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mink">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
