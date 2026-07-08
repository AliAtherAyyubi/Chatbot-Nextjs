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
        poppins: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        obsidian: "#0A0A0F",
        void: "#111118",
        surface: "#16161F",
        elevated: "#1E1E2E",
        overlay: "#252535",
        border: "#2A2A3E",
        violet: { DEFAULT: "#7C3AED", hover: "#8B5CF6" },
        cyan: "#22D3EE",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
