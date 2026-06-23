// Halaman admin untuk manajemen kategori koleksi (tambah/edit/hapus + cover image)
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  toggleCategoryActive,
  updateCategory,
  updateCategorySortOrders,
  type CollectionCategory,
} from "@/lib/category-service";

interface FormState {
  name: string;
  description: string;
  sortOrder: string;
  coverFile: File | null;
  coverPreview: string | null;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  sortOrder: "",
  coverFile: null,
  coverPreview: null,
};

export function AdminCategories() {
  const [items, setItems] = useState<CollectionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchAllCategories());
    } catch {
      toast.error("Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setForm((prev) => ({
      ...prev,
      coverFile: file,
      coverPreview: file ? URL.createObjectURL(file) : prev.coverPreview,
    }));
  };

  const startEdit = (item: CollectionCategory) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? "",
      sortOrder: String(item.sortOrder),
      coverFile: null,
      coverPreview: item.coverUrl,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }
    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const hasManualSortOrder = form.sortOrder.trim() !== "" && !Number.isNaN(sortOrder);
    setSaving(true);
    try {
      if (editingId) {
        const current = items.find((item) => item.id === editingId);
        await updateCategory({
          id: editingId,
          name: form.name,
          description: form.description,
          sortOrder: hasManualSortOrder ? sortOrder : current?.sortOrder,
          coverFile: form.coverFile,
          currentCoverPath: current?.coverStoragePath ?? null,
        });
        toast.success("Kategori diperbarui.");
      } else {
        await createCategory({
          name: form.name,
          description: form.description,
          sortOrder: hasManualSortOrder ? sortOrder : items.length * 10,
          coverFile: form.coverFile,
        });
        toast.success("Kategori ditambahkan.");
      }
      resetForm();
      await loadCategories();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan kategori.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const persistOrder = async (reordered: CollectionCategory[]) => {
    const nextItems = reordered.map((item, nextIndex) => ({
      ...item,
      sortOrder: nextIndex * 10,
    }));
    setItems(nextItems);
    await updateCategorySortOrders(
      nextItems.map((item) => ({
        id: item.id,
        sortOrder: item.sortOrder,
      })),
    );
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const fromIndex = items.findIndex((item) => item.id === draggedId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || targetIndex < 0) return;

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      await persistOrder(reordered);
      toast.success("Urutan kategori diperbarui.");
      await loadCategories();
    } catch {
      toast.error("Gagal mengubah urutan kategori.");
      await loadCategories();
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  const handleToggle = async (item: CollectionCategory) => {
    try {
      await toggleCategoryActive(item.id, !item.isActive);
      await loadCategories();
    } catch {
      toast.error("Gagal mengubah status kategori.");
    }
  };

  const handleDelete = async (item: CollectionCategory) => {
    if (!window.confirm(`Hapus kategori "${item.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    try {
      await deleteCategory(item.id, item.coverStoragePath);
      toast.success("Kategori dihapus.");
      if (editingId === item.id) resetForm();
      await loadCategories();
    } catch {
      toast.error("Gagal menghapus kategori.");
    }
  };

  return (
    <AdminLayout
      title="Kategori koleksi"
      description="Kelola kategori koleksi: tambah, ubah, hapus, atur cover image, dan deskripsi singkat."
    >
      {/* Form tambah/edit */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-luxe border border-champagne/20 bg-white/75 p-6 shadow-soft"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            {editingId ? "Ubah kategori" : "Tambah kategori"}
          </h2>
          {editingId && (
            <Button type="button" size="sm" variant="outline" onClick={resetForm}>
              <X className="h-3.5 w-3.5" /> Batal edit
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px]">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Nama kategori
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Contoh: Gamis"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Deskripsi singkat
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Contoh: Gamis syar'i elegan untuk acara."
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Urutan
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sortOrder: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder={String(items.length * 10)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {form.coverPreview && (
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-champagne/20 bg-ivory">
              <img
                src={form.coverPreview}
                alt="Pratinjau cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-champagne/40 bg-ivory/60 px-4 py-3 text-sm text-mink transition hover:border-champagne">
            <ImagePlus className="h-5 w-5 text-champagne" />
            <span className="truncate">
              {form.coverFile
                ? form.coverFile.name
                : editingId
                  ? "Ganti cover image (opsional)"
                  : "Pilih cover image (opsional)"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…
              </>
            ) : editingId ? (
              <>
                <Pencil className="h-4 w-4" /> Simpan perubahan
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Tambah kategori
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Daftar kategori */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-mink">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memuat kategori…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-luxe border border-dashed border-champagne/30 bg-white/60 py-16 text-center text-mink">
          Belum ada kategori. Tambahkan kategori koleksi pertama Anda.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggedId && draggedId !== item.id) setDragOverId(item.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(event) => {
                event.preventDefault();
                void handleDrop(item.id);
              }}
              className={`overflow-hidden rounded-[22px] border bg-white/80 shadow-soft transition ${
                dragOverId === item.id
                  ? "border-champagne/70 ring-2 ring-champagne/25"
                  : "border-champagne/15"
              } ${draggedId === item.id ? "opacity-60" : ""}`}
            >
              <div className="relative aspect-[5/4] bg-ivory">
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    setDraggedId(item.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", item.id);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  className="absolute left-3 top-3 z-10 inline-flex h-9 w-9 cursor-grab items-center justify-center rounded-full bg-white/85 text-mink shadow-soft transition hover:text-charcoal active:cursor-grabbing"
                  aria-label={`Geser ${item.name} untuk mengubah urutan`}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.name}
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-mink">
                    Tanpa cover image
                  </div>
                )}
                {!item.isActive && (
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-medium text-white">
                    Tersembunyi
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-champagne shadow-soft">
                  #{index + 1}
                </span>
              </div>

              <div className="space-y-3 p-3.5">
                <div>
                  <p className="font-medium leading-tight text-charcoal">{item.name}</p>
                  {item.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-mink">{item.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Ubah
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
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
                    className="h-8 px-3"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
