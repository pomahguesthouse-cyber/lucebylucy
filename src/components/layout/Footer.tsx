import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Jelajahi",
    links: [
      { label: "Koleksi", to: "/collections" },
      { label: "Mulai desain", to: "/customize" },
      { label: "AI Stylist", to: "/ai-stylist" },
      { label: "Panduan ukuran", to: "/size-guide" },
    ],
  },
  {
    title: "Akun",
    links: [
      { label: "Desain saya", to: "/my-designs" },
      { label: "Pesanan saya", to: "/my-orders" },
      { label: "Profil ukuran", to: "/measurements" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang LUSE", to: "/about" },
      { label: "Kontak", to: "/contact" },
      { label: "Admin", to: "/admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-champagne/15 bg-porcelain">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <img src="/luse-logo.png" alt="LUSE by Lucy" className="h-20 w-auto max-w-[260px] object-contain object-left" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mink">
            Butik fashion digital dengan asisten AI pribadi. Desain busana modest custom,
            lihat preview, lalu pesan dengan tenang.
          </p>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-mink transition-colors hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-champagne/15">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-mink sm:flex-row">
          <p>© {new Date().getFullYear()} LUSE by Lucy. Hak cipta dilindungi.</p>
          <p>Dibuat dengan ketelitian untuk modest fashion.</p>
        </div>
      </div>
    </footer>
  );
}
