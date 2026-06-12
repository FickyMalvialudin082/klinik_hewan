/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          teal: {
            50: '#f0fbfb',
            100: '#d5f4f4',
            200: '#aee9e9',
            500: '#14b8a6', // Hijau toska primary
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#38bdf8', // Biru muda
            600: '#0284c7',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            500: '#f97316', // Orange lembut
            600: '#ea580c',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6', // Abu muda
            200: '#e5e7eb',
          }
        }
      }
    },
  },
  plugins: [],
}
