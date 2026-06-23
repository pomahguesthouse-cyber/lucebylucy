import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  deleteHeroMedia,
  fetchHeroMediaAdmin,
  saveHeroMedia,
  type HeroMedia,
} from "@/lib/hero-media-service";

export function AdminHeroMedia() {
  const [item, setItem] = useState<HeroMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("LUCE Studio Preview");
  const [caption, setCaption] = useState("Preview outfit custom Anda sebelum produksi");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadHeroMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHeroMediaAdmin();
      setItem(data);
      if (data) {
        setTitle(data.title);
        setCaption(data.caption);
        setIsActive(data.isActive);
        setFilePreview(data.signedUrl);
      }
    } catch {
      toast.error("Gagal memuat video hero.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHeroMedia();
  }, [loadHeroMedia]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setFilePreview(selected ? URL.createObjectURL(selected) : item?.signedUrl ?? null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file && !item) {
      toast.error("Pilih gambar atau video untuk hero.");
      return;
    }

    setSaving(true);
    try {
      await saveHeroMedia({
        file,
        title,
        caption,
        isActive,
        currentStoragePath: item?.storagePath ?? null,
        currentMediaType: item?.mediaType ?? null,
      });
      toast.success("Video hero diperbarui.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadHeroMedia();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan video hero.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm("Hapus media hero dari halaman depan?")) return;

    try {
      await deleteHeroMedia(item.storagePath);
      toast.success("Media hero dihapus.");
      setItem(null);
      setFile(null);
      setFilePreview(null);
      setTitle("LUCE Studio Preview");
      setCaption("Preview outfit custom Anda sebelum produksi");
      setIsActive(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Gagal menghapus media hero.");
    }
  };

  const previewType = file ? (file.type.startsWith("video/") ? "video" : "image") : item?.mediaType;

  return (
    <AdminLayout
      title="Video hero"
      description="Upload gambar atau video untuk mengisi kartu preview utama di halaman depan."
    >
      {loading ? (
        <div className="flex items-center justify-center py-16 text-mink">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memuat video hero…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-luxe border border-champagne/15 bg-white/75 p-5 shadow-soft">
            <div className="preview-frame relative mx-auto aspect-[3/4] max-w-sm overflow-hidden">
              {filePreview ? (
                previewType === "video" ? (
                  <video src={filePreview} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={filePreview} alt="Preview video hero" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center text-sm text-mink">
                  Belum ada media hero.
                </div>
              )}
              <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                {title || "LUCE Studio Preview"}
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/75 px-4 py-3 backdrop-blur">
                <p className="text-sm font-medium text-charcoal">
                  {caption || "Preview outfit custom Anda sebelum produksi"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-mink">
                Label
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                placeholder="LUCE Studio Preview"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-mink">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                placeholder="Preview outfit custom Anda sebelum produksi"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-champagne/40 bg-ivory/60 px-4 py-4 text-sm text-mink transition hover:border-champagne">
              <ImagePlus className="h-5 w-5 text-champagne" />
              <span className="truncate">
                {file ? file.name : item ? "Ganti gambar atau video" : "Pilih gambar atau video"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.svg,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-champagne/15 bg-white/70 px-4 py-3 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 accent-champagne"
              />
              Tampilkan di halaman depan
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="gold" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" /> Simpan hero
                  </>
                )}
              </Button>
              {item && (
                <Button type="button" variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> Hapus media
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
