import { AdminLayout } from "@/components/admin/AdminLayout";
import { colors } from "@/data/colors";

export function AdminColors() {
  return (
    <AdminLayout title="Colors" description="Kelola palet warna yang tersedia untuk customizer.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className="rounded-luxe border border-champagne/15 bg-white/75 p-5 shadow-soft"
          >
            <span
              className="block h-20 w-full rounded-2xl border border-black/5"
              style={{ backgroundColor: color.hex }}
            />
            <h3 className="mt-3 font-semibold text-charcoal">{color.name}</h3>
            <p className="text-xs text-mink">
              {color.family} · {color.hex}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
