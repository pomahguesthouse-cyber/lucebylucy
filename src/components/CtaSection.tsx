import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SilkBackground } from "@/components/SilkBackground";
import { WHATSAPP_URL } from "@/data/content";

export function CtaSection() {
  return (
    <section id="kontak" className="container py-16">
      <div data-reveal className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#d7c2aa] via-[#f5eadf] to-white p-10 shadow-luxe md:p-16">
        <SilkBackground subtle />
        <div className="relative max-w-2xl">
          <Badge>Luse by lucy</Badge>
          <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] md:text-6xl">
            Siap merancang busana modest impianmu?
          </h2>
          <p className="mt-5 text-lg text-mink">
            Mulai dari model, bahan, warna, hingga ukuran. Semua dibuat lebih jelas dengan preview studio sebelum order.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById("custom-studio");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Mulai Custom Sekarang <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
            >
              Chat WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
