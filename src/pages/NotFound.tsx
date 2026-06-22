import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <SiteLayout>
      <div className="container flex flex-col items-center justify-center py-28 text-center">
        <span className="font-display text-6xl font-semibold text-champagne">404</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 max-w-md text-mink">
          Maaf, halaman yang Anda cari tidak tersedia. Mari kembali dan lanjutkan mendesain.
        </p>
        <Link to="/" className="mt-6">
          <Button variant="gold">Kembali ke beranda</Button>
        </Link>
      </div>
    </SiteLayout>
  );
}
