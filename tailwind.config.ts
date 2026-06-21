import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // LUMINA Design System
        lumina: {
          void: "#020408",
          deep: "#040C14",
          cosmos: "#061020",
          nebula: "#0A1628",
          drift: "#0F2040",
          horizon: "#162A50",
          aurora: "#1E3A6E",

          // Accent — cold stellar blue-white
          star: "#A8C8FF",
          "star-bright": "#C8DCFF",
          "star-core": "#E8F0FF",
          "star-white": "#F0F4FF",

          // Accent 2 — warm gold/amber (distant sun)
          solar: "#F5A623",
          "solar-dim": "#C47A0F",
          "solar-glow": "#FFD080",

          // Accent 3 — deep violet (nebula)
          violet: "#7B5EA7",
          "violet-bright": "#A87FD4",
          "violet-glow": "#C9A8FF",

          // Surface / glass
          glass: "rgba(255,255,255,0.03)",
          "glass-light": "rgba(255,255,255,0.06)",
          "glass-mid": "rgba(255,255,255,0.09)",
          "glass-heavy": "rgba(255,255,255,0.14)",
          "glass-border": "rgba(255,255,255,0.08)",
          "glass-border-bright": "rgba(168,200,255,0.18)",
        },

        // Shadcn tokens mapped to LUMINA
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.06)",
        ring: "#A8C8FF",
        background: "#020408",
        foreground: "#E8F0FF",
        primary: {
          DEFAULT: "#A8C8FF",
          foreground: "#020408",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#C8DCFF",
        },
        destructive: {
          DEFAULT: "#FF4444",
          foreground: "#F0F4FF",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.04)",
          foreground: "#7A9BC0",
        },
        accent: {
          DEFAULT: "rgba(168,200,255,0.08)",
          foreground: "#A8C8FF",
        },
        popover: {
          DEFAULT: "#061020",
          foreground: "#E8F0FF",
        },
        card: {
          DEFAULT: "rgba(6,16,32,0.80)",
          foreground: "#E8F0FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-syne)", ...fontFamily.sans],
        mono: ["var(--font-jetbrains-mono)", ...fontFamily.mono],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "lumina-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,200,255,0.15) 0%, transparent 60%)",
        "lumina-deep":
          "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(123,94,167,0.08) 0%, transparent 60%)",
        "glass-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
        "nebula-overlay":
          "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(123,94,167,0.12) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 30% 70%, rgba(168,200,255,0.06) 0%, transparent 50%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168,200,255,0.1), 0 0 40px rgba(168,200,255,0.05)" },
          "50%": { boxShadow: "0 0 40px rgba(168,200,255,0.25), 0 0 80px rgba(168,200,255,0.1)" },
        },
        "border-flow": {
          "0%, 100%": { borderColor: "rgba(168,200,255,0.1)" },
          "50%": { borderColor: "rgba(168,200,255,0.3)" },
        },
        "shine": {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(250%) skewX(-20deg)" },
        },
        "warp-out": {
          "0%": { opacity: "0", transform: "scaleX(0)" },
          "50%": { opacity: "1", transform: "scaleX(1)" },
          "100%": { opacity: "0", transform: "scaleX(3) translateY(-50vh)" },
        },
        "nebula-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.98)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-up": "fade-up 0.7s ease-out",
        "fade-down": "fade-down 0.7s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "scan-line": "scan-line 4s linear infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "border-flow": "border-flow 4s ease-in-out infinite",
        "shine": "shine 1.8s ease-in-out infinite",
        "warp-out": "warp-out 0.8s ease-in forwards",
        "nebula-drift": "nebula-drift 20s ease-in-out infinite",
      },
      boxShadow: {
        "glass": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-lg": "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-star": "0 0 30px rgba(168,200,255,0.15), 0 0 60px rgba(168,200,255,0.08)",
        "glow-star-lg": "0 0 60px rgba(168,200,255,0.25), 0 0 120px rgba(168,200,255,0.12)",
        "glow-solar": "0 0 30px rgba(245,166,35,0.2), 0 0 60px rgba(245,166,35,0.1)",
        "glow-violet": "0 0 30px rgba(123,94,167,0.2), 0 0 60px rgba(123,94,167,0.1)",
        "panel": "0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.6)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "expo-out": "cubic-bezier(0.19, 1, 0.22, 1)",
        "expo-in": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
