/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./components/**/*.{tsx}",
    "./src/**/*.{tsx,ts}",
    "./**/*.{tsx,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gray: {
          750: '#2d3748',
          850: '#1a202c',
          950: '#171923',
        }
      }
    }
  },
  plugins: [],
}