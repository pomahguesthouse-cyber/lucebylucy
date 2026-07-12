import { ExternalLink, Send, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ADMIN_WHATSAPP, BRAND_NAME } from "@/lib/constants";

const telegramBotUsername = String(
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "",
).replace(/^@/, "");

const telegramUrl = telegramBotUsername
  ? `https://t.me/${telegramBotUsername}`
  : null;

const productTemplate = `/produk
Nama: Satin Moon Pajama
Harga: 289000
Kategori: pajama-set
Deskripsi: Set piyama satin lembut dan nyaman.
Cocok untuk: Tidur malam dan bersantai
Status: draft
Warna: #e6d8c2`;

export function AdminSettings() {
  return (
    <AdminLayout
      title="Settings"
      description="Pengaturan studio dan integrasi operasional LUSE."
    >
      <div className="max-w-3xl space-y-5">
        <div className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Informasi studio
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-mink">Nama brand</dt>
              <dd className="font-medium text-charcoal">{BRAND_NAME}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-mink">WhatsApp admin</dt>
              <dd className="font-medium text-charcoal">+{ADMIN_WHATSAPP}</dd>
            </div>
          </dl>
        </div>

        <section className="rounded-luxe border border-champagne/20 bg-white/80 p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-[#229ED9]/10 p-3 text-[#188ac1]">
                <Send className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-charcoal">
                  Telegram Product Bot
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-mink">
                  Admin dapat mengirim foto dan detail produk dari Telegram. Bot
                  akan mengunggah gambar lalu menambahkan produk ke database yang
                  sama dengan halaman Products.
                </p>
              </div>
            </div>

            {telegramUrl ? (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Buka @{telegramBotUsername}
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                Username bot belum dikonfigurasi
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mink">
                Format caption produk
              </p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-champagne/15 bg-silk/70 p-4 text-xs leading-6 text-charcoal">
                {productTemplate}
              </pre>
            </div>

            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Akses admin saja
              </div>
              <p className="mt-2 text-xs leading-5 text-emerald-800/80">
                Bot memeriksa Telegram user ID terhadap whitelist di VPS. Token
                bot dan Supabase service-role key tidak pernah dikirim ke browser.
              </p>
              <p className="mt-3 text-xs leading-5 text-emerald-800/80">
                Kirim <code className="font-semibold">/categories</code> untuk
                melihat slug kategori aktif dan <code className="font-semibold">/id</code>{" "}
                untuk melihat Telegram user ID.
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Catatan integrasi
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-mink">
            <li>Produk Telegram masuk ke tabel Products dan langsung terlihat di admin.</li>
            <li>Status default Telegram adalah Draft agar dapat ditinjau sebelum dipublikasikan.</li>
            <li>Pembayaran nyata belum diaktifkan pada versi MVP.</li>
            <li>AI video generation masih berupa preview placeholder.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
