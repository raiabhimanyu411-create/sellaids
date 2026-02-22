/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
        'heading': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}