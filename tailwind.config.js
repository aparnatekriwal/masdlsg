/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#131921',
        'navy-light': '#232f3e',
        'amazon-yellow': '#ffd814',
        'amazon-yellow-hover': '#f7ca00',
        'amazon-orange': '#fa8900',
        'amazon-orange-hover': '#e47911',
        'bank-blue': '#0066b3',
        'bank-blue-light': '#e8f4fd',
        'bank-header': '#003d6b',
        'bank-success': '#00a651',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
