import { Button } from "@/components/ui/button";

function FooterLinks({ title, items }: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <div className="mt-4 grid gap-2 text-sm text-mink">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href ?? "#kontak"}
            target={item.href?.startsWith("http") ? "_blank" : undefined}
            rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="transition hover:text-champagne"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-champagne/10 bg-white/40">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <span className="font-display text-4xl tracking-[0.12em]">LUCE</span>
          <p className="mt-4 max-w-sm text-mink">
            Premium modest fashion technology brand untuk custom busana yang lebih personal, jelas, dan elegan.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Kembali ke atas ↑
          </Button>
        </div>
        <FooterLinks
          title="Menu"
          items={[
            { label: "Koleksi", href: "#koleksi" },
            { label: "Custom Studio", href: "#custom-studio" },
            { label: "Bahan", href: "#bahan" },
            { label: "Size Guide", href: "#size-guide" },
          ]}
        />
        <FooterLinks
          title="Social"
          items={[
            { label: "Instagram" },
            { label: "TikTok" },
            { label: "Pinterest" },
          ]}
        />
        <FooterLinks
          title="WhatsApp"
          items={[
            { label: "+62 812 0000 0000", href: "https://wa.me/6281200000000" },
            { label: "Senin–Sabtu" },
            { label: "09.00–17.00" },
          ]}
        />
      </div>
      <div className="border-t border-champagne/10 py-5">
        <p className="container text-center text-xs text-mink">
          © {currentYear} LUCE Custom Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
