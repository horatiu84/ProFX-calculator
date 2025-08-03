
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  extend: {
  keyframes: {
    shimmer: {
      '0%': { borderColor: '#FFD700' },
      '50%': { borderColor: '#fffbe6' },
      '100%': { borderColor: '#FFD700' },
    },
  },
  animation: {
    shimmer: 'shimmer 2s ease-in-out infinite',
  },
}

}

