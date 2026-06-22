import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Koleksi", to: "/collections" },
  { label: "Galeri", to: "/gallery" },
  { label: "AI Stylist", to: "/ai-stylist" },
  { label: "Panduan ukuran", to: "/size-guide" },
  { label: "Tentang", to: "/about" },
  { label: "Kontak", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-champagne/15 bg-ivory/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-wide text-charcoal">
            LUCE
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-mink sm:inline">
            Custom Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-mink transition-colors hover:text-charcoal",
                  isActive && "text-charcoal",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/admin/login"
            className="text-sm font-medium text-mink transition-colors hover:text-charcoal"
          >
            Masuk
          </Link>
          <Link to="/customize">
            <Button variant="gold" size="sm">
              Mulai desain
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden"
          aria-label="Buka menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-champagne/15 bg-ivory/95 lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2 text-sm font-medium text-mink hover:bg-white/70 hover:text-charcoal",
                    isActive && "bg-white/70 text-charcoal",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/customize" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="gold" className="w-full">
                Mulai desain
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
