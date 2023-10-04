/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: "class",
  theme: {
    fontFamily: {
      lato: ["Lato-Regular", "sans-serif"],
      mina: ["Mina-Bold", "sans-serif"],
    },
    extend: {
      colors: {
        // primary
        bapt_black: "#121919",
        bapt_green: "#2dd8a7",
        bapt_subgreen: "#085c3f",
        bapt_darkblue: "#15222c",
        bapt_tableZebra1: "#1E2929",
        off_white: "#ECEEED",
        off_black: "#1E2929",
        darkgray: "#404040",
        gray: "#878787",
        blob_green: "#2dd8a7",
        blob_blue: "#34d8ea",
      },
      textShadow: {
        "9xl": "8px 8px 18px #000000;",
      },
      keyframes: {
        orbFloat1: {
          "0%": { transform: "translatey(0px)" },
          "50%": { transform: "translate(15px, -20px)" },
          "100%": { transform: "translatey(0px)" },
        },
        orbFloat2: {
          "0%": { transform: "translatey(0px)" },
          "50%": { transform: "translate(-15px, -30px)" },
          "100%": { transform: "translatey(0px)" },
        },
      },
      animation: {
        "orbfloat-1": "orbFloat1 8s ease-in-out infinite",
        "orbfloat-2": "orbFloat2 16s ease-in-out infinite",
      },
      screens: {
        "2xs": "320px",
        "3xl": "1900px",
        "4xl": "2450px",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-inner-border"),
    require("tailwindcss-textshadow"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#085c3f",
          "primary-focus": "#085c3f",
          "primary-content": "#ffffff",
          secondary: "#2dd8a7",
          "secondary-focus": "#bd0091",
          "secondary-content": "#ffffff",
          accent: "#085c3f",
          "accent-focus": "#085c3f",
          "accent-content": "#ffffff",
          neutral: "#1E2929",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ECEEED",
          "base-100": "#1E2929",
          "base-200": "#121919",
          "base-300": "#d1d5db",
          "base-content": "#ECEEED",
          info: "#085c3f",
          success: "#009485",
          warning: "#eab208",
          error: "#ff5724",
        },
      },
    ],
  },
};
