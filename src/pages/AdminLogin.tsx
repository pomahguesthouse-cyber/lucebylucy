// Halaman masuk / daftar untuk admin LUCE
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";

type Mode = "login" | "register";

export function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Arahkan ke dashboard bila sudah masuk sebagai admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        toast.success("Akun dibuat. Selamat datang di LUCE Admin, Kak!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Berhasil masuk.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-silk px-4 py-12 text-charcoal">
        <div className="w-full max-w-md rounded-luxe border border-champagne/20 bg-white/80 p-8 shadow-soft">
        <Link to="/" className="font-display text-2xl font-semibold text-charcoal">
          LUCE <span className="text-sm text-mink">Admin</span>
        </Link>
        <p className="mt-2 text-sm text-mink">
          {mode === "login"
            ? "Masuk untuk mengelola media library."
            : "Daftarkan akun admin pertama untuk studio Anda."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-mink">
                Nama lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                placeholder="Nama admin"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="admin@luce.id"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-mink">
              Kata sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
            {submitting ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-5 w-full text-center text-sm text-champagne hover:underline"
        >
          {mode === "login"
            ? "Belum punya akun admin? Daftar di sini"
            : "Sudah punya akun? Masuk"}
        </button>
        </div>
      </section>
    </SiteLayout>
  );
}
