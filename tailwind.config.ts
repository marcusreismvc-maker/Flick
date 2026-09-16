import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base neutra (não branco/preto puro)
        surface: {
          DEFAULT: "#0F1117",
          raised: "#171A23",
          muted: "#1F2330",
        },
        ink: {
          DEFAULT: "#F4F5F7",
          muted: "#A3A7B7",
        },
        // Cores de destaque com significado fixo
        streak: {
          DEFAULT: "#FF6B35",
          glow: "#FF9A5A",
        },
        points: {
          DEFAULT: "#FFC53D",
          glow: "#FFE08A",
        },
        xp: {
          DEFAULT: "#7C5CFF",
          glow: "#A78BFA",
        },
        success: "#3DDC97",
        danger: "#FF5D5D",
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
