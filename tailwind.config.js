/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        weather: {
          sunny: '#FCD34D',
          cloudy: '#94A3B8',
          rainy: '#60A5FA',
          stormy: '#6366F1',
          snowy: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        rounded: ['SF Pro Rounded', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
