import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageSliderProps {
  images: string[];
  alt: string;
  fallbackColor?: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  transition?: "instant" | "fade";
  pauseOnHover?: boolean;
  compactControls?: boolean;
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
  autoPlay = false,
  autoPlayInterval = 4000,
  transition = "instant",
  pauseOnHover = true,
  compactControls = false,
}: ProductImageSliderProps) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  const move = useCallback(
    (direction: -1 | 1) => {
      if (availableImages.length < 2) return;
      setActiveIndex(
        (current) =>
          (current + direction + availableImages.length) % availableImages.length,
      );
    },
    [availableImages.length],
  );

  useEffect(() => {
    if (!autoPlay || isPaused || availableImages.length < 2) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(
      () => move(1),
      Math.max(autoPlayInterval, 1500),
    );

    return () => window.clearInterval(intervalId);
  }, [autoPlay, autoPlayInterval, availableImages.length, isPaused, move]);

  const markImageFailed = (image: string) => {
    setFailedImages((current) =>
      current.includes(image) ? current : [...current, image],
    );
  };

  const activeImage = availableImages[activeIndex];
  const useFade = transition === "fade" && availableImages.length > 1;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: fallbackColor }}
      onMouseEnter={() => {
        if (pauseOnHover) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsPaused(false);
      }}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={(event) => {
        setIsPaused(true);
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) {
          setIsPaused(false);
          return;
        }

        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = touchStartX.current - touchEndX;
        touchStartX.current = null;

        if (Math.abs(distance) >= 45) {
          move(distance > 0 ? 1 : -1);
        }

        setIsPaused(false);
      }}
    >
      {activeImage ? (
        useFade ? (
          <div className="relative h-full w-full">
            {availableImages.map((image, index) => {
              const isActive = index === activeIndex;

              return (
                <img
                  key={image}
                  src={image}
                  alt={isActive ? `${alt} — foto ${index + 1}` : ""}
                  aria-hidden={!isActive}
                  loading={index === 0 ? loading : "lazy"}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]",
                    isActive ? "z-[1] opacity-100" : "z-0 opacity-0",
                    imageClassName,
                  )}
                  style={{
                    transition:
                      "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms ease-out",
                  }}
                  onError={() => markImageFailed(image)}
                />
              );
            })}
          </div>
        ) : (
          <img
            key={activeImage}
            src={activeImage}
            alt={availableImages.length > 1 ? `${alt} — foto ${activeIndex + 1}` : alt}
            loading={loading}
            className={cn("h-full w-full object-cover", imageClassName)}
            onError={() => markImageFailed(activeImage)}
          />
        )
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
            className={cn(
              "absolute top-1/2 z-20 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne",
              compactControls
                ? "left-2 hidden h-8 w-8 sm:grid"
                : "left-3 grid h-10 w-10",
            )}
          >
            <ChevronLeft className={cn(compactControls ? "h-4 w-4" : "h-5 w-5")} />
          </button>
          <button
            type="button"
            aria-label="Tampilkan foto berikutnya"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              move(1);
            }}
            className={cn(
              "absolute top-1/2 z-20 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne",
              compactControls
                ? "right-2 hidden h-8 w-8 sm:grid"
                : "right-3 grid h-10 w-10",
            )}
          >
            <ChevronRight className={cn(compactControls ? "h-4 w-4" : "h-5 w-5")} />
          </button>

          <div
            className={cn(
              "absolute left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-black/25 backdrop-blur",
              compactControls
                ? "bottom-2 gap-1 px-2 py-1.5 sm:bottom-3 sm:gap-1.5 sm:px-2.5 sm:py-2"
                : "bottom-3 gap-1.5 px-2.5 py-2",
            )}
          >
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
                  "rounded-full bg-white/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  compactControls ? "h-1" : "h-1.5",
                  index === activeIndex
                    ? compactControls
                      ? "w-4 bg-white"
                      : "w-5 bg-white"
                    : compactControls
                      ? "w-1 hover:bg-white/90"
                      : "w-1.5 hover:bg-white/90",
                )}
              />
            ))}
          </div>

          <span
            className={cn(
              "absolute z-20 rounded-full bg-black/35 font-semibold text-white backdrop-blur",
              compactControls
                ? "right-2 top-2 px-2 py-1 text-[9px]"
                : "right-3 top-3 px-2.5 py-1 text-[10px]",
            )}
          >
            {activeIndex + 1}/{availableImages.length}
          </span>
        </>
      )}
    </div>
  );
}
