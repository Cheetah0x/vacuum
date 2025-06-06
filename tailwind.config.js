/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#6436b4",

        "dark-active-tab": "#d1c2ff",
        "dark-active-tab-strip": "#6d4ec7",

        "dark-link": "#a180ff",
        "dark-link-hover": "#b89fff",

        "dark-checkbox": "#7c5dde",
        "dark-checkbox-hover": "#8263e6",
      },
      backgroundImage: {
        "dark-btn": "linear-gradient(180deg, #6b56ba, #3c2a84)",
        "dark-btn-hover": "linear-gradient(180deg, hsl(253 42% 55% / 1), hsl(252 52% 36% / 1))",
      },
      keyframes: {
        "fadeIn": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scaleIn": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "screen-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        "fadeIn": "fadeIn 0.2s ease-out",
        "scaleIn": "scaleIn 0.3s ease-out",
        "screen-shake": "screen-shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite",
      },
    },
  },
  plugins: [],
}
