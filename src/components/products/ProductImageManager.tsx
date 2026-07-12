import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadProductImages } from "@/lib/product-image-service";

interface ProductImageManagerProps {
  value: string;
  coverUrl: string;
  onChange: (value: string) => void;
  onCoverChange: (url: string) => void;
  disabled?: boolean;
}

const parseImageUrls = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

export function ProductImageManager({
  value,
  coverUrl,
  onChange,
  onCoverChange,
  disabled = false,
}: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrls = useMemo(() => parseImageUrls(value), [value]);

  useEffect(() => {
    if (imageUrls.length === 0) {
      if (coverUrl) onCoverChange("");
      return;
    }

    if (!imageUrls.includes(coverUrl)) {
      onCoverChange(imageUrls[0]);
    }
  }, [coverUrl, imageUrls, onCoverChange]);

  const updateImages = (nextImages: string[]) => {
    onChange(Array.from(new Set(nextImages)).join("\n"));
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await uploadProductImages(files);
      const nextImages = Array.from(new Set([...imageUrls, ...uploadedUrls]));
      updateImages(nextImages);
      if (!coverUrl && uploadedUrls[0]) onCoverChange(uploadedUrls[0]);
      toast.success(`${uploadedUrls.length} gambar berhasil diupload.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gambar gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    const nextImages = imageUrls.filter((item) => item !== url);
    updateImages(nextImages);
    if (coverUrl === url) onCoverChange(nextImages[0] ?? "");
  };

  return (
    <div className="rounded-2xl border border-champagne/20 bg-ivory/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-mink">Galeri gambar produk</p>
          <p className="mt-1 text-[11px] leading-5 text-mink">
            Upload dari komputer atau tempel URL. Klik tanda centang pada foto untuk menjadikannya cover.
          </p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={(event) => void handleFiles(Array.from(event.target.files ?? []))}
          />
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-champagne px-4 text-xs font-semibold text-white transition hover:bg-[#a9876c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Mengupload…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload dari lokal
              </>
            )}
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        disabled={disabled || uploading}
        className="mt-4 w-full resize-y rounded-xl border border-champagne/25 bg-white px-4 py-3 font-mono text-xs leading-5 outline-none focus:border-champagne disabled:opacity-60"
        placeholder={"https://.../foto-depan.jpg\nhttps://.../foto-belakang.jpg\nhttps://.../foto-detail.jpg"}
      />
      <p className="mt-1 text-[11px] text-mink">
        Format lokal: JPG, PNG, atau WebP. Maksimal 10 MB per gambar dan 10 gambar sekali upload.
      </p>

      {imageUrls.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {imageUrls.map((url, index) => {
            const isCover = coverUrl === url;
            return (
              <div
                key={url}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-white p-2 transition",
                  isCover
                    ? "border-champagne shadow-soft ring-2 ring-champagne/20"
                    : "border-champagne/15",
                )}
              >
                <button
                  type="button"
                  disabled={disabled || uploading}
                  onClick={() => onCoverChange(url)}
                  className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-sand text-left disabled:cursor-not-allowed"
                  aria-label={`Jadikan gambar ${index + 1} sebagai cover`}
                >
                  <img src={url} alt={`Pratinjau produk ${index + 1}`} className="h-full w-full object-cover" />
                  <span
                    className={cn(
                      "absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full border-2 shadow-soft backdrop-blur",
                      isCover
                        ? "border-champagne bg-champagne text-white"
                        : "border-white bg-black/25 text-transparent",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                  {isCover && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal shadow-soft">
                      Cover
                    </span>
                  )}
                </button>

                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <span className="truncate text-[10px] text-mink">Foto {index + 1}</span>
                  <button
                    type="button"
                    disabled={disabled || uploading}
                    onClick={() => removeImage(url)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 transition hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 flex min-h-28 items-center justify-center gap-3 rounded-2xl border border-dashed border-champagne/30 bg-white/50 text-sm text-mink">
          <ImagePlus className="h-5 w-5" /> Belum ada gambar produk.
        </div>
      )}
    </div>
  );
}
