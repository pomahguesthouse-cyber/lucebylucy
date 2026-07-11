// Context autentikasi untuk Luse by lucy (dipakai area admin)
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBackendClient } from "@/lib/backend-client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  role: "superadmin" | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const SUPERADMIN_EMAIL = "ical.smg@gmail.com";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<"superadmin" | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (nextUser: User) => {
    const normalizedEmail = nextUser.email?.trim().toLowerCase();
    if (normalizedEmail !== SUPERADMIN_EMAIL) {
      setIsAdmin(false);
      setRole(null);
      return;
    }

    const supabase = await getBackendClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", nextUser.id)
      .eq("role", "admin")
      .maybeSingle();

    const authorized = !error && data?.role === "admin";
    setIsAdmin(authorized);
    setRole(authorized ? "superadmin" : null);
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        const supabase = await getBackendClient();

    // Daftarkan listener dulu agar tidak melewatkan event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        // Tunda pemanggilan Supabase lain untuk mencegah deadlock
        setTimeout(() => {
          void checkAdmin(nextSession.user);
        }, 0);
      } else {
        setIsAdmin(false);
        setRole(null);
      }
      setLoading(false);
    });

        unsubscribe = () => subscription.unsubscribe();

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        if (!active) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          void checkAdmin(currentSession.user);
        }
      } catch {
        if (!active) return;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setRole(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [checkAdmin]);

  const signOut = useCallback(async () => {
    const supabase = await getBackendClient();
    await supabase.auth.signOut();
    setIsAdmin(false);
    setRole(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user, isAdmin, role, loading, signOut }),
    [session, user, isAdmin, role, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
