// VARIANTE B: "Modernes Grau"
// Leichtes Grau (#F8F8F8) Basis, Bordeaux + Gold Akzente
// Modern & minimalistisch

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
          primary: "#F8F8F8",   // Leichtes Grau
          deep: "#E8E8E8",      // Dunkleres Grau
          elevated: "#FFFFFF",  // Weiß
        },
        accent: {
          gold: "#D4A574",      // Gold bleibt
          "gold-soft": "#B8915F", // Soft Gold
        },
        text: {
          cream: "#2D0A0F",     // Bordeaux für Text auf hellem Grund
          muted: "#5D5047",     // Muted Braun
          faint: "#8A7E68",     // Faint
        },
        // legacy aliases
        brand: {
          DEFAULT: "#D4A574",   // Gold
          dark: "#B8915F",      // Soft Gold
          accent: "#D4A574",    // Gold
          soft: "#2D0A0F",      // Bordeaux
          ink: "#2D0A0F",       // Bordeaux für Text
          muted: "#5D5047",     // Muted
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
