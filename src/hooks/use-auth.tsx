// Context autentikasi untuk LUCE (dipakai area admin)
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
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (userId: string) => {
    const supabase = await getBackendClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!error && data?.role === "admin");
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
          void checkAdmin(nextSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
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
          void checkAdmin(currentSession.user.id);
        }
      } catch {
        if (!active) return;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
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
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user, isAdmin, loading, signOut }),
    [session, user, isAdmin, loading, signOut],
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
