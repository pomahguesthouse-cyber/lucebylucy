import { useEffect, useMemo, useState } from "react";
import { Loader2, PackagePlus } from "lucide-react";

type Category = { id: string; name: string };
type TelegramWebApp = {
  initData: string;
  colorScheme?: "light" | "dark";
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
  imageUrl: "",
  imageColor: "#e6d8c2",
  bestFor: "",
  status: "draft",
};

export function TelegramProductForm() {
  const webApp = useMemo(() => window.Telegram?.WebApp, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    webApp?.ready();
    webApp?.expand();

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/telegram/products/categories", {
          headers: { "X-Telegram-Init-Data": webApp?.initData || "" },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Gagal memuat kategori.");
        setCategories(payload.categories || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal memuat kategori.");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, [webApp]);

  const update = (key: keyof typeof initialForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
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
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal menyimpan produk.");

      setMessage(`✅ ${payload.product.name} berhasil disimpan (${payload.product.product_code}).`);
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
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Kode produk (opsional)">
              <input value={form.productCode} onChange={(e) => update("productCode", e.target.value)} placeholder="Otomatis: LU-0001" className="input" maxLength={40} />
            </Field>
            <Field label="Nama produk">
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Satin Pajama Set" className="input" required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga">
                <input type="number" min="0" step="1000" value={form.basePrice} onChange={(e) => update("basePrice", e.target.value)} placeholder="289000" className="input" required />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
                  <option value="draft">Draft</option>
                  <option value="approved">Tayang</option>
                </select>
              </Field>
            </div>
            <Field label="Kategori">
              <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input">
                <option value="">Tanpa kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
            <Field label="Deskripsi">
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Detail bahan, potongan, dan keunggulan produk." className="input resize-y" />
            </Field>
            <Field label="Cocok untuk">
              <input value={form.bestFor} onChange={(e) => update("bestFor", e.target.value)} placeholder="Tidur malam dan bersantai" className="input" />
            </Field>
            <Field label="URL foto produk">
              <input type="url" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." className="input" />
            </Field>
            <Field label="Warna pratinjau">
              <div className="flex items-center gap-3 rounded-xl border border-champagne/25 px-3 py-2">
                <input type="color" value={form.imageColor} onChange={(e) => update("imageColor", e.target.value)} className="h-9 w-12" />
                <span className="text-sm uppercase text-mink">{form.imageColor}</span>
              </div>
            </Field>

            {message && <p className="rounded-xl bg-[#f4eadb] px-4 py-3 text-sm">{message}</p>}

            <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-5 py-3.5 font-medium text-white disabled:opacity-60">
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
  return <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mink">{label}</span>{children}</label>;
}
