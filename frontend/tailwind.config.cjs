// Tasty — Helle Cream-Palette mit echtem Gold + Bordeaux Akzenten
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FAF6EE",
          deep: "#F1E9DA",
          elevated: "#FFFFFF",
        },
        accent: {
          gold: "#C9A45C",
          "gold-soft": "#A8843E",
        },
        bordeaux: {
          DEFAULT: "#7A1E2A",
          deep: "#5C141F",
          soft: "#9A3540",
        },
        text: {
          cream: "#2A1A1C",
          muted: "#7A6A6C",
          faint: "#A89A9C",
        },
        border: {
          subtle: "#E5DBC8",
          strong: "#C9A45C",
          gold: "#C9A45C",
        },
        brand: {
          DEFAULT: "#7A1E2A",
          dark: "#5C141F",
          accent: "#C9A45C",
          soft: "#FAF6EE",
          ink: "#2A1A1C",
          muted: "#7A6A6C",
          success: "#7A9E7E",
        },
      },
      fontFamily: {
        script: ["var(--font-pacifico)", "cursive"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.15em",
        widest2: "0.3em",
      },
      boxShadow: {
        phone:
          "0 50px 100px -20px rgba(0,0,0,0.55), 0 30px 60px -30px rgba(0,0,0,0.6)",
        soft: "0 1px 2px rgba(42,26,28,0.04), 0 4px 12px rgba(42,26,28,0.04)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "fade-in-slow": "fadeIn 1.2s ease-out both",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "page-in": "pageIn 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        "splash-in": "splashIn 1.5s ease-out both",
        "splash-out": "fadeOut 0.6s ease-in forwards",
        "rule-in": "ruleIn 0.9s ease-out 0.4s both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pageIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        splashIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        ruleIn: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
