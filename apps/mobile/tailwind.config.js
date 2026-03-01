/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)'
      }
    }
  },
  plugins: []
};
