import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, PackagePlus, Trash2 } from "lucide-react";

type Category = { id: string; name: string };
type TelegramWebApp = {
  initData: string;
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert?: (message: string) => void;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type UploadedImage = {
  url: string;
  storagePath: string;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 10;
const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const initialForm = {
  productCode: "",
  name: "",
  categoryId: "",
  description: "",
  basePrice: "",
  imageColor: "#e6d8c2",
  bestFor: "",
  status: "draft",
};

const createImageId = () =>
  window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function TelegramProductForm() {
  const webApp = useMemo(() => window.Telegram?.WebApp, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [coverImageId, setCoverImageId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingLabel, setSavingLabel] = useState("Menyimpan…");
  const [message, setMessage] = useState("");
  const imagesRef = useRef<SelectedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    },
    [],
  );

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

  const clearImages = () => {
    imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    imagesRef.current = [];
    setImages([]);
    setCoverImageId("");
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    setMessage("");

    if (selectedFiles.length === 0) return;

    const availableSlots = Math.max(0, MAX_IMAGES - images.length);
    if (availableSlots === 0) {
      setMessage(`Maksimal ${MAX_IMAGES} gambar per produk.`);
      return;
    }

    const accepted: SelectedImage[] = [];
    let rejectedMessage = "";

    for (const file of selectedFiles.slice(0, availableSlots)) {
      if (!VALID_IMAGE_TYPES.has(file.type)) {
        rejectedMessage = "Format gambar harus JPG, PNG, atau WebP.";
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        rejectedMessage = `Ukuran ${file.name} lebih dari 10 MB.`;
        continue;
      }

      accepted.push({
        id: createImageId(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (selectedFiles.length > availableSlots) {
      rejectedMessage = `Hanya ${MAX_IMAGES} gambar pertama yang dapat dipilih.`;
    }

    if (accepted.length > 0) {
      setImages((current) => [...current, ...accepted]);
      setCoverImageId((current) => current || accepted[0].id);
    }
    if (rejectedMessage) setMessage(rejectedMessage);
  };

  const removeImage = (imageId: string) => {
    const target = images.find((image) => image.id === imageId);
    if (target) URL.revokeObjectURL(target.previewUrl);

    setImages((current) => {
      const next = current.filter((image) => image.id !== imageId);
      setCoverImageId((currentCover) =>
        currentCover === imageId ? next[0]?.id || "" : currentCover,
      );
      return next;
    });
  };

  const uploadImage = async (image: SelectedImage): Promise<UploadedImage> => {
    if (!webApp?.initData) throw new Error("Sesi Telegram tidak tersedia.");

    const response = await fetch("/api/telegram/products", {
      method: "POST",
      headers: {
        "Content-Type": image.file.type,
        "X-Telegram-Init-Data": webApp.initData,
        "X-Luse-Action": "upload-image",
      },
      body: image.file,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Gagal mengunggah ${image.file.name}.`);

    return {
      url: payload.image.url,
      storagePath: payload.image.storagePath,
    };
  };

  const cleanupUploads = async (storagePaths: string[]) => {
    if (!webApp?.initData || storagePaths.length === 0) return;
    try {
      await fetch("/api/telegram/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": webApp.initData,
        },
        body: JSON.stringify({ action: "cleanupUploads", storagePaths }),
      });
    } catch {
      // Cleanup bersifat best effort; error utama tetap ditampilkan kepada pengguna.
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!webApp?.initData) {
      setMessage("Form ini harus dibuka dari bot Telegram LUSE.");
      return;
    }

    const orderedImages = [...images].sort((left, right) => {
      if (left.id === coverImageId) return -1;
      if (right.id === coverImageId) return 1;
      return 0;
    });
    const uploadedImages: UploadedImage[] = [];

    setSaving(true);
    try {
      for (let index = 0; index < orderedImages.length; index += 1) {
        setSavingLabel(`Mengunggah foto ${index + 1}/${orderedImages.length}…`);
        uploadedImages.push(await uploadImage(orderedImages[index]));
      }

      setSavingLabel("Menyimpan produk…");
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
          imageUrl: uploadedImages[0]?.url || "",
          imageUrls: uploadedImages.map((image) => image.url),
          imageStoragePaths: uploadedImages.map((image) => image.storagePath),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal menyimpan produk.");

      setMessage(
        `✅ ${payload.product.name} berhasil disimpan (${payload.product.product_code}).`,
      );
      setForm(initialForm);
      clearImages();
      webApp.showAlert?.("Produk berhasil ditambahkan ke LUSE.");
    } catch (error) {
      await cleanupUploads(uploadedImages.map((image) => image.storagePath));
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
      setSavingLabel("Menyimpan…");
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
              <input
                value={form.productCode}
                onChange={(event) => update("productCode", event.target.value)}
                placeholder="Otomatis: LU-0001"
                className="input"
                maxLength={40}
              />
            </Field>
            <Field label="Nama produk">
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Satin Pajama Set"
                className="input"
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
                  className="input"
                  required
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) => update("status", event.target.value)}
                  className="input"
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
                className="input"
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
                className="input resize-y"
              />
            </Field>
            <Field label="Cocok untuk">
              <input
                value={form.bestFor}
                onChange={(event) => update("bestFor", event.target.value)}
                placeholder="Tidur malam dan bersantai"
                className="input"
              />
            </Field>

            <div>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mink">
                Foto produk dari perangkat
              </span>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-champagne/45 bg-[#fbf7f1] px-4 py-5 text-center transition hover:border-champagne hover:bg-[#f8efe5]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={handleImageSelection}
                  disabled={saving || images.length >= MAX_IMAGES}
                />
                <ImagePlus className="h-7 w-7 text-champagne" />
                <span className="mt-2 text-sm font-semibold text-charcoal">
                  Pilih foto dari galeri atau perangkat
                </span>
                <span className="mt-1 text-xs leading-5 text-mink">
                  JPG, PNG, atau WebP · maksimal 10 MB per foto · hingga {MAX_IMAGES} foto
                </span>
              </label>

              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {images.map((image, index) => {
                    const isCover = image.id === coverImageId;
                    return (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-2xl border border-champagne/25 bg-white"
                      >
                        <div className="relative aspect-square bg-[#f4eadb]">
                          <img
                            src={image.previewUrl}
                            alt={`Pratinjau foto produk ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {isCover && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-charcoal px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
                              <CheckCircle2 className="h-3 w-3" /> Cover
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 p-2.5">
                          <p className="truncate text-[11px] font-medium text-charcoal">
                            {image.file.name}
                          </p>
                          <p className="text-[10px] text-mink">
                            {formatFileSize(image.file.size)}
                          </p>
                          <div className="grid grid-cols-[1fr_auto] gap-2">
                            <button
                              type="button"
                              onClick={() => setCoverImageId(image.id)}
                              aria-pressed={isCover}
                              className={`rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                                isCover
                                  ? "bg-charcoal text-white"
                                  : "bg-[#f4eadb] text-charcoal"
                              }`}
                            >
                              {isCover ? "Cover dipilih" : "Jadikan cover"}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              aria-label={`Hapus ${image.file.name}`}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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

            {message && (
              <p className="rounded-xl bg-[#f4eadb] px-4 py-3 text-sm leading-5">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-5 py-3.5 font-medium text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? savingLabel : "Simpan Produk"}
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
