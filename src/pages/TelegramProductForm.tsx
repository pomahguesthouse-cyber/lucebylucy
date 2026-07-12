import { useEffect, useState } from "react";
import { Loader2, PackagePlus } from "lucide-react";

type Category = { id: string; name: string };

type TelegramWebApp = {
  initData: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert?: (message: string) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const initialForm = {
  productCode: "",
  name: "",
  categoryId: "",
  description: "",
  basePrice: "",
  imageUrls: "",
  imageColor: "#e6d8c2",
  bestFor: "",
  status: "draft",
};

const inputClass =
  "w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15";

const loadTelegramSdk = (): Promise<void> => {
  if (window.Telegram?.WebApp) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[src="https://telegram.org/js/telegram-web-app.js"]',
  );

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Gagal memuat Telegram SDK.")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Gagal memuat Telegram SDK.")), {
      once: true,
    });
    document.head.appendChild(script);
  });
};

const parseImageUrls = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

export function TelegramProductForm() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await loadTelegramSdk();
        const app = window.Telegram?.WebApp;

        if (!app?.initData) {
          throw new Error("Form ini harus dibuka dari bot Telegram LUSE.");
        }

        app.ready();
        app.expand();
        if (cancelled) return;
        setWebApp(app);

        const response = await fetch("/api/telegram/products/categories", {
          headers: { "X-Telegram-Init-Data": app.initData },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Gagal memuat kategori.");
        if (!cancelled) setCategories(payload.categories || []);
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Gagal memuat form Telegram.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key: keyof typeof initialForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!webApp?.initData) {
      setMessage("Form ini harus dibuka dari bot Telegram LUSE.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/telegram/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": webApp.initData,
        },
        body: JSON.stringify({
          ...form,
          productCode: form.productCode.trim().toUpperCase(),
          basePrice: Number(form.basePrice),
          imageUrls: parseImageUrls(form.imageUrls),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal menyimpan produk.");

      const code = payload.product.product_code || "kode otomatis";
      setMessage(`✅ ${payload.product.name} berhasil disimpan (${code}).`);
      setForm(initialForm);
      webApp.showAlert?.("Produk berhasil ditambahkan ke LUSE.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-5 text-charcoal">
      <section className="mx-auto max-w-xl rounded-[28px] border border-champagne/25 bg-white/90 p-5 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-charcoal text-white">
            <PackagePlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-mink">LUSE Admin</p>
            <h1 className="font-display text-2xl font-semibold">Tambah Produk</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-mink">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat form…
          </div>
        ) : !webApp ? (
          <p className="rounded-xl bg-[#f4eadb] px-4 py-3 text-sm">{message}</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Kode produk (opsional)">
              <input
                value={form.productCode}
                onChange={(event) => update("productCode", event.target.value)}
                placeholder="Otomatis: LU-0001"
                className={inputClass}
                maxLength={40}
              />
            </Field>

            <Field label="Nama produk">
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Satin Pajama Set"
                className={inputClass}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.basePrice}
                  onChange={(event) => update("basePrice", event.target.value)}
                  placeholder="289000"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) => update("status", event.target.value)}
                  className={inputClass}
                >
                  <option value="draft">Draft</option>
                  <option value="approved">Tayang</option>
                </select>
              </Field>
            </div>

            <Field label="Kategori">
              <select
                value={form.categoryId}
                onChange={(event) => update("categoryId", event.target.value)}
                className={inputClass}
              >
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Deskripsi">
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={4}
                placeholder="Detail bahan, potongan, dan keunggulan produk."
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Cocok untuk">
              <input
                value={form.bestFor}
                onChange={(event) => update("bestFor", event.target.value)}
                placeholder="Tidur malam dan bersantai"
                className={inputClass}
              />
            </Field>

            <Field label="URL foto produk">
              <textarea
                value={form.imageUrls}
                onChange={(event) => update("imageUrls", event.target.value)}
                rows={3}
                placeholder={"https://.../foto-cover.jpg\nhttps://.../foto-detail.jpg"}
                className={`${inputClass} resize-y font-mono text-xs`}
              />
              <span className="mt-1 block text-[11px] text-mink">
                Satu URL per baris. Foto pertama menjadi cover.
              </span>
            </Field>

            <Field label="Warna pratinjau">
              <div className="flex items-center gap-3 rounded-xl border border-champagne/25 px-3 py-2">
                <input
                  type="color"
                  value={form.imageColor}
                  onChange={(event) => update("imageColor", event.target.value)}
                  className="h-9 w-12"
                />
                <span className="text-sm uppercase text-mink">{form.imageColor}</span>
              </div>
            </Field>

            {message && <p className="rounded-xl bg-[#f4eadb] px-4 py-3 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-5 py-3.5 font-medium text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Menyimpan…" : "Simpan Produk"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mink">
        {label}
      </span>
      {children}
    </label>
  );
}
