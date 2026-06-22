import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll ke atas setiap kali pindah halaman
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
