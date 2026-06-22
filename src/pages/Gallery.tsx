// Halaman galeri media publik
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { MediaGallery } from "@/components/landing/MediaGallery";

export function Gallery() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Galeri"
        title="Galeri busana custom LUCE"
        description="Kumpulan foto dan video model mengenakan busana custom hasil desain di LUCE Custom Studio."
      />
      <MediaGallery />
    </SiteLayout>
  );
}
