import { Reveal } from "@/components/ui/reveal";

const steps = [
  { number: "01", title: "Choose model", text: "Pilih kategori dan model dasar busana favorit Anda." },
  { number: "02", title: "Choose fabric & color", text: "Tentukan bahan dan warna sesuai karakter Anda." },
  { number: "03", title: "Add your size", text: "Masukkan ukuran standar atau custom measurement." },
  { number: "04", title: "Let AI refine", text: "AI menyempurnakan desain dan memberi rekomendasi." },
  { number: "05", title: "Generate video preview", text: "Lihat preview video model mengenakan outfit Anda." },
  { number: "06", title: "Order via WhatsApp", text: "Lanjutkan pesanan dengan ringkasan desain rapi." },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Cara kerja
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Enam langkah menuju outfit impian
            </h2>
            <p className="mt-4 text-mink">
              Proses yang tenang dan terpandu, dari memilih model sampai memesan.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.05}>
              <div className="h-full rounded-luxe border border-champagne/15 bg-white/70 p-7 shadow-soft">
                <span className="font-display text-3xl font-semibold text-champagne">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mink">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
