import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Contact() {
  const waLink = buildWhatsAppLink(
    "Halo Luse by lucy, saya ingin bertanya tentang layanan custom design.",
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi Luse by lucy"
        description="Punya pertanyaan tentang desain, bahan, atau pesanan? Tim kami siap membantu."
      />
      <section className="container grid gap-8 py-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-champagne/15 bg-white/70 p-5 shadow-soft">
            <MessageCircle className="h-5 w-5 text-champagne" />
            <div>
              <h3 className="text-sm font-semibold text-charcoal">WhatsApp</h3>
              <p className="text-sm text-mink">+{ADMIN_WHATSAPP}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-champagne/15 bg-white/70 p-5 shadow-soft">
            <Mail className="h-5 w-5 text-champagne" />
            <div>
              <h3 className="text-sm font-semibold text-charcoal">Email</h3>
              <p className="text-sm text-mink">hello@lusebylucy.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-champagne/15 bg-white/70 p-5 shadow-soft">
            <MapPin className="h-5 w-5 text-champagne" />
            <div>
              <h3 className="text-sm font-semibold text-charcoal">Studio</h3>
              <p className="text-sm text-mink">Indonesia · Layanan online & custom order</p>
            </div>
          </div>
        </div>

        <div className="rounded-luxe border border-champagne/15 bg-white/70 p-7 shadow-soft">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Konsultasi via WhatsApp
          </h2>
          <p className="mt-3 text-sm text-mink">
            Cara tercepat untuk berkonsultasi dan memesan adalah melalui WhatsApp. Tim kami akan
            membantu Anda dari pemilihan desain hingga konfirmasi produksi.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
            <Button variant="gold">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
