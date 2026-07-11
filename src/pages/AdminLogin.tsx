import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getBackendClient, getBackendErrorMessage } from "@/lib/backend-client";
import { SUPERADMIN_EMAIL, useAuth } from "@/hooks/use-auth";
import { SiteLayout } from "@/components/layout/SiteLayout";

const getLoginErrorMessage = (error: unknown) => {
  const message = getBackendErrorMessage(error);
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email atau password salah.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Periksa inbox email superadmin.";
  }

  return message;
};

export function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [email, setEmail] = useState(SUPERADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== SUPERADMIN_EMAIL) {
      toast.error(`Akses admin hanya tersedia untuk ${SUPERADMIN_EMAIL}.`);
      return;
    }

    if (!password) {
      toast.error("Masukkan password superadmin.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = await getBackendClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;
      toast.success("Login berhasil. Memeriksa akses superadmin…");
    } catch (error) {
      toast.error(getLoginErrorMessage(error));
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

        <div className="relative w-full max-w-md rounded-[30px] border border-champagne/20 bg-white/90 p-8 shadow-luxe backdrop-blur sm:p-10">
          <div className="text-center">
            <Link to="/" className="mx-auto block w-fit">
              <img
                src="/luse-logo.png"
                alt="LUSE by Lucy"
                className="h-20 w-auto max-w-[280px] object-contain"
              />
            </Link>

            <div className="mx-auto mt-6 grid h-12 w-12 place-items-center rounded-full bg-[#f3e7da] text-champagne">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold">Superadmin Studio</h1>
            <p className="mt-2 text-sm leading-6 text-mink">
              Masuk menggunakan email dan password superadmin untuk mengelola LUSE.
            </p>
          </div>

          {unauthorized ? (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
              <p className="text-sm font-semibold text-red-800">
                Akun tidak memiliki akses admin.
              </p>
              <p className="mt-1 text-xs leading-5 text-red-700">
                Keluar lalu masuk menggunakan akun {SUPERADMIN_EMAIL} yang sudah memiliki role admin.
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-4 text-sm font-semibold text-red-800 underline"
              >
                Keluar dari akun ini
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="mt-8 space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-charcoal">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mink" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-2xl border border-[#d7c5b5] bg-white px-4 pl-11 text-sm outline-none transition placeholder:text-mink/60 focus:border-champagne focus:ring-2 focus:ring-champagne/20"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-charcoal">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mink" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-2xl border border-[#d7c5b5] bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-mink/60 focus:border-champagne focus:ring-2 focus:ring-champagne/20"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-mink transition hover:text-charcoal"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-charcoal px-6 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#2f2a27] disabled:pointer-events-none disabled:opacity-60"
              >
                <ShieldCheck className="h-5 w-5" />
                {submitting ? "Memeriksa akun…" : "Masuk ke Admin"}
              </button>
            </form>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-mink">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-champagne" />
            Akses terbatas untuk {SUPERADMIN_EMAIL}
          </div>
          <p className="mt-3 text-center text-[11px] leading-5 text-mink/80">
            Akun admin tidak dapat didaftarkan dari halaman ini.
          </p>
          <div className="text-center">
            <Link to="/" className="mt-5 inline-block text-xs font-medium text-champagne hover:underline">
              ← Kembali ke website
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
