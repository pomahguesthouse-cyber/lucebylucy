import { AdminLayout } from "@/components/admin/AdminLayout";
import { ADMIN_WHATSAPP, BRAND_NAME } from "@/lib/constants";

export function AdminSettings() {
  return (
    <AdminLayout title="Settings" description="Pengaturan dasar studio (contoh untuk MVP).">
      <div className="max-w-2xl space-y-4">
        <div className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-charcoal">Informasi studio</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-mink">Nama brand</dt>
              <dd className="font-medium text-charcoal">{BRAND_NAME}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mink">WhatsApp admin</dt>
              <dd className="font-medium text-charcoal">+{ADMIN_WHATSAPP}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-luxe border border-champagne/15 bg-white/75 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-charcoal">Catatan integrasi</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-mink">
            <li>Database & autentikasi siap dihubungkan ke Lovable Cloud.</li>
            <li>Pembayaran nyata belum diaktifkan pada versi MVP.</li>
            <li>AI video generation masih berupa preview placeholder.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
