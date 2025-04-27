
import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        background: {
          DEFAULT: "#0C0D10",
          secondary: "#1A1E23",
        },
        foreground: {
          DEFAULT: "#E9EAEC",
          muted: "#8E8E93",
        },
        primary: {
          DEFAULT: "#38BD95", // Teal green
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6", // Blue
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EA384C", // Red for delete actions
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#222428",
          foreground: "#8E8E93",
        },
        accent: {
          DEFAULT: "#38BD95",
          foreground: "#FFFFFF",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.1)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        'subtle': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
