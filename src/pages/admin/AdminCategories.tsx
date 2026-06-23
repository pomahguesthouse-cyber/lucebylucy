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
  type CollectionCategory,
} from "@/lib/category-service";

interface FormState {
  name: string;
  description: string;
  coverFile: File | null;
  coverPreview: string | null;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  coverFile: null,
  coverPreview: null,
};

export function AdminCategories() {
  const [items, setItems] = useState<CollectionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    setSaving(true);
    try {
      if (editingId) {
        const current = items.find((item) => item.id === editingId);
        await updateCategory({
          id: editingId,
          name: form.name,
          description: form.description,
          coverFile: form.coverFile,
          currentCoverPath: current?.coverStoragePath ?? null,
        });
        toast.success("Kategori diperbarui.");
      } else {
        await createCategory({
          name: form.name,
          description: form.description,
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

        <div className="grid gap-4 md:grid-cols-2">
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
              accept="image/*"
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-luxe border border-champagne/15 bg-white/80 shadow-soft"
            >
              <div className="relative aspect-[4/3] bg-ivory">
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
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
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="font-medium text-charcoal">{item.name}</p>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-mink">{item.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => startEdit(item)}>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
