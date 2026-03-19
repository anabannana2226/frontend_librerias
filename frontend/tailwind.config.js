/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        libreria: {
          madera: '#2C1810',
          madera_clara: '#4A3228',
          papel: '#F5F5DC',
          pergamino: '#E8D5B5',
          oro: '#D4AF37',
          primario: '#1E3A5F',
          secundario: '#8B4513',
        }
      },
      fontFamily: {
        'classic': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
