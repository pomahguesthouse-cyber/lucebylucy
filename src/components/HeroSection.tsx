import {
  ChevronRight,
  MessageCircle,
  Ruler,
  Scissors,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mannequin } from "@/components/Mannequin";
import { SilkBackground } from "@/components/SilkBackground";
import { cn } from "@/lib/utils";
import { garmentColor } from "@/lib/helpers";

function HeroFloat({
  className,
  icon,
  title,
  text,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className={cn("absolute z-10 grid w-[190px] grid-cols-[42px_1fr] items-center gap-3 rounded-2xl bg-white/88 p-4", className)}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f5eadf] text-champagne [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </span>
      <span>
        <strong className="block text-sm">{title}</strong>
        <small className="text-xs font-semibold text-mink">{text}</small>
      </span>
    </Card>
  );
}

export function HeroSection() {
  return (
    <section id="home" className="relative border-b border-champagne/10">
      <SilkBackground />
      <div className="container relative grid min-h-[620px] items-center gap-12 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pt-0">
        <div data-reveal className="max-w-[520px]">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-champagne">
            3D Custom Fashion Studio
          </p>
          <h1 className="font-display text-[3.4rem] leading-[0.98] tracking-[-0.055em] text-charcoal md:text-[4.55rem]">
            Custom Modest Fashion, Now in 3D.
          </h1>
          <p className="mt-7 max-w-[430px] text-lg leading-8 text-mink">
            Pilih bahan, warna, dan ukuran sesuai tubuhmu. Lihat hasilnya langsung di manekin 3D sebelum pesanan dibuat.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById("custom-studio");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Mulai Custom Desain <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.getElementById("koleksi");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Lihat Koleksi
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3">
              {["A", "N", "S", "F", "L"].map((item) => (
                <span
                  key={item}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-sand to-blush text-xs font-bold text-mink shadow-soft"
                >
                  {item}
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold">Dipercaya oleh 2.500+ pelanggan</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="flex text-champagne">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
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
  );
}
