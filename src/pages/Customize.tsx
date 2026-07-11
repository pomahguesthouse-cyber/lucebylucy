import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/customizer/StepIndicator";
import { CategorySelector } from "@/components/customizer/CategorySelector";
import { ProductModelSelector } from "@/components/customizer/ProductModelSelector";
import { FabricSelector } from "@/components/customizer/FabricSelector";
import { ColorSwatchSelector } from "@/components/customizer/ColorSwatchSelector";
import { DesignDetailForm } from "@/components/customizer/DesignDetailForm";
import { SizeSelector } from "@/components/customizer/SizeSelector";
import { AIRecommendationCard } from "@/components/customizer/AIRecommendationCard";
import { HermesDesignerCard } from "@/components/customizer/HermesDesignerCard";
import { DesignSummaryCard } from "@/components/customizer/DesignSummaryCard";
import { WhatsAppOrderButton } from "@/components/customizer/WhatsAppOrderButton";
import { VideoPreviewPanel } from "@/components/video-preview/VideoPreviewPanel";
import { useCustomizerStore } from "@/store/customizer-store";
import { buildAIRecommendation } from "@/lib/ai-recommendation";
import { buildVideoPrompt } from "@/lib/video-prompt";
import { getCategoryName } from "@/lib/customizer-selectors";
import { askLuseDesigner } from "@/lib/luse-agent-api";

const steps = [
  "Kategori",
  "Model",
  "Bahan",
  "Warna",
  "Detail",
  "Ukuran",
  "Rekomendasi AI",
  "Video preview",
  "Submit",
];

const stepTitles = [
  "Pilih kategori busana",
  "Pilih model dasar",
  "Pilih bahan",
  "Pilih warna",
  "Sesuaikan detail desain",
  "Tambahkan ukuran",
  "Rekomendasi AI Stylist",
  "Video preview",
  "Kirim desain",
];

export function Customize() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [designerAnswer, setDesignerAnswer] = useState("");
  const [designerError, setDesignerError] = useState("");
  const [designerLoading, setDesignerLoading] = useState(false);
  const designerRequest = useRef<AbortController | null>(null);
  const store = useCustomizerStore();

  const categoryName = getCategoryName(store.selectedCategory);

  const requestDesignerRecommendation = async () => {
    designerRequest.current?.abort();
    const controller = new AbortController();
    designerRequest.current = controller;
    setDesignerLoading(true);
    setDesignerError("");
    setDesignerAnswer("");

    const prompt = [
      "Buat rekomendasi desain modest fashion berdasarkan pilihan berikut.",
      `Kategori: ${categoryName || "-"}`,
      `Model: ${store.selectedModel?.name || "-"}`,
      `Bahan: ${store.selectedFabric?.name || "-"}`,
      `Warna: ${store.selectedColor?.name || "-"}`,
      `Cutting: ${store.designDetails.cutting || "-"}`,
      `Model lengan: ${store.designDetails.sleeveModel || "-"}`,
      `Panjang busana: ${store.designDetails.outfitLength || "-"}`,
      `Aksen: ${store.designDetails.accents.join(", ") || "-"}`,
      `Ukuran: ${store.sizeType === "standard" ? store.selectedSize : "custom measurement"}`,
      "Berikan nama konsep, evaluasi kombinasi, saran detail, kecocokan acara, dan catatan produksi.",
    ].join("\n");

    try {
      const result = await askLuseDesigner(prompt, controller.signal);
      setDesignerAnswer(result.answer);
    } catch (error) {
      if (controller.signal.aborted) return;

      const fallback = buildAIRecommendation({
        categoryName,
        model: store.selectedModel,
        fabric: store.selectedFabric,
        color: store.selectedColor,
        designDetails: store.designDetails,
      });
      store.setAIRecommendation(fallback);
      setDesignerError(
        error instanceof Error
          ? `${error.message} Menampilkan rekomendasi lokal.`
          : "Hermes tidak tersedia. Menampilkan rekomendasi lokal.",
      );
    } finally {
      if (designerRequest.current === controller) {
        designerRequest.current = null;
        setDesignerLoading(false);
      }
    }
  };

  useEffect(() => {
    if (step === 6) void requestDesignerRecommendation();

    if (step === 7 && store.videoPreviewState === "empty") {
      store.setVideoPreviewState("ready");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => () => designerRequest.current?.abort(), []);

  const videoPrompt = useMemo(
    () =>
      buildVideoPrompt({
        categoryName,
        fabric: store.selectedFabric,
        color: store.selectedColor,
        designDetails: store.designDetails,
      }),
    [categoryName, store.selectedFabric, store.selectedColor, store.designDetails],
  );

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return store.selectedCategory !== null;
      case 1:
        return store.selectedModel !== null;
      case 2:
        return store.selectedFabric !== null;
      case 3:
        return store.selectedColor !== null;
      case 4:
        return store.designDetails.cutting !== "";
      case 5:
        return store.sizeType === "standard" || store.measurements.height.trim() !== "";
      default:
        return true;
    }
  }, [step, store]);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Luse by lucy
          </h1>
          <p className="mt-2 text-mink">
            Rancang busana modest Anda langkah demi langkah, lalu lihat preview sebelum memesan.
          </p>
        </div>

        <StepIndicator steps={steps} current={step} onStepClick={setStep} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Konten langkah */}
          <div className="rounded-luxe border border-champagne/15 bg-white/60 p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-charcoal">
              {stepTitles[step]}
            </h2>

            <div className="mt-6">
              {step === 0 && <CategorySelector />}
              {step === 1 && <ProductModelSelector />}
              {step === 2 && <FabricSelector />}
              {step === 3 && <ColorSwatchSelector />}
              {step === 4 && <DesignDetailForm />}
              {step === 5 && (
                <div className="space-y-6">
                  <label className="block text-xs font-medium text-mink">
                    Nama Anda
                    <input
                      type="text"
                      value={store.customerName}
                      onChange={(e) => store.setCustomerName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="mt-1 w-full rounded-xl border border-champagne/25 bg-white/80 px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                    />
                  </label>
                  <SizeSelector />
                </div>
              )}
              {step === 6 && (
                <div className="space-y-4">
                  {(designerLoading || designerAnswer) && (
                    <HermesDesignerCard
                      answer={designerAnswer}
                      loading={designerLoading}
                      error=""
                      onRetry={() => void requestDesignerRecommendation()}
                    />
                  )}
                  {!designerLoading && !designerAnswer && store.aiRecommendation && (
                    <>
                      {designerError && (
                        <p className="rounded-2xl border border-amber-300/40 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
                          {designerError}
                        </p>
                      )}
                      <AIRecommendationCard recommendation={store.aiRecommendation} />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void requestDesignerRecommendation()}
                        >
                          Coba Hermes lagi
                        </Button>
                      </div>
                    </>
                  )}
                  {!designerLoading && !designerAnswer && !store.aiRecommendation && (
                    <HermesDesignerCard
                      answer=""
                      loading={false}
                      error={designerError}
                      onRetry={() => void requestDesignerRecommendation()}
                    />
                  )}
                </div>
              )}
              {step === 7 && (
                <div className="space-y-5">
                  <VideoPreviewPanel
                    canGenerate
                    onEditDesign={() => setStep(4)}
                  />
                  <details className="rounded-2xl border border-champagne/15 bg-ivory/60 p-4">
                    <summary className="cursor-pointer text-sm font-medium text-charcoal">
                      Lihat prompt video preview
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-mink">
                      {videoPrompt}
                    </pre>
                  </details>
                </div>
              )}
              {step === 8 && (
                <div className="space-y-5">
                  {submitted ? (
                    <div className="rounded-2xl border border-sage/40 bg-sage/10 p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/30">
                        <Check className="h-6 w-6 text-charcoal" />
                      </div>
                      <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
                        Desain berhasil dikirim
                      </h3>
                      <p className="mt-2 text-sm text-mink">
                        Tim Luse by lucy akan meninjau desain Anda. Lanjutkan ke WhatsApp untuk
                        konfirmasi bahan, harga final, dan estimasi produksi.
                      </p>
                      <div className="mt-5 flex justify-center">
                        <WhatsAppOrderButton />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-mink">
                        Periksa kembali ringkasan desain Anda, lalu kirim. Status awal desain
                        adalah <strong>submitted</strong> dan akan ditinjau admin.
                      </p>
                      <DesignSummaryCard />
                      <Button variant="gold" onClick={() => setSubmitted(true)} className="w-full">
                        Submit desain
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Navigasi langkah */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              {step < steps.length - 1 && (
                <Button variant="gold" onClick={goNext} disabled={!canProceed}>
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar ringkasan (sticky di desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DesignSummaryCard />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
