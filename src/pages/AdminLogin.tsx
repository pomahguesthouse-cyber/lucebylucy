import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getBackendClient, getBackendErrorMessage } from "@/lib/backend-client";
import { SUPERADMIN_EMAIL, useAuth } from "@/hooks/use-auth";
import { SiteLayout } from "@/components/layout/SiteLayout";

export function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const supabase = await getBackendClient();
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        toast.success("Pendaftaran berhasil. Periksa email untuk mengonfirmasi akun.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        toast.success("Berhasil masuk.");
      }
    } catch (error) {
      toast.error(getBackendErrorMessage(error));
    } finally {
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
          <p className="mt-2 text-sm leading-6 text-mink">Masuk untuk mengelola katalog, pesanan, media, dan pengaturan LUSE.</p>

          {unauthorized ? (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
              <p className="text-sm font-semibold text-red-800">Akun tidak memiliki akses admin.</p>
              <p className="mt-1 text-xs leading-5 text-red-700">Keluar lalu gunakan akun {SUPERADMIN_EMAIL}.</p>
              <button type="button" onClick={() => void signOut()} className="mt-4 text-sm font-semibold text-red-800 underline">Keluar dari akun ini</button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={submitting || loading}
                className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full border border-[#d7c5b5] bg-white px-6 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 hover:border-champagne disabled:pointer-events-none disabled:opacity-60"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base font-bold text-[#4285f4] shadow-sm">G</span>
                Masuk dengan Google
              </button>

              <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-mink">
                <span className="h-px flex-1 bg-champagne/20" />atau gunakan email<span className="h-px flex-1 bg-champagne/20" />
              </div>

              <div className="mb-5 grid grid-cols-2 rounded-full bg-[#f5ede3] p-1 text-xs font-semibold">
                <button type="button" onClick={() => setMode("login")} className={`rounded-full px-4 py-2.5 transition ${mode === "login" ? "bg-white text-charcoal shadow-sm" : "text-mink"}`}>Masuk</button>
                <button type="button" onClick={() => setMode("signup")} className={`rounded-full px-4 py-2.5 transition ${mode === "signup" ? "bg-white text-charcoal shadow-sm" : "text-mink"}`}>Daftar</button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                {mode === "signup" && (
                  <div>
                    <label htmlFor="admin-name" className="text-xs font-semibold text-mink">Nama lengkap</label>
                    <input id="admin-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required className="mt-1.5 h-12 w-full rounded-2xl border border-champagne/25 bg-white px-4 text-sm outline-none transition focus:border-champagne" placeholder="Nama Anda" />
                  </div>
                )}
                <div>
                  <label htmlFor="admin-email" className="text-xs font-semibold text-mink">Alamat email</label>
                  <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-1.5 h-12 w-full rounded-2xl border border-champagne/25 bg-white px-4 text-sm outline-none transition focus:border-champagne" placeholder="nama@email.com" />
                </div>
                <div>
                  <label htmlFor="admin-password" className="text-xs font-semibold text-mink">Kata sandi</label>
                  <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-1.5 h-12 w-full rounded-2xl border border-champagne/25 bg-white px-4 text-sm outline-none transition focus:border-champagne" placeholder="Minimal 8 karakter" />
                </div>
                <button type="submit" disabled={submitting || loading} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-champagne px-6 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#a9876c] disabled:pointer-events-none disabled:opacity-60">
                  <Mail className="h-4 w-4" />{submitting ? "Memproses…" : mode === "login" ? "Masuk dengan email" : "Buat akun"}
                </button>
              </form>
              {mode === "signup" && <p className="mt-4 text-left text-[11px] leading-5 text-mink">Pendaftaran tidak otomatis memberikan akses admin. Dashboard hanya dapat dibuka oleh superadmin yang disetujui.</p>}
            </>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-mink"><ShieldCheck className="h-3.5 w-3.5 text-champagne" />Akses terbatas untuk {SUPERADMIN_EMAIL}</div>
          <Link to="/" className="mt-6 inline-block text-xs font-medium text-champagne hover:underline">← Kembali ke website</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
