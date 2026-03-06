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
        oria: {
          bg: "#faf9ff",
          card: "rgba(255, 255, 255, 0.85)",
          "card-hover": "rgba(255, 255, 255, 0.95)",
          elevated: "#ffffff",
          section: "rgba(237, 233, 254, 0.3)",
        },
        text: {
          primary: "#1e1b4b",
          secondary: "#6b7280",
          muted: "#9ca3af",
        },
        success: {
          100: "#dcfce7",
          500: "#10b981",
        },
        error: {
          100: "#fee2e2",
          500: "#ef4444",
        },
        warning: {
          100: "#fef9c3",
          500: "#f59e0b",
        },
      },
      borderColor: {
        oria: {
          DEFAULT: "rgba(196, 181, 253, 0.2)",
          subtle: "rgba(196, 181, 253, 0.1)",
          focus: "#7c3aed",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 40px rgba(124, 58, 237, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)",
        button: "0 4px 20px rgba(124, 58, 237, 0.3)",
        avatar: "0 2px 12px rgba(124, 58, 237, 0.25)",
      },
      spacing: {
        "4.5": "18px",
        "5.5": "22px",
      },
      transitionTimingFunction: {
        "oria-standard": "cubic-bezier(0.16, 1, 0.3, 1)",
        "oria-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
