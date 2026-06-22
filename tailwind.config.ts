import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#fbf7ef",
        porcelain: "#fffdf8",
        champagne: "#c89b52",
        sand: "#eadfcf",
        sage: "#c5c9b6",
        charcoal: "#151412",
        mink: "#7e756b",
        blush: "#e7c5c0",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 24px 70px rgba(70, 52, 32, 0.14)",
        soft: "0 14px 42px rgba(70, 52, 32, 0.09)",
      },
      borderRadius: {
        luxe: "28px",
      },
      backgroundImage: {
        "silk": "radial-gradient(circle at 12% 15%, rgba(255,255,255,.9), transparent 22rem), linear-gradient(135deg, #fffaf0 0%, #f3e7d8 42%, #fffdf8 100%)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
