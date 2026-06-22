import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  CircleUserRound,
  MessageCircle,
  Minus,
  PackageCheck,
  Palette,
  Plus,
  Ruler,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = ["Koleksi", "Custom Studio", "Bahan", "Size Guide", "Tentang LUCE", "Kontak"];

const problems = [
  {
    icon: Ruler,
    title: "Takut ukuran tidak pas",
    text: "Ukuran sulit ditebak saat belanja online.",
  },
  {
    icon: Scissors,
    title: "Bingung bahan jatuhnya seperti apa",
    text: "Hanya lihat foto, tidak tahu tekstur dan karakter kain.",
  },
  {
    icon: Shirt,
    title: "Sulit membayangkan hasil akhir",
    text: "Tidak bisa lihat tampilan dari berbagai sisi.",
  },
  {
    icon: MessageCircle,
    title: "Custom order rawan miskomunikasi",
    text: "Detail desain, ukuran, dan permintaan sering keliru.",
  },
];

const steps = [
  ["Pilih Model", "Pilih gamis, abaya, tunik, atau set favoritmu."],
  ["Tentukan Bahan & Warna", "Sesuaikan karakter bahan, warna, dan finishing."],
  ["Masukkan Ukuran", "Gunakan ukuran standar atau input ukuran tubuh sendiri."],
  ["Preview di Manekin 3D", "Lihat tampilan busana dari depan, samping, dan belakang."],
  ["Konfirmasi & Pesan", "Simpan desain, konsultasi, atau lanjut checkout pesananmu."],
];

const collections = [
  ["A-Line Daily Gamis", "Mulai Rp399.000", "Custom size available", "sage"],
  ["Elegant Abaya Set", "Mulai Rp599.000", "Custom size available", "navy"],
  ["Modern Tunik", "Mulai Rp329.000", "Custom size available", "blush"],
  ["Family Custom Set", "Mulai Rp899.000", "Custom size available", "sand"],
];

const fabrics = [
  ["Toyobo", "Halus, rapi, semi-formal", "ivory"],
  ["Ceruty", "Ringan, flowy, feminin", "rose"],
  ["Satin Silk", "Glossy, elegan, premium", "gold"],
  ["Linen", "Natural, adem, casual luxury", "linen"],
  ["Rayon", "Lembut, jatuh, nyaman harian", "rayon"],
];

const trusts = [
  ["Konsultasi Ukuran Sebelum Produksi", CircleUserRound],
  ["Estimasi Produksi Jelas & Transparan", PackageCheck],
  ["Detail Pesanan Tersimpan Otomatis", Bookmark],
  ["Quality Control Sebelum Dikirim", Sparkles],
  ["Custom untuk Individu & Keluarga", ShoppingBag],
];

const testimonials = [
  ["Alya Putri", "Biasanya saya bingung pilih ukuran online. Dengan preview 3D dan konsultasi, hasilnya lebih yakin sebelum pesan."],
  ["Nisa Rahma", "Pilihan bahannya lengkap dan jelas. Warna bisa dicoba dulu, hasil akhirnya sesuai ekspektasi."],
  ["Fatimah Zahra", "Pesan untuk keluarga jadi lebih mudah. Semua bisa custom ukuran dan warnanya juga cantik."],
];

type ColorKey = "sage" | "ivory" | "blush" | "navy" | "black";

function App() {
  const [color, setColor] = useState<ColorKey>("sage");
  const [model, setModel] = useState("Gamis A-Line");
  const [fabric, setFabric] = useState("Toyobo");
  const [size, setSize] = useState("Custom");

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-silk text-charcoal">
      <Header />
      <main>
        <section id="home" className="relative border-b border-champagne/10">
          <SilkBackground />
          <div className="container relative grid min-h-[620px] items-center gap-12 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pt-0">
            <div data-reveal className="max-w-[520px]">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-champagne">3D Custom Fashion Studio</p>
              <h1 className="font-display text-[3.4rem] leading-[0.98] tracking-[-0.055em] text-charcoal md:text-[4.55rem]">
                Custom Modest Fashion, Now in 3D.
              </h1>
              <p className="mt-7 max-w-[430px] text-lg leading-8 text-mink">
                Pilih bahan, warna, dan ukuran sesuai tubuhmu. Lihat hasilnya langsung di manekin 3D sebelum pesanan dibuat.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Button size="lg">Mulai Custom Desain <Sparkles className="h-4 w-4" /></Button>
                <Button size="lg" variant="outline">Lihat Koleksi</Button>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <div className="flex -space-x-3">
                  {["A", "N", "S", "F", "L"].map((item) => (
                    <span key={item} className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-sand to-blush text-xs font-bold text-mink shadow-soft">
                      {item}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">Dipercaya oleh 2.500+ pelanggan</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="flex text-champagne">
                      {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
                    </span>
                    <span className="font-semibold">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div data-reveal className="relative min-h-[560px]">
              <div className="absolute inset-x-8 top-8 h-[520px] rounded-t-[190px] border border-white/80 bg-gradient-to-br from-[#d8c8b6] to-[#f7efe6] shadow-luxe" />
              <Mannequin color="sage" className="absolute left-1/2 top-16 -translate-x-1/2 scale-[1.04]" />
              <HeroFloat className="right-8 top-24" icon={<Scissors />} title="Pilih Bahan" text="Berkualitas" />
              <HeroFloat className="right-6 top-48" icon={<Ruler />} title="Custom Ukuran" text="Sesuai Tubuhmu" />
              <HeroFloat className="right-10 top-72" icon={<WandSparkles />} title="Preview 3D" text="360 derajat" />
              <HeroFloat className="right-14 top-96" icon={<MessageCircle />} title="Order Mudah" text="via WhatsApp" />
              <Card className="absolute bottom-12 left-1/2 flex w-[290px] -translate-x-1/2 items-center justify-between rounded-2xl px-5 py-3">
                <ChevronRight className="h-5 w-5 rotate-180 text-champagne" />
                {["sage", "ivory", "blush", "sand"].map((item) => (
                  <span key={item} className={cn("h-11 w-9 rounded-t-full border border-champagne/20", garmentColor(item))} />
                ))}
                <ChevronRight className="h-5 w-5 text-champagne" />
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-10 md:py-16">
          <SectionTitle centered title="Belanja busana online sering bikin ragu?" />
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
            Di LUCE, kamu tidak hanya memilih produk. Kamu merancang busana yang paling pas untukmu.
          </p>
          <Sparkles className="mx-auto mt-4 h-5 w-5 fill-champagne text-champagne" />
        </section>

        <section id="custom-studio" className="container py-7">
          <div data-reveal className="grid gap-6 rounded-[28px] bg-gradient-to-br from-white/75 to-[#dfd0bf]/65 p-4 shadow-luxe lg:grid-cols-[340px_1fr]">
            <Card className="rounded-[24px] bg-white/70 p-5 shadow-none">
              <h2 className="font-display text-[2rem] leading-tight tracking-[-0.04em]">Rancang busanamu dalam beberapa klik</h2>
              <CustomizerGroup title="1. Model" options={["Gamis A-Line", "Abaya", "Tunik", "Family Set"]} value={model} onChange={setModel} thumbnail />
              <CustomizerGroup title="2. Bahan" options={["Toyobo", "Ceruty", "Satin Silk", "Linen", "Rayon"]} value={fabric} onChange={setFabric} swatches />
              <div className="mt-5">
                <p className="mb-3 text-sm font-bold">3. Warna</p>
                <div className="flex gap-3">
                  {(["sage", "ivory", "blush", "navy", "black"] as ColorKey[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setColor(item)}
                      className={cn("h-10 w-10 rounded-full border-2 border-white shadow-soft ring-offset-2 transition hover:scale-105", swatchColor(item), color === item && "ring-2 ring-champagne")}
                      aria-label={item}
                    />
                  ))}
                </div>
              </div>
              <CustomizerGroup title="4. Ukuran" options={["S", "M", "L", "XL", "Custom"]} value={size} onChange={setSize} compact />
              <div className="mt-6 grid grid-cols-[1fr_100px] gap-3">
                <Button size="sm">Simpan Desain <Bookmark className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline">Reset</Button>
              </div>
            </Card>
            <div className="relative min-h-[520px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#cdbcaa] via-[#ede3d7] to-white">
              <div className="absolute left-7 top-7 z-10 grid gap-3">
                {["Depan", "Samping", "Belakang"].map((view, index) => (
                  <button key={view} className={cn("rounded-xl border bg-white/80 px-5 py-3 text-sm font-semibold shadow-soft", index === 0 ? "border-champagne text-champagne" : "border-white/70 text-mink")}>{view}</button>
                ))}
                <button className="rounded-xl bg-white/90 px-5 py-3 text-sm font-bold text-champagne shadow-soft">360°</button>
              </div>
              <div className="absolute right-7 top-7 z-10 flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm shadow-soft">
                <span>Zoom</span><Minus className="h-4 w-4" /><Plus className="h-4 w-4" />
              </div>
              <div className="absolute right-12 top-28 h-56 w-28 rounded-t-full bg-white/25" />
              <div className="absolute bottom-12 right-16 h-32 w-20 rounded-b-full border-l border-[#96a079]/40">
                <span className="absolute left-4 top-6 h-12 w-5 -rotate-12 rounded-full bg-[#8a9875]" />
                <span className="absolute left-10 top-16 h-14 w-5 rotate-12 rounded-full bg-[#aab592]" />
              </div>
              <div className="absolute bottom-12 left-1/2 h-20 w-[380px] -translate-x-1/2 rounded-[50%] bg-white/55 blur-sm" />
              <Mannequin color={color} className="absolute left-1/2 top-14 -translate-x-1/2 scale-[1.08]" detailed />
              <Button variant="ghost" size="sm" className="absolute bottom-6 right-6 h-11 w-11 px-0">⌖</Button>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <SectionTitle centered title="Cara pesan busana custom di LUCE" />
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map(([title, text], index) => (
              <div key={title} data-reveal className="relative text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-champagne/20 bg-white/75 text-champagne shadow-soft">
                  {index === 0 && <Shirt className="h-8 w-8" />}
                  {index === 1 && <Scissors className="h-8 w-8" />}
                  {index === 2 && <Ruler className="h-8 w-8" />}
                  {index === 3 && <WandSparkles className="h-8 w-8" />}
                  {index === 4 && <ShoppingBag className="h-8 w-8" />}
                </div>
                <h3 className="mt-4 font-bold">{index + 1} {title}</h3>
                <p className="mx-auto mt-2 max-w-[150px] text-sm text-mink">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="koleksi" className="container py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 data-reveal className="font-display text-4xl tracking-[-0.04em]">Koleksi unggulan LUCE</h2>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">Lihat Semua Koleksi <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {collections.map(([title, price, meta, tone]) => (
              <Card key={title} data-reveal className="overflow-hidden rounded-2xl bg-white">
                <div className={cn("relative h-[250px] overflow-hidden", productBg(tone))}>
                  <Mannequin color={tone === "navy" ? "navy" : tone === "blush" ? "blush" : "sage"} className="absolute left-1/2 top-8 -translate-x-1/2 scale-[0.58]" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-charcoal">{price}</p>
                  <p className="mt-1 text-xs text-champagne">{meta} <Sparkles className="inline h-3 w-3" /></p>
                  <Button size="sm" className="mt-3 w-full rounded-md">Customize</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="bahan" className="container py-10">
          <h2 data-reveal className="mb-5 font-display text-4xl tracking-[-0.04em]">Pilih bahan sesuai karakter gayamu</h2>
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

        <section id="size-guide" className="container grid gap-6 py-5 lg:grid-cols-[0.8fr_1.25fr_0.75fr]">
          <div data-reveal>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em]">Ukuranmu, desainmu, gayamu.</h2>
            <p className="mt-3 text-mink">Gunakan ukuran standar atau masukkan ukuran tubuh sendiri. Sistem LUCE akan membantu menyesuaikan setiap detail busana untukmu.</p>
            <Button className="mt-6">Coba Custom Size</Button>
          </div>
          <Card data-reveal className="grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
            {["Tinggi Badan", "Lingkar Dada", "Lingkar Pinggang", "Lingkar Pinggul", "Panjang Baju", "Panjang Lengan"].map((field) => (
              <label key={field} className="relative">
                <span className="sr-only">{field}</span>
                <input className="h-11 w-full rounded-lg border border-champagne/20 bg-white/75 px-4 text-sm outline-none transition focus:border-champagne" placeholder={field} />
                <span className="absolute right-3 top-3 text-xs text-mink">cm</span>
              </label>
            ))}
          </Card>
          <Card data-reveal className="relative overflow-hidden rounded-2xl bg-[#f7f0e8] p-6">
            <h3 className="font-bold">Panduan Mengukur</h3>
            <p className="mt-3 text-sm text-mink">Lihat cara mengukur badan dengan benar.</p>
            <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-champagne" href="#kontak">Lihat Panduan <ArrowRight className="h-4 w-4" /></a>
            <Ruler className="absolute bottom-4 right-4 h-24 w-24 text-champagne/30" />
          </Card>
        </section>

        <section className="container py-12">
          <SectionTitle centered title="Dibuat dengan detail, bukan asal jahit." />
          <div className="mt-7 grid gap-4 md:grid-cols-5">
            {trusts.map(([title, Icon]) => (
              <div key={title as string} data-reveal className="flex items-center gap-3 rounded-2xl bg-white/65 p-4 shadow-soft">
                <IconBadge icon={Icon as typeof Shirt} />
                <p className="text-sm font-bold leading-snug">{title as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-4">
          <SectionTitle centered title="Mereka suka karena bisa lihat dulu hasilnya" />
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {testimonials.map(([name, quote], index) => (
              <Card key={name} data-reveal className="rounded-2xl p-7">
                <p className="text-sm leading-7 text-mink">"{quote}"</p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sand to-blush text-sm font-bold">{name[0]}</span>
                    <strong>{name}</strong>
                  </div>
                  <Rating count={5 - (index === 1 ? 0 : 0)} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="kontak" className="container py-16">
          <div data-reveal className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#d7c2aa] via-[#f5eadf] to-white p-10 shadow-luxe md:p-16">
            <SilkBackground subtle />
            <div className="relative max-w-2xl">
              <Badge>LUCE Custom Studio</Badge>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] md:text-6xl">Siap merancang busana modest impianmu?</h2>
              <p className="mt-5 text-lg text-mink">Mulai dari model, bahan, warna, hingga ukuran. Semua dibuat lebih jelas dengan preview studio sebelum order.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg">Mulai Custom Sekarang <Sparkles className="h-4 w-4" /></Button>
                <Button size="lg" variant="outline">Chat WhatsApp</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-champagne/10 bg-ivory/70 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between gap-6">
        <a href="#home" className="leading-none">
          <span className="font-display text-4xl tracking-[0.12em]">LUCE</span>
          <span className="-mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.45em] text-mink">Custom Studio</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-charcoal/80 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-champagne">
              {item}
            </a>
          ))}
        </nav>
        <Button variant="gold" size="sm">Mulai Custom <Sparkles className="h-3.5 w-3.5" /></Button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-champagne/10 bg-white/40 py-12">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <span className="font-display text-4xl tracking-[0.12em]">LUCE</span>
          <p className="mt-4 max-w-sm text-mink">Premium modest fashion technology brand untuk custom busana yang lebih personal, jelas, dan elegan.</p>
        </div>
        <FooterLinks title="Menu" items={["Koleksi", "Custom Studio", "Bahan", "Size Guide"]} />
        <FooterLinks title="Social" items={["Instagram", "TikTok", "Pinterest"]} />
        <FooterLinks title="WhatsApp" items={["+62 812 0000 0000", "Senin-Sabtu", "09.00-17.00"]} />
      </div>
    </footer>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <div className="mt-4 grid gap-2 text-sm text-mink">
        {items.map((item) => <a key={item} href="#kontak" className="hover:text-champagne">{item}</a>)}
      </div>
    </div>
  );
}

function HeroFloat({ className, icon, title, text }: { className: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className={cn("absolute z-10 grid w-[190px] grid-cols-[42px_1fr] items-center gap-3 rounded-2xl bg-white/88 p-4", className)}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f5eadf] text-champagne [&_svg]:h-6 [&_svg]:w-6">{icon}</span>
      <span>
        <strong className="block text-sm">{title}</strong>
        <small className="text-xs font-semibold text-mink">{text}</small>
      </span>
    </Card>
  );
}

function SectionTitle({ title, centered }: { title: string; centered?: boolean }) {
  return (
    <h2 data-reveal className={cn("font-display text-4xl tracking-[-0.045em] md:text-[2.55rem]", centered && "text-center")}>
      {title}
    </h2>
  );
}

function IconBadge({ icon: Icon }: { icon: typeof Shirt }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-champagne/20 bg-[#f7efe5] text-champagne">
      <Icon className="h-6 w-6" />
    </span>
  );
}

function CustomizerGroup({
  title,
  options,
  value,
  onChange,
  thumbnail,
  swatches,
  compact,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  thumbnail?: boolean;
  swatches?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-bold">{title}</p>
      <div className={cn("flex flex-wrap gap-3 rounded-2xl bg-white/75 p-3", thumbnail && "grid grid-cols-4", compact && "grid grid-cols-5")}>
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-semibold text-mink transition hover:border-champagne",
              value === option && "border-champagne text-champagne shadow-soft",
              thumbnail && "grid h-16 place-items-center px-1 py-1",
              compact && "h-9 px-0 text-xs",
              swatches && "h-9 w-9 rounded-full p-0 text-transparent",
              swatches && swatchClass(index),
            )}
          >
            {thumbnail ? <span className={cn("h-12 w-8 rounded-t-full", garmentColor(index === 0 ? "ivory" : index === 1 ? "sand" : index === 2 ? "sage" : "blush"))} /> : option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Rating({ count }: { count: number }) {
  return (
    <span className="flex gap-1 text-champagne">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={cn("h-2 w-2 rounded-full", index < count ? "bg-champagne" : "bg-champagne/20")} />
      ))}
    </span>
  );
}

function Mannequin({ color, className, detailed }: { color: string; className?: string; detailed?: boolean }) {
  return (
    <div className={cn("mannequin-wrap", className)}>
      <div className="mannequin-head" />
      <div className="mannequin-neck" />
      <div className={cn("mannequin-sleeve mannequin-sleeve-left", mannequinTone(color))} />
      <div className={cn("mannequin-sleeve mannequin-sleeve-right", mannequinTone(color))} />
      <div className={cn("mannequin-dress", mannequinTone(color), detailed && "is-detailed")} />
      <div className="mannequin-lines" />
      <div className="mannequin-hand mannequin-hand-left" />
      <div className="mannequin-hand mannequin-hand-right" />
      <div className="mannequin-base" />
    </div>
  );
}

function SilkBackground({ subtle }: { subtle?: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", subtle && "opacity-50")}>
      <span className="absolute -right-20 top-0 h-[360px] w-[760px] rotate-[-12deg] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.82),rgba(234,218,200,0.42),transparent_68%)] blur-sm" />
      <span className="absolute right-0 top-40 h-[180px] w-[800px] rotate-[-18deg] rounded-[50%] border-t border-white/80 bg-white/20" />
    </div>
  );
}

function swatchClass(index: number) {
  return ["bg-sage", "bg-[#d7c6ad]", "bg-[#efece5]", "bg-blush", "bg-charcoal"][index] ?? "bg-sand";
}

function swatchColor(color: ColorKey) {
  return {
    sage: "bg-sage",
    ivory: "bg-[#eee9df]",
    blush: "bg-blush",
    navy: "bg-[#1d2539]",
    black: "bg-charcoal",
  }[color];
}

function garmentColor(color: string) {
  return {
    sage: "bg-gradient-to-br from-sage to-[#98a086]",
    ivory: "bg-gradient-to-br from-[#f1ece2] to-[#d5c8b5]",
    blush: "bg-gradient-to-br from-blush to-[#c99891]",
    sand: "bg-gradient-to-br from-sand to-[#cdb58d]",
    navy: "bg-gradient-to-br from-[#1d2539] to-[#090d18]",
  }[color] ?? "bg-sand";
}

function mannequinTone(color: string) {
  return {
    sage: "mannequin-sage",
    ivory: "mannequin-ivory",
    blush: "mannequin-blush",
    navy: "mannequin-navy",
    black: "mannequin-black",
    sand: "mannequin-sand",
  }[color] ?? "mannequin-sage";
}

function productBg(tone: string) {
  return {
    sage: "bg-gradient-to-br from-[#e9e8de] to-[#c4c9b4]",
    navy: "bg-gradient-to-br from-[#ece4da] to-[#7b817f]",
    blush: "bg-gradient-to-br from-[#f2dfd9] to-[#e7c5c0]",
    sand: "bg-gradient-to-br from-[#e9d9c6] to-[#c2a58b]",
  }[tone] ?? "bg-sand";
}

function fabricBg(tone: string) {
  return {
    ivory: "bg-[radial-gradient(circle_at_20%_30%,#fff,transparent_26%),linear-gradient(135deg,#f1eee6,#d8c9b5)]",
    rose: "bg-[radial-gradient(circle_at_15%_30%,#fff,transparent_24%),linear-gradient(135deg,#e8c7c2,#c99c97)]",
    gold: "bg-[radial-gradient(circle_at_40%_20%,#fff,transparent_22%),linear-gradient(135deg,#f3e2bf,#c89b52)]",
    linen: "bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.2)_0_3px,transparent_3px_9px),linear-gradient(135deg,#d9d1c1,#b9ab95)]",
    rayon: "bg-[radial-gradient(circle_at_20%_30%,#cab4a6,transparent_24%),linear-gradient(135deg,#7b6358,#d0b5a8)]",
  }[tone] ?? "bg-sand";
}

export default App;
