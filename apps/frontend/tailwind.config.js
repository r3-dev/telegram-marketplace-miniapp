/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tg-bg': 'var(--tg-theme-bg-color)',
        'tg-bg-secondary': 'var(--tg-theme-secondary-bg-color)',
        'tg-text': 'var(--tg-theme-text-color)',
        'tg-hint': 'var(--tg-theme-hint-color)',
        'tg-link': 'var(--tg-theme-link-color)',
        'tg-btn': 'var(--tg-theme-button-color)',
        'tg-btn-txt': 'var(--tg-theme-button-text-color)'
      }
    }
  },
  plugins: []
}
