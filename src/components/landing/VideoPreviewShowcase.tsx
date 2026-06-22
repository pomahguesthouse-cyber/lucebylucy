import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { VideoPreviewFrame } from "@/components/video-preview/VideoPreviewFrame";

const points = [
  "Lihat jatuh kain dan siluet sebelum produksi",
  "Kurangi keraguan soal model dan warna",
  "Preview elegan bergaya butik premium",
];

export function VideoPreviewShowcase() {
  return (
    <section className="py-16 md:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm">
            <VideoPreviewFrame caption="Preview video outfit custom Anda" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              AI video preview
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Preview your custom outfit on a model before production
            </h2>
            <p className="mt-4 text-mink">
              Bayangkan hasil akhir busana Anda lewat preview video di studio premium dengan
              nuansa beige lembut. Preview adalah panduan visual; hasil akhir tetap melalui
              review tim sebelum produksi.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-charcoal">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/customize" className="mt-8 inline-block">
              <Button variant="gold">Mulai desain & preview</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
