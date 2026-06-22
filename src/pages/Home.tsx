import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoPreviewShowcase } from "@/components/landing/VideoPreviewShowcase";
import { FeaturedCollection } from "@/components/landing/FeaturedCollection";
import { FabricLibrary } from "@/components/landing/FabricLibrary";
import { SizeGuidePreview } from "@/components/landing/SizeGuidePreview";
import { TrustSection } from "@/components/landing/TrustSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";

export function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <HowItWorks />
      <VideoPreviewShowcase />
      <FeaturedCollection />
      <FabricLibrary />
      <SizeGuidePreview />
      <TrustSection />
      <Testimonials />
      <FinalCTA />
    </SiteLayout>
  );
}
