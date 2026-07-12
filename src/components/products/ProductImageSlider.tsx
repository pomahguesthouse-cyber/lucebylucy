import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageSliderProps {
  images: string[];
  alt: string;
  fallbackColor?: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
}

const normalizeImages = (images: string[]) =>
  Array.from(
    new Set(
      images
        .map((image) => image.trim())
        .filter(Boolean),
    ),
  );

export function ProductImageSlider({
  images,
  alt,
  fallbackColor = "#e6d8c2",
  className,
  imageClassName,
  loading = "lazy",
}: ProductImageSliderProps) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const availableImages = useMemo(
    () => normalizedImages.filter((image) => !failedImages.includes(image)),
    [failedImages, normalizedImages],
  );

  useEffect(() => {
    if (availableImages.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => Math.min(current, availableImages.length - 1));
  }, [availableImages.length]);

  const move = (direction: -1 | 1) => {
    if (availableImages.length < 2) return;
    setActiveIndex((current) =>
      (current + direction + availableImages.length) % availableImages.length,
    );
  };

  const activeImage = availableImages[activeIndex];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: fallbackColor }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = touchStartX.current - touchEndX;
        touchStartX.current = null;

        if (Math.abs(distance) < 45) return;
        move(distance > 0 ? 1 : -1);
      }}
    >
      {activeImage ? (
        <img
          key={activeImage}
          src={activeImage}
          alt={availableImages.length > 1 ? `${alt} — foto ${activeIndex + 1}` : alt}
          loading={loading}
          className={cn("h-full w-full object-cover", imageClassName)}
          onError={() =>
            setFailedImages((current) =>
              current.includes(activeImage) ? current : [...current, activeImage],
            )
          }
        />
      ) : (
        <div className="grid h-full min-h-64 w-full place-items-center">
          <ImageOff className="h-9 w-9 text-charcoal/30" aria-hidden="true" />
          <span className="sr-only">Gambar {alt} tidak tersedia</span>
        </div>
      )}

      {availableImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Tampilkan foto sebelumnya"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              move(-1);
            }}
            className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Tampilkan foto berikutnya"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              move(1);
            }}
            className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-2 backdrop-blur">
            {availableImages.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Tampilkan foto ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                className={cn(
                  "h-1.5 rounded-full bg-white/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  index === activeIndex ? "w-5 bg-white" : "w-1.5 hover:bg-white/90",
                )}
              />
            ))}
          </div>

          <span className="absolute right-3 top-3 z-20 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {activeIndex + 1}/{availableImages.length}
          </span>
        </>
      )}
    </div>
  );
}
