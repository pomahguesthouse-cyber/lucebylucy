import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPreviewFrame } from "@/components/video-preview/VideoPreviewFrame";
import { fetchActiveHeroMedia, type HeroMedia } from "@/lib/hero-media-service";

const heroStats = [
  { value: "9+", label: "Kategori busana" },
  { value: "10+", label: "Pilihan bahan" },
  { value: "AI", label: "Style advisor" },
];

export function HeroSection() {
  const [heroMedia, setHeroMedia] = useState<HeroMedia | null>(null);

  useEffect(() => {
    let active = true;

    const loadHeroMedia = async () => {
      try {
        const data = await fetchActiveHeroMedia();
        if (active) setHeroMedia(data);
      } catch (error) {
        console.warn("[HeroSection] Failed to load hero media", error);
        if (active) setHeroMedia(null);
      }
    };

    void loadHeroMedia();

    return () => {
      active = false;
    };
  }, []);

  const isVideoPreview = heroMedia?.mediaType === "video";

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-silk" />
      <div className="absolute left-[-8rem] top-20 -z-10 h-72 w-72 rounded-full bg-blush/40 blur-3xl" />
      <div className="absolute right-[-7rem] top-12 -z-10 h-80 w-80 rounded-full bg-champagne/20 blur-3xl" />
      <div className="absolute bottom-[-9rem] left-1/3 -z-10 h-96 w-96 rounded-full bg-sage/30 blur-3xl" />

      <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-14 py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-champagne shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Busana Muslim Custom Berbasis AI
          </span>

          <h1 className="mt-7 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
            Rancang Gamis Impianmu dengan{" "}
            <span className="relative inline-block text-champagne">
              LUCE AI
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-champagne via-blush to-transparent" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mink sm:text-lg">
            Pilih model, bahan, warna, dan ukuran. Lihat preview video realistis sebelum
            busana diproduksi, jadi hasil akhirnya lebih yakin dan lebih personal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/customize">
              <Button variant="gold" size="lg" className="shadow-luxe">
                Mulai Desain
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" size="lg" className="bg-white/65 backdrop-blur">
                Lihat Koleksi
              </Button>
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-3 sm:gap-5">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-champagne/15 bg-white/55 px-4 py-4 shadow-soft backdrop-blur"
              >
                <dt className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-[11px] leading-snug text-mink sm:text-xs">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -left-10 top-8 z-10 hidden rounded-full border border-champagne/20 bg-white/80 px-4 py-2 text-xs font-semibold text-charcoal shadow-soft backdrop-blur sm:block">
            Video try-on preview
          </div>
          <div className="absolute -right-5 bottom-16 z-10 hidden rounded-2xl border border-champagne/20 bg-white/80 px-4 py-3 text-xs text-mink shadow-soft backdrop-blur sm:block">
            <span className="block font-display text-lg font-semibold text-charcoal">Custom fit</span>
            Ukuran mengikuti profil tubuh
          </div>

          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-blush/50 blur-3xl" />
          <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-sage/50 blur-3xl" />
          <VideoPreviewFrame
            label={heroMedia?.title}
            caption={heroMedia?.caption ?? "Preview outfit custom Anda sebelum produksi"}
            mediaUrl={heroMedia?.signedUrl}
            mediaType={heroMedia?.mediaType}
            showPlay={!isVideoPreview}
            className="shadow-luxe ring-1 ring-champagne/15"
          />
        </div>
      </div>
    </section>
  );
}
