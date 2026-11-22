/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        nyra: {
          canvas: "#FFFFFF",
          surface: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F1F5F9",
          border: "#E2E8F0",
          accent: "#2177D1",
          bright: "#3A8EE0",
          dark: "#1658A8",
          tint: "#EFF6FF",
          danger: "#DC2626",
          warning: "#D97706",
          success: "#059669",
        },
      },
    },
  },
  plugins: [],
};
