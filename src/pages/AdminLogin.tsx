import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getBackendClient, getBackendErrorMessage } from "@/lib/backend-client";
import { SUPERADMIN_EMAIL, useAuth } from "@/hooks/use-auth";
import { SiteLayout } from "@/components/layout/SiteLayout";

export function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      const supabase = await getBackendClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: { access_type: "offline", prompt: "select_account" },
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(getBackendErrorMessage(error));
      setSubmitting(false);
    }
  };

  const unauthorized = !loading && user && !isAdmin;

  return (
    <SiteLayout>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#f8f1e7] px-4 py-14 text-charcoal">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-sand/70 blur-3xl" />
        <div className="relative w-full max-w-md rounded-[30px] border border-champagne/20 bg-white/90 p-8 text-center shadow-luxe backdrop-blur sm:p-10">
          <Link to="/" className="mx-auto block w-fit">
            <img src="/luse-logo.png" alt="LUSE by Lucy" className="h-20 w-auto max-w-[280px] object-contain" />
          </Link>
          <div className="mx-auto mt-6 grid h-12 w-12 place-items-center rounded-full bg-[#f3e7da] text-champagne">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold">Superadmin Studio</h1>
          <p className="mt-2 text-sm leading-6 text-mink">Masuk dengan akun Google resmi untuk mengelola katalog, pesanan, media, dan pengaturan LUSE.</p>

          {unauthorized ? (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
              <p className="text-sm font-semibold text-red-800">Akun tidak memiliki akses admin.</p>
              <p className="mt-1 text-xs leading-5 text-red-700">Keluar lalu gunakan akun Google {SUPERADMIN_EMAIL}.</p>
              <button type="button" onClick={() => void signOut()} className="mt-4 text-sm font-semibold text-red-800 underline">Keluar dari akun ini</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void handleGoogleLogin()}
              disabled={submitting || loading}
              className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full border border-[#d7c5b5] bg-white px-6 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 hover:border-champagne disabled:pointer-events-none disabled:opacity-60"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base font-bold text-[#4285f4] shadow-sm">G</span>
              {submitting ? "Menghubungkan ke Google…" : "Masuk dengan Google"}
            </button>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-mink"><ShieldCheck className="h-3.5 w-3.5 text-champagne" />Akses terbatas untuk {SUPERADMIN_EMAIL}</div>
          <Link to="/" className="mt-6 inline-block text-xs font-medium text-champagne hover:underline">← Kembali ke website</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
