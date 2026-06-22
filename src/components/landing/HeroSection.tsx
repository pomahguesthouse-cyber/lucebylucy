import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPreviewFrame } from "@/components/video-preview/VideoPreviewFrame";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-champagne">
            <Sparkles className="h-3.5 w-3.5" />
            Modest fashion bertenaga AI
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Design your modest fashion with AI
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mink sm:text-lg">
            Pilih model, bahan, warna, dan ukuran. LUCE AI membantu Anda menciptakan outfit
            yang elegan dan menampilkan preview video realistis sebelum memesan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/customize">
              <Button variant="gold" size="lg">
                Start designing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" size="lg">
                Explore collection
              </Button>
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { value: "9", label: "Kategori busana" },
              { value: "10", label: "Pilihan bahan" },
              { value: "AI", label: "Style advisor" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-display text-3xl font-semibold text-charcoal">{item.value}</dt>
                <dd className="mt-1 text-xs text-mink">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-blush/40 blur-2xl" />
          <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-sage/40 blur-2xl" />
          <VideoPreviewFrame caption="Preview outfit custom Anda sebelum produksi" />
        </div>
      </div>
    </section>
  );
}
