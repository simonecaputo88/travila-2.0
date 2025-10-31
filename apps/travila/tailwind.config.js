/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        travila: {
          blue: "#2563eb",  // Primario
          orange: "#fb923c",// Accento
          bgL: "#F3F8FF",
          bgR: "#FFF6EE"
        }
      },
      borderRadius: { '2xl': '1.25rem' }
    },
  },
  plugins: [],
}
