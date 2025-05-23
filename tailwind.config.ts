
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
          light: "#F8F9FA", // Added light background color for light theme
        },
        foreground: {
          DEFAULT: "#FFFFFF", 
          muted: "#B0B0B8",
          dark: "#222222", // Added dark foreground color for light theme text
        },
        card: {
          DEFAULT: "#1A1E23", // Card background color
          foreground: "#FFFFFF", // Card foreground color
          light: "#FFFFFF", // Light theme card background
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
          foreground: "#B0B0B8",
          light: "#E9ECEF", // Light theme muted background
        },
        accent: {
          DEFAULT: "#38BD95",
          foreground: "#FFFFFF",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.1)",
          light: "rgba(0,0,0,0.1)", // Added light theme border color
        },
        // Adding print-specific colors for track sheets
        print: {
          background: "#FFFFFF",
          text: "#000000",
          border: "#CCCCCC",
          header: "#F3F4F6",
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
