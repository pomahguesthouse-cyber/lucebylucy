import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  PlaySquare,
  Scissors,
  Settings,
  ShoppingBag,
  Shirt,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const adminNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Media library", to: "/admin/media", icon: ImageIcon },
  { label: "Video hero", to: "/admin/video-hero", icon: PlaySquare },
  { label: "Design requests", to: "/admin/design-requests", icon: ClipboardList },
  { label: "Kategori koleksi", to: "/admin/categories", icon: Tags },
  { label: "Products", to: "/admin/products", icon: Shirt },
  { label: "Fabrics", to: "/admin/fabrics", icon: Package },
  { label: "Colors", to: "/admin/colors", icon: Palette },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Production notes", to: "/admin/production-notes", icon: Scissors },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-silk text-charcoal">
      <div className="flex w-full flex-col lg:flex-row">
        <aside className="flex flex-col border-b border-champagne/15 bg-porcelain lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between p-5">
            <Link to="/" className="font-display text-xl font-semibold text-charcoal">
              Luse by lucy <span className="text-xs text-mink">Admin</span>
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-5">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-mink transition hover:bg-white/70 hover:text-charcoal",
                    isActive && "bg-white/80 text-charcoal shadow-soft",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleSignOut}
            className="mx-3 mb-5 mt-auto hidden items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-mink transition hover:bg-white/70 hover:text-charcoal lg:flex"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          <header className="mb-6">
            <h1 className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
              {title}
            </h1>
            {description && <p className="mt-1 text-sm text-mink">{description}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
