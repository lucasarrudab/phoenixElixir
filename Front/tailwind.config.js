/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D3748',
          850: '#1A202C',
          900: '#171923',
          950: '#0D1117',
        },
        purple: {
          300: '#B794F4',
          400: '#9F7AEA',
          500: '#805AD5',
          600: '#6B46C1',
          700: '#553C9A',
          800: '#44337A',
          900: '#322659',
        },
      },
      boxShadow: {
        'purple-glow': '0 0 15px -3px rgba(128, 90, 213, 0.2)',
      },
    },
  },
  plugins: [],
};