import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

const guide = [
  { part: "Tinggi badan", how: "Ukur dari ujung kepala sampai tumit tanpa alas kaki." },
  { part: "Lingkar dada", how: "Lingkarkan meteran pada bagian dada terpenuh." },
  { part: "Lingkar pinggang", how: "Ukur bagian pinggang paling kecil." },
  { part: "Lingkar pinggul", how: "Lingkarkan pada bagian pinggul terlebar." },
  { part: "Lebar bahu", how: "Ukur dari ujung bahu kiri ke ujung bahu kanan." },
  { part: "Panjang lengan", how: "Ukur dari ujung bahu sampai pergelangan tangan." },
  { part: "Lingkar lengan", how: "Lingkarkan pada bagian lengan atas terbesar." },
  { part: "Panjang baju", how: "Ukur dari bahu sampai panjang yang diinginkan." },
];

const standardSizes = [
  { size: "S", bust: "84-88", waist: "66-70", hip: "90-94" },
  { size: "M", bust: "88-92", waist: "70-74", hip: "94-98" },
  { size: "L", bust: "92-98", waist: "74-80", hip: "98-104" },
  { size: "XL", bust: "98-104", waist: "80-86", hip: "104-110" },
];

export function SizeGuide() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Panduan ukuran"
        title="Panduan ukuran & measurement"
        description="Ikuti panduan berikut agar busana custom Anda benar-benar pas. Gunakan satuan sentimeter (cm)."
      />
      <section className="container grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">Cara mengukur</h2>
          <div className="mt-5 space-y-3">
            {guide.map((item) => (
              <div
                key={item.part}
                className="rounded-2xl border border-champagne/15 bg-white/70 p-4 shadow-soft"
              >
                <h3 className="text-sm font-semibold text-charcoal">{item.part}</h3>
                <p className="mt-1 text-sm text-mink">{item.how}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">Tabel ukuran standar</h2>
          <div className="mt-5 overflow-hidden rounded-luxe border border-champagne/15 bg-white/70 shadow-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory/80 text-xs uppercase tracking-wide text-mink">
                <tr>
                  <th className="px-4 py-3">Ukuran</th>
                  <th className="px-4 py-3">Dada (cm)</th>
                  <th className="px-4 py-3">Pinggang (cm)</th>
                  <th className="px-4 py-3">Pinggul (cm)</th>
                </tr>
              </thead>
              <tbody>
                {standardSizes.map((row) => (
                  <tr key={row.size} className="border-t border-champagne/10">
                    <td className="px-4 py-3 font-semibold text-charcoal">{row.size}</td>
                    <td className="px-4 py-3 text-mink">{row.bust}</td>
                    <td className="px-4 py-3 text-mink">{row.waist}</td>
                    <td className="px-4 py-3 text-mink">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-mink">
            Ragu memilih ukuran? Gunakan custom measurement di customizer, tim kami akan
            meninjau ukuran Anda sebelum produksi.
          </p>
          <Link to="/customize" className="mt-5 inline-block">
            <Button variant="gold">Mulai desain dengan ukuran saya</Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
