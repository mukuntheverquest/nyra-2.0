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
          void: "#0B0E14",
          surface: "#121620",
          border: "#383E4E",
          subtle: "rgba(182, 186, 197, 0.14)",
          accent: "#2177D1",
          bright: "#3A8EE0",
          dark: "#1658A8",
          cyan: "#5BA3EC",
          amber: "#C39A35",
          red: "#D04040",
          green: "#34C759",
        },
      },
    },
  },
  plugins: [],
};
