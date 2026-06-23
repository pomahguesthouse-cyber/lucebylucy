import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/reveal";
import { categories } from "@/data/categories";
import { fetchActiveCategories, type CollectionCategory } from "@/lib/category-service";
import type { CategoryId } from "@/types";

const categoryAccent: Record<CategoryId, string> = {
  gamis: "#9b6b3c",
  abaya: "#a66f3c",
  tunik: "#7f8a62",
  dress: "#b07a73",
  outer: "#9a7653",
  blouse: "#b59a7d",
  rok: "#b18a45",
  "hijab-set": "#a68b64",
  "family-set": "#9b735b",
};

const normalizeCategoryName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const findLocalCategoryId = (category: Pick<CollectionCategory, "id" | "name">) => {
  const normalizedId = normalizeCategoryName(category.id);
  const normalizedName = normalizeCategoryName(category.name);
  return categories.find(
    (item) =>
      normalizeCategoryName(item.id) === normalizedId ||
      normalizeCategoryName(item.name) === normalizedName,
  )?.id;
};

function CategorySketch({ categoryId }: { categoryId: CategoryId }) {
  const accent = categoryAccent[categoryId];
  const isShortTop = categoryId === "tunik" || categoryId === "blouse";
  const isSkirt = categoryId === "rok";

  return (
    <svg
      className="h-full w-full transition-transform duration-500 group-hover:scale-[1.025]"
      viewBox="0 0 260 390"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M129 35c28 0 49 24 49 56 0 15-4 32-9 47 9 8 17 21 22 40l43 158c-29 23-67 32-104 32s-75-9-104-32l43-158c5-19 13-32 22-40-5-15-9-32-9-47 0-32 21-56 47-56Z"
        fill="#f3eadf"
      />
      <path
        d="M130 35c-28 0-49 24-49 56 0 20 5 41 11 58M130 35c28 0 49 24 49 56 0 20-5 41-11 58"
        stroke="#454542"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M104 92c3-26 14-44 26-44 13 0 24 18 27 44 3 29-8 51-27 51-18 0-29-22-26-51Z"
        fill="#eee4d8"
        stroke="#454542"
        strokeWidth="3"
      />
      <path
        d="M91 136c15 22 30 32 39 32 11 0 27-10 39-32"
        stroke="#454542"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M83 141c17 33 66 47 98 10"
        stroke="#8d8a84"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M87 151c22 32 70 36 91 0"
        stroke="#8d8a84"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={
          isSkirt
            ? "M87 172c-13 49-25 106-47 164 26 22 57 32 90 32s64-10 90-32c-22-58-34-115-47-164"
            : isShortTop
              ? "M82 169c-8 36-17 78-30 124 22 16 50 23 78 23s56-7 78-23c-13-46-22-88-30-124"
              : "M76 169c-13 49-25 108-50 167 29 23 67 32 104 32s75-9 104-32c-25-59-37-118-50-167"
        }
        fill="#fbf4ea"
        stroke="#454542"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M94 159c-9 54-10 130-17 188M166 159c9 54 10 130 17 188"
        stroke="#9c9992"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M130 170v193"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {!isSkirt && (
        <>
          <path
            d="M78 178 43 289c-3 10 2 17 13 20l15 4M182 178l35 111c3 10-2 17-13 20l-15 4"
            stroke="#454542"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M64 310c2 9 9 15 17 17M196 310c-2 9-9 15-17 17"
            stroke="#8d8a84"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {categoryId === "outer" && (
        <path
          d="M100 168c13 24 24 34 30 34s17-10 30-34M102 170l-9 79M158 170l9 79"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {categoryId === "family-set" && (
        <>
          <circle cx="58" cy="256" r="10" fill="#f3eadf" stroke="#454542" strokeWidth="2" />
          <path d="M44 306c3-30 7-42 14-42s11 12 14 42" stroke="#454542" strokeWidth="2" />
          <circle cx="202" cy="256" r="10" fill="#f3eadf" stroke="#454542" strokeWidth="2" />
          <path d="M188 306c3-30 7-42 14-42s11 12 14 42" stroke="#454542" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function FeaturedCollection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [backendCategories, setBackendCategories] = useState<CollectionCategory[]>([]);
  const [isBackendLoaded, setIsBackendLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const items = await fetchActiveCategories();
        if (active) setBackendCategories(items);
      } catch {
        if (active) setBackendCategories([]);
      } finally {
        if (active) setIsBackendLoaded(true);
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const sliderCategories = useMemo(() => {
    if (!isBackendLoaded || backendCategories.length === 0) {
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        coverUrl: null,
        localId: category.id,
      }));
    }

    return backendCategories.map((category) => ({
      id: category.id,
      name: category.name,
      coverUrl: category.coverUrl,
      localId: findLocalCategoryId(category),
    }));
  }, [backendCategories, isBackendLoaded]);

  const scrollSlider = (direction: "previous" | "next") => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === "next" ? slider.clientWidth * 0.85 : -slider.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
                Koleksi
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
                Pilih kategori favorit Anda
              </h2>
            </div>
            <Link to="/collections" className="text-sm font-semibold text-champagne hover:underline">
              Lihat semua koleksi →
            </Link>
          </div>
        </Reveal>

        <div className="relative mt-10">
          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
            aria-label="Slider kategori koleksi"
          >
            {sliderCategories.map((category, index) => (
              <Reveal
                key={category.id}
                delay={index * 0.04}
                className="min-w-[82%] snap-start sm:min-w-[48%] lg:min-w-[32%]"
              >
                <Link
                  to={category.localId ? `/collections?category=${category.localId}` : "/collections"}
                  className="group flex aspect-[3/4] min-h-[430px] flex-col overflow-hidden rounded-[42px] border border-champagne/15 bg-[#efe6dc] p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-luxe sm:min-h-[500px]"
                >
                  <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[34px] bg-[#efe6dc] p-4">
                    {category.coverUrl ? (
                      <img
                        src={category.coverUrl}
                        alt={category.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : category.localId ? (
                      <CategorySketch categoryId={category.localId} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f3eadf] text-sm font-medium text-mink">
                        Tanpa cover image
                      </div>
                    )}
                  </div>
                  <div className="pb-3 text-center">
                    <h3
                      className="text-3xl font-bold uppercase leading-none tracking-[0.32em] sm:text-4xl"
                      style={{
                        color: category.localId ? categoryAccent[category.localId] : "#a66f3c",
                      }}
                    >
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => scrollSlider("previous")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/30 bg-white/75 text-charcoal shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne/60 hover:bg-white"
              aria-label="Kategori sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("next")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/30 bg-white/75 text-charcoal shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne/60 hover:bg-white"
              aria-label="Kategori berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
