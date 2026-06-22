import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { designRequests } from "@/data/admin-requests";
import { formatPrice } from "@/lib/format";

// Untuk MVP, gunakan data contoh sebagai "desain saya"
const myDesigns = designRequests.slice(0, 3);

export function MyDesigns() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Akun"
        title="Desain saya"
        description="Pantau desain custom yang telah Anda buat beserta status dan preview-nya."
      >
        <Link to="/customize">
          <Button variant="gold">Buat desain baru</Button>
        </Link>
      </PageHero>

      <section className="container py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {myDesigns.map((design) => (
            <div
              key={design.id}
              className="rounded-luxe border border-champagne/15 bg-white/70 p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-mink">{design.id}</span>
                <StatusBadge status={design.status} />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-charcoal">
                {design.aiRecommendation.designName}
              </h3>
              <p className="mt-1 text-sm text-mink">
                {design.category} · {design.fabric} · {design.color}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-mink">Video</span>
                <StatusBadge status={design.videoStatus} type="video" />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-mink">Estimasi</span>
                <span className="font-semibold text-champagne">
                  {formatPrice(design.estimatedPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
