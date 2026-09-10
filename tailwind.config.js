/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B2D48",
        gold: "#F7C344",
        teal: "#1C7C54",
        coral: "#C0392B",
        offwhite: "#F5F5F0",
      },
    },
  },
  plugins: [],
};
