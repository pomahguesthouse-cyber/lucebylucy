import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/reveal";
import { categories } from "@/data/categories";

export function FeaturedCollection() {
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

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.04}>
              <Link
                to={`/collections?category=${category.id}`}
                className="group flex h-full flex-col justify-between rounded-luxe border border-champagne/15 bg-white/70 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-luxe"
              >
                <span className="text-3xl">{category.emoji}</span>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-charcoal">{category.name}</h3>
                  <p className="mt-1 text-sm text-mink">{category.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
