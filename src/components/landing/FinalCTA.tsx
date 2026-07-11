import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-luxe bg-charcoal px-8 py-14 text-center shadow-luxe sm:px-12">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-blush/20 blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-porcelain sm:text-4xl">
                Mulai rancang busana modest impian Anda hari ini
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-porcelain/70">
                Desain custom, lihat preview, lalu konsultasikan dengan stylist Luse by lucy.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/customize">
                  <Button variant="gold" size="lg">
                    Start your custom design
                  </Button>
                </Link>
                <Link to="/ai-stylist">
                  <Button variant="outline" size="lg" className="border-porcelain/30 bg-white/10 text-porcelain hover:bg-white/20">
                    <MessageCircle className="h-4 w-4" />
                    Chat with Luse by lucy stylist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
