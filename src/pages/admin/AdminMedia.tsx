// Halaman admin untuk mengelola media library (foto/video)
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ImagePlus, Loader2, Pencil, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  deleteMedia,
  fetchAllMedia,
  renameMedia,
  toggleMediaActive,
  uploadMedia,
  type MediaItem,
} from "@/lib/media-service";

export function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchAllMedia());
    } catch {
      toast.error("Gagal memuat media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error("Pilih file foto atau video dulu.");
      return;
    }
    if (!title.trim()) {
      toast.error("Beri judul untuk media ini.");
      return;
    }
    setUploading(true);
    try {
      await uploadMedia({ file, title, description });
      toast.success("Media berhasil diunggah.");
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadMedia();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengunggah media.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error("Judul tidak boleh kosong.");
      return;
    }
    try {
      await renameMedia(id, editTitle, editDescription);
      toast.success("Media diperbarui.");
      setEditingId(null);
      await loadMedia();
    } catch {
      toast.error("Gagal memperbarui media.");
    }
  };

  const handleToggle = async (item: MediaItem) => {
    try {
      await toggleMediaActive(item.id, !item.isActive);
      await loadMedia();
    } catch {
      toast.error("Gagal mengubah status media.");
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Hapus "${item.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteMedia(item.id, item.storagePath);
      toast.success("Media dihapus.");
      await loadMedia();
    } catch {
      toast.error("Gagal menghapus media.");
    }
  };

  return (
    <AdminLayout
      title="Media library"
      description="Kelola foto & video yang tampil di galeri halaman depan."
    >
      {/* Form unggah */}
      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-luxe border border-champagne/20 bg-white/75 p-6 shadow-soft"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Contoh: Gamis ceruty dusty rose"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Deskripsi (opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Catatan singkat soal media"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-champagne/40 bg-ivory/60 px-4 py-3 text-sm text-mink transition hover:border-champagne">
            <ImagePlus className="h-5 w-5 text-champagne" />
            <span className="truncate">
              {file ? file.name : "Pilih foto atau video"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <Button type="submit" variant="gold" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Mengunggah…
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" /> Unggah
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Daftar media */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-mink">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memuat media…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-luxe border border-dashed border-champagne/30 bg-white/60 py-16 text-center text-mink">
          Belum ada media. Unggah foto atau video pertama Anda.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-luxe border border-champagne/15 bg-white/80 shadow-soft"
            >
              <div className="relative aspect-[4/5] bg-ivory">
                {item.signedUrl ? (
                  item.mediaType === "video" ? (
                    <video
                      src={item.signedUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.signedUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-mink">
                    Pratinjau tidak tersedia
                  </div>
                )}
                {!item.isActive && (
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-medium text-white">
                    Tersembunyi
                  </span>
                )}
              </div>

              <div className="space-y-3 p-4">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full rounded-lg border border-champagne/30 px-3 py-2 text-sm outline-none focus:border-champagne"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(event) => setEditDescription(event.target.value)}
                      placeholder="Deskripsi"
                      className="w-full rounded-lg border border-champagne/30 px-3 py-2 text-sm outline-none focus:border-champagne"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="gold"
                        onClick={() => handleRename(item.id)}
                      >
                        Simpan
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-charcoal">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-mink">{item.description}</p>
                      )}
                      <span className="mt-1 inline-block text-[11px] uppercase tracking-wide text-champagne">
                        {item.mediaType === "video" ? "Video" : "Foto"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Ubah
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(item)}
                      >
                        {item.isActive ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Sembunyikan
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Tampilkan
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
