import { ArrowRight, Heart, Leaf, MoonStar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  { name: "Étoile Satin Set", detail: "Signature Satin · Champagne", price: "Rp 749.000", image: "/sleepwear/product-satin.jpg", badge: "Best seller" },
  { name: "Nocturne Long Set", detail: "Cotton Modal · Burgundy", price: "Rp 689.000", image: "/sleepwear/product-burgundy.jpg" },
  { name: "Lune Relaxed Set", detail: "Silky Tencel · Pearl", price: "Rp 719.000", image: "/sleepwear/hero-sleepwear.jpg" },
];

export function SleepwearLanding() {
  return (
    <div className="overflow-hidden bg-[#fdfaf5] text-charcoal">
      <section className="relative grid min-h-[calc(100vh-4rem)] bg-[#fcf8f1] lg:grid-cols-[45%_55%]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-[8vw] lg:py-24">
          <div className="mb-5 flex items-center gap-4 text-champagne">
            <Sparkles className="h-5 w-5" />
            <span className="h-px w-24 bg-champagne/70" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-champagne">The art of rest</p>
          <h1 className="mt-5 max-w-[680px] font-display text-[3.8rem] font-medium leading-[0.88] tracking-[-0.055em] text-charcoal sm:text-[5rem] lg:text-[6.6vw]">
            Nyaman dipakai.<br />Indah dirasakan.
          </h1>
          <p className="mt-8 max-w-lg text-sm leading-7 text-mink sm:text-base">
            Baju tidur yang dirancang untuk merayakan waktu istirahatmu—lembut di kulit, anggun dalam setiap gerak.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/collections" className="inline-flex h-14 items-center gap-8 rounded-full bg-champagne px-7 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#a9876c]">
              Belanja koleksi <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/customize" className="inline-flex h-14 items-center rounded-full border border-champagne/50 bg-white/50 px-7 text-sm font-semibold text-charcoal transition hover:bg-white">
              Buat desainmu
            </Link>
          </div>
        </div>

        <div className="relative min-h-[560px] lg:min-h-full">
          <img src="/sleepwear/hero-sleepwear.jpg" alt="Model mengenakan sleepwear satin LUSE" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute bottom-6 left-6 flex w-[290px] overflow-hidden rounded-3xl bg-[#fffaf3]/95 p-2 shadow-luxe backdrop-blur sm:bottom-10 sm:left-10 lg:-left-28 lg:bottom-16">
            <img src="/sleepwear/product-satin.jpg" alt="Tekstur satin premium" className="h-32 w-36 rounded-2xl object-cover" />
            <div className="flex flex-col justify-center px-5">
              <Sparkles className="h-4 w-4 text-champagne" />
              <span className="mt-3 text-[9px] uppercase tracking-[0.2em] text-mink">Our signature</span>
              <strong className="mt-1 font-display text-2xl font-medium leading-none">Bahan<br />premium</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-[320px] items-center justify-center bg-white px-6 py-20 text-center">
        <div className="max-w-5xl">
          <Sparkles className="mx-auto h-5 w-5 text-champagne" />
          <p className="mt-7 font-display text-3xl font-medium leading-tight sm:text-5xl">
            Di LUSE, momen saat kamu pulang, beristirahat, dan menjadi dirimu sendiri layak terasa istimewa.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="mx-auto max-w-[1420px]">
          <div className="mb-12 flex items-end justify-between">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-champagne">Curated for your rest</p><h2 className="mt-2 font-display text-5xl font-medium sm:text-7xl">Koleksi pilihan</h2></div>
            <Link to="/collections" className="hidden items-center gap-2 border-b border-champagne pb-2 text-sm sm:flex">Lihat semua <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {products.map((product) => (
              <article key={product.name} className="group">
                <div className="relative h-[560px] overflow-hidden rounded-[28px] bg-sand">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                  {product.badge && <span className="absolute left-4 top-4 rounded-full bg-champagne px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white">{product.badge}</span>}
                  <button aria-label={`Simpan ${product.name}`} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-charcoal shadow-soft"><Heart className="h-5 w-5" /></button>
                  <Link to="/collections" className="absolute bottom-4 left-4 right-4 flex h-[52px] translate-y-20 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-charcoal transition duration-300 group-hover:translate-y-0">Lihat detail <ArrowRight className="h-4 w-4" /></Link>
                </div>
                <div className="mt-5 flex justify-between gap-4"><div><h3 className="font-display text-2xl font-medium">{product.name}</h3><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-mink">{product.detail}</p></div><strong className="pt-1 text-sm">{product.price}</strong></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#ede1d0] lg:grid-cols-[52%_48%]">
        <div className="m-5 min-h-[560px] overflow-hidden rounded-[28px] lg:m-16 lg:mr-0 lg:min-h-[760px]"><img src="/sleepwear/product-burgundy.jpg" alt="Ritual malam LUSE" className="h-full w-full object-cover" /></div>
        <div className="flex flex-col justify-center px-7 py-20 sm:px-12 lg:px-[7vw]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-champagne">The LUSE difference</p>
          <h2 className="mt-4 font-display text-5xl font-medium leading-[0.95] sm:text-7xl">Dibuat untuk<br /><em className="text-[#a9876c]">malam yang lebih baik.</em></h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-mink">Setiap koleksi dimulai dari satu pertanyaan sederhana: bagaimana membuat istirahat terasa lebih istimewa? Kami memilih bahan yang bernapas, jatuh dengan indah, dan bertahan menemani banyak malam.</p>
          <div className="mt-9 divide-y divide-champagne/25 border-y border-champagne/25">
            {[ [Leaf,"Lembut di kulit","Bahan pilihan yang halus dan ringan"], [Sparkles,"Dibuat dengan detail","Potongan anggun, jahitan penuh perhatian"], [MoonStar,"Nyaman sepanjang malam","Dirancang mengikuti gerak tubuhmu"] ].map(([Icon,title,text]) => {
              const ItemIcon = Icon as typeof Leaf;
              return <div key={String(title)} className="flex items-center gap-5 py-5"><ItemIcon className="h-5 w-5 text-champagne"/><div><strong className="font-display text-xl font-medium">{String(title)}</strong><small className="mt-1 block text-mink">{String(text)}</small></div></div>;
            })}
          </div>
          <Link to="/about" className="mt-8 inline-flex w-fit items-center gap-3 border-b border-champagne pb-2 text-sm">Kenali kisah kami <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>

      <section className="px-5 py-20 text-center sm:px-8 lg:px-[5vw] lg:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-champagne">Find your night style</p>
        <h2 className="mt-3 font-display text-5xl font-medium sm:text-7xl">Pilih kenyamananmu</h2>
        <div className="mx-auto mt-12 grid max-w-[1420px] gap-6 md:grid-cols-2">
          {[ ["Set panjang","Untuk malam yang tenang","/sleepwear/product-burgundy.jpg"], ["Satin collection","Kemewahan yang lembut","/sleepwear/hero-sleepwear.jpg"] ].map(([title,sub,image]) => <Link to="/collections" key={title} className="group relative h-[540px] overflow-hidden rounded-[30px] text-left text-white"><img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"/><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/><div className="absolute bottom-8 left-8"><strong className="font-display text-4xl font-medium">{title}</strong><small className="mt-1 block">{sub}</small></div></Link>)}
        </div>
      </section>

      <section className="bg-[#f2e8da] px-6 py-24 text-center">
        <span className="font-display text-7xl leading-none text-champagne">“</span>
        <blockquote className="mx-auto max-w-4xl font-display text-4xl font-medium leading-tight sm:text-6xl">LUSE membuat ritual tidur terasa seperti bentuk kecil dari mencintai diri sendiri.</blockquote>
        <p className="mt-7 text-[10px] uppercase tracking-[0.2em] text-mink">— Nadine, Jakarta</p>
      </section>

      <section className="bg-champagne px-6 py-24 text-center text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">A letter from LUSE</p>
        <h2 className="mt-3 font-display text-5xl font-medium sm:text-7xl">Untuk malam yang lebih indah.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/85">Dapatkan cerita, inspirasi, dan akses pertama ke koleksi terbaru.</p>
        <Link to="/contact" className="mx-auto mt-8 inline-flex h-[52px] items-center gap-3 rounded-full bg-white px-8 text-sm font-semibold text-charcoal">Bergabung dengan LUSE <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  );
}
