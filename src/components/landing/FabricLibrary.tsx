import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/reveal";
import { fabrics } from "@/data/fabrics";

export function FabricLibrary() {
  return (
    <section className="bg-porcelain py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
              Pustaka bahan
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Bahan pilihan untuk kenyamanan maksimal
            </h2>
            <p className="mt-4 text-mink">
              Kenali tekstur, tingkat kenyamanan, dan ketebalan tiap bahan sebelum memilih.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fabrics.slice(0, 8).map((fabric, index) => (
            <Reveal key={fabric.id} delay={index * 0.03}>
              <div className="h-full rounded-luxe border border-champagne/15 bg-white/70 p-5 shadow-soft">
                <div
                  className="h-24 w-full rounded-2xl"
                  style={{ backgroundColor: fabric.swatch }}
                />
                <h3 className="mt-4 font-semibold text-charcoal">{fabric.name}</h3>
                <p className="mt-1 text-xs text-mink">{fabric.description}</p>
                <dl className="mt-4 space-y-1 text-xs text-mink">
                  <div className="flex justify-between">
                    <dt>Tekstur</dt>
                    <dd className="font-medium text-charcoal">{fabric.texture}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Kenyamanan</dt>
                    <dd className="font-medium text-charcoal">{fabric.comfortLevel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Ketebalan</dt>
                    <dd className="font-medium text-charcoal">{fabric.thickness}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/customize" className="text-sm font-semibold text-champagne hover:underline">
            Pilih bahan di customizer →
          </Link>
        </div>
      </div>
    </section>
  );
}
