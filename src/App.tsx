import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProblemsSection } from "@/components/ProblemsSection";
import { CustomStudioSection } from "@/components/CustomStudioSection";
import { StepsSection } from "@/components/StepsSection";
import { CollectionsSection } from "@/components/CollectionsSection";
import { FabricsSection } from "@/components/FabricsSection";
import { SizeGuideSection } from "@/components/SizeGuideSection";
import { TrustSection } from "@/components/TrustSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CtaSection } from "@/components/CtaSection";

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-silk text-charcoal">
      <Header />
      <main>
        <HeroSection />
        <ProblemsSection />
        <CustomStudioSection />
        <StepsSection />
        <CollectionsSection />
        <FabricsSection />
        <SizeGuideSection />
        <TrustSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
