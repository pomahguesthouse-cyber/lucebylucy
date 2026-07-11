import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";

const values = [
  { title: "Elegan & modest", text: "Setiap desain menjaga nilai modest fashion dengan sentuhan premium." },
  { title: "Personal", text: "Busana dirancang sesuai kebutuhan, ukuran, dan selera Anda." },
  { title: "Transparan", text: "Preview, ringkasan desain, dan review tim sebelum produksi." },
];

export function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Tentang"
        title="Tentang Luse by lucy"
        description="Luse by lucy adalah butik fashion digital dengan asisten AI pribadi untuk merancang busana modest custom yang elegan."
      />
      <section className="container py-12">
        <div className="mx-auto max-w-3xl space-y-5 text-mink">
          <p>
            Kami percaya setiap perempuan berhak tampil anggun dengan busana yang benar-benar
            sesuai dengan dirinya. Luse by lucy memadukan sentuhan personal seorang penata busana dengan
            kemudahan teknologi AI, sehingga Anda dapat memilih model, bahan, warna, dan ukuran
            dengan percaya diri.
          </p>
          <p>
            Sebelum memesan, Anda dapat melihat preview visual dan ringkasan desain. Setiap
            permintaan ditinjau oleh tim kami untuk memastikan desain realistis diproduksi,
            bahan tersedia, dan ukuran nyaman dipakai.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-luxe border border-champagne/15 bg-white/70 p-7 shadow-soft"
            >
              <h3 className="font-semibold text-charcoal">{value.title}</h3>
              <p className="mt-2 text-sm text-mink">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
