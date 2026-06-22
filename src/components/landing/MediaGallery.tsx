// Galeri media publik (foto/video) untuk halaman depan
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { fetchActiveMedia, type MediaItem } from "@/lib/media-service";

interface MediaGalleryProps {
  limit?: number;
}

export function MediaGallery({ limit }: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchActiveMedia()
      .then((data) => {
        if (active) setItems(limit ? data.slice(0, limit) : data);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Galeri LUCE
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Inspirasi busana custom kami
            </h2>
            <p className="mt-4 text-mink">
              Lihat koleksi foto dan video model mengenakan busana custom LUCE. Galeri ini menjadi
              panduan visual sebelum Anda mulai mendesain.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit ?? 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] animate-pulse rounded-luxe bg-porcelain"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Reveal>
              <div className="mx-auto max-w-md rounded-luxe border border-dashed border-champagne/30 bg-white/60 px-6 py-16 text-center">
                <p className="text-mink">
                  Galeri sedang dipersiapkan. Sementara itu, Anda tetap bisa mulai mendesain busana
                  impian Anda.
                </p>
                <Link to="/customize" className="mt-6 inline-block">
                  <Button variant="gold">Mulai desain</Button>
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <figure className="preview-frame group relative aspect-[3/4] overflow-hidden">
                    {item.mediaType === "video" ? (
                      <>
                        <video
                          src={item.signedUrl ?? undefined}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(event) => void event.currentTarget.play()}
                          onMouseLeave={(event) => {
                            event.currentTarget.pause();
                            event.currentTarget.currentTime = 0;
                          }}
                        />
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition group-hover:opacity-0">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 shadow-soft">
                            <Play className="ml-0.5 h-5 w-5 text-champagne" fill="currentColor" />
                          </span>
                        </span>
                      </>
                    ) : (
                      <img
                        src={item.signedUrl ?? undefined}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/75 px-4 py-2 backdrop-blur">
                      <p className="text-sm font-medium text-charcoal">{item.title}</p>
                      {item.description && (
                        <p className="truncate text-xs text-mink">{item.description}</p>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {!loading && items.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/customize">
              <Button variant="gold">Mulai desain & preview</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
