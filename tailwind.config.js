/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#070b14",
          800: "#0b1322",
          700: "#0f1b2e",
          600: "#13243c",
        },
        // themed via CSS variables (see index.css :root / .theme-bright)
        cyan: {
          glow: "rgb(var(--accent-rgb) / <alpha-value>)",
        },
        panel: "rgb(var(--panel-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 18px rgba(62, 231, 255, 0.25)",
        "glow-strong": "0 0 28px rgba(62, 231, 255, 0.45)",
      },
      keyframes: {
        gridpan: {
          "0%": { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "48px 48px, 48px 48px" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.35)", opacity: "0.35" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        gridpan: "gridpan 24s linear infinite",
        pulseDot: "pulseDot 2.4s ease-in-out infinite",
        dash: "dash 2.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
