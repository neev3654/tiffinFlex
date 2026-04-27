/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'espresso': 'rgb(var(--color-espresso) / <alpha-value>)',
        'cocoa': 'rgb(var(--color-cocoa) / <alpha-value>)',
        'gold': {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          light: 'rgb(var(--color-gold-light) / <alpha-value>)',
        },
        'offwhite': 'rgb(var(--color-offwhite) / <alpha-value>)',
        'warm-grey': 'rgb(var(--color-warm-grey) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}