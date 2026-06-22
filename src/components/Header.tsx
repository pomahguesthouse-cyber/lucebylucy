import { useState, useEffect, useCallback } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback((item: string) => {
    setMobileOpen(false);
    const id = item.toLowerCase().replaceAll(" ", "-");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-champagne/10 bg-ivory/70 backdrop-blur-xl transition-shadow duration-300",
          scrolled && "shadow-soft",
        )}
      >
        <div className="container flex h-[76px] items-center justify-between gap-6">
          <a href="#home" className="leading-none">
            <span className="font-display text-4xl tracking-[0.12em]">LUCE</span>
            <span className="-mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.45em] text-mink">
              Custom Studio
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-charcoal/80 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="transition hover:text-champagne"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                const el = document.getElementById("custom-studio");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Mulai Custom <Sparkles className="h-3.5 w-3.5" />
            </Button>

            {/* Mobile hamburger */}
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-champagne/20 bg-white/70 text-charcoal lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[101] flex h-full w-[300px] flex-col bg-ivory shadow-luxe transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-5">
          <span className="font-display text-2xl tracking-[0.12em]">LUCE</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-champagne/20 bg-white/70"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="rounded-xl px-4 py-3 text-left text-base font-semibold text-charcoal transition hover:bg-champagne/10 hover:text-champagne"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-champagne/10 p-6">
          <Button
            className="w-full"
            onClick={() => {
              setMobileOpen(false);
              const el = document.getElementById("custom-studio");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Mulai Custom <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
