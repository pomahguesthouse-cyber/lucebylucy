import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { VideoPreviewPanel } from "@/components/video-preview/VideoPreviewPanel";
import { DesignSummaryCard } from "@/components/customizer/DesignSummaryCard";
import { useCustomizerStore } from "@/store/customizer-store";
import { buildVideoPrompt } from "@/lib/video-prompt";
import { getCategoryName } from "@/lib/customizer-selectors";

export function VideoPreview() {
  const store = useCustomizerStore();
  const hasDesign = store.selectedModel !== null && store.selectedFabric !== null;

  const videoPrompt = buildVideoPrompt({
    categoryName: getCategoryName(store.selectedCategory),
    fabric: store.selectedFabric,
    color: store.selectedColor,
    designDetails: store.designDetails,
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Video preview"
        title="Preview outfit custom Anda"
        description="Lihat gambaran video model mengenakan outfit Anda di studio premium. Preview adalah panduan visual; hasil akhir tetap melalui review tim."
      />
      <section className="container py-12">
        {hasDesign ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-5">
              <VideoPreviewPanel canGenerate />
              <details className="rounded-2xl border border-champagne/15 bg-ivory/60 p-4">
                <summary className="cursor-pointer text-sm font-medium text-charcoal">
                  Lihat prompt video preview
                </summary>
                <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-mink">
                  {videoPrompt}
                </pre>
              </details>
            </div>
            <DesignSummaryCard />
          </div>
        ) : (
          <div className="rounded-luxe border border-champagne/15 bg-white/60 p-12 text-center">
            <p className="text-mink">
              Belum ada desain yang dipilih. Mulai desain dulu untuk membuat video preview.
            </p>
            <Link to="/customize" className="mt-5 inline-block">
              <Button variant="gold">Mulai desain</Button>
            </Link>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
