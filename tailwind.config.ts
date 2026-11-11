import type { Config } from "tailwindcss"

// La familia de SynrgStudio comparte un grafito y cada herramienta trae un
// solo color de acento. El estudio es el marco neutro: tinta clara, sin color.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#111214",
        panel: "#181a1d",
        "panel-2": "#1e2023",
        line: "#2b2d30",
        "line-strong": "#3d4044",
        ink: "#f0f0ed",
        body: "#c9cacb",
        muted: "#a3a4a6",
        faint: "#83878b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Fallback Arial", "Fallback Roboto", "Fallback DejaVu", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Cascadia Code", "Consolas", "monospace"],
      },
      maxWidth: {
        page: "1240px",
      },
    },
  },
  plugins: [],
}

export default config
