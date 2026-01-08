/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fedexPurple: "#4D148C", // Official FedEx Branding
        fedexOrange: "#FF6200",
        enterpriseGray: "#F2F2F2"
      },
    },
  },
  plugins: [],
}