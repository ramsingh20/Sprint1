import { mtConfig } from "@material-tailwind/react";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // background: "var(--bg)",
        // foreground: "var(--text)",
         background: "var(--background)",
         foreground: "var(--foreground)",
         // card: "var(--card)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // borderColor: "var(--border)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // background: "var(--background)",
        // foreground: "var(--foreground)",
      },
    },
  },

  plugins: [mtConfig],
};