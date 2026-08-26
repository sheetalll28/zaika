/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        ink: "var(--ink)",
        saffron: "var(--saffron)",
        chili: "var(--chili)",
        "curry-leaf": "var(--curry-leaf)",
        cream: "var(--cream)",
        "cream-dim": "var(--cream-dim)",
      },
    },
    plugins: [],
  };