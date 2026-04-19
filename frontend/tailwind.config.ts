import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        // Dark OLED surface palette. "oria-*" names are preserved so
        // existing utility classes keep working; only the values flipped.
        oria: {
          bg: "#07070B",
          card: "rgba(255, 255, 255, 0.04)",
          "card-hover": "rgba(255, 255, 255, 0.065)",
          elevated: "rgba(255, 255, 255, 0.06)",
          section: "rgba(255, 255, 255, 0.03)",
          chip: "rgba(255, 255, 255, 0.07)",
          strong: "rgba(255, 255, 255, 0.14)",
        },
        text: {
          primary: "#F5F5F7",
          secondary: "#9CA0AC",
          muted: "#64697A",
          inverse: "#0B0B11",
        },
        accent: {
          purple: "#8B5CF6",
          "purple-bright": "#A78BFA",
          gold: "#F59E0B",
          sport: "#FC4C02",
        },
        success: {
          100: "rgba(16, 185, 129, 0.15)",
          500: "#10B981",
        },
        error: {
          100: "rgba(239, 68, 68, 0.15)",
          500: "#EF4444",
        },
        warning: {
          100: "rgba(245, 158, 11, 0.15)",
          500: "#F59E0B",
        },
      },
      borderColor: {
        oria: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          subtle: "rgba(255, 255, 255, 0.035)",
          strong: "rgba(255, 255, 255, 0.12)",
          focus: "#8B5CF6",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 48px rgba(139,92,246,0.18)",
        button: "0 8px 24px rgba(139, 92, 246, 0.4)",
        avatar: "0 4px 16px rgba(139, 92, 246, 0.35)",
        "gold-glow": "0 8px 28px rgba(245, 158, 11, 0.35)",
        "sport-glow": "0 8px 28px rgba(252, 76, 2, 0.35)",
      },
      spacing: {
        "4.5": "18px",
        "5.5": "22px",
      },
      transitionTimingFunction: {
        "oria-standard": "cubic-bezier(0.16, 1, 0.3, 1)",
        "oria-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
