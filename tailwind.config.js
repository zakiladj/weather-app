/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // --- Brand ---
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

        // --- Weather condition accent colours ---
        weather: {
          sunny: '#FCD34D',
          cloudy: '#94A3B8',
          rainy: '#60A5FA',
          stormy: '#6366F1',
          snowy: '#E2E8F0',
          drizzle: '#7DD3FC',
          mist: '#CBD5E1',
          fog: '#CBD5E1',
        },

        // --- Sky palette (gradient stops, exposed as utilities) ---
        sky: {
          dawn: '#FF9A5C',
          sunrise: '#FFCF77',
          morning: '#74C0FC',
          noon: '#3B82F6',
          afternoon: '#F97316',
          dusk: '#C026D3',
          twilight: '#6D28D9',
          night: '#0F172A',
          midnight: '#020617',
        },

        // --- Glassmorphism surface colours ---
        glass: {
          light: 'rgba(255,255,255,0.55)',
          'light-border': 'rgba(255,255,255,0.35)',
          dark: 'rgba(15,23,42,0.45)',
          'dark-border': 'rgba(255,255,255,0.12)',
          white10: 'rgba(255,255,255,0.10)',
          white20: 'rgba(255,255,255,0.20)',
          white30: 'rgba(255,255,255,0.30)',
          white50: 'rgba(255,255,255,0.50)',
          black10: 'rgba(0,0,0,0.10)',
          black20: 'rgba(0,0,0,0.20)',
          black30: 'rgba(0,0,0,0.30)',
          black50: 'rgba(0,0,0,0.50)',
        },

        // --- Semantic surface tokens ---
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          dark: '#0F172A',
          'dark-secondary': '#1E293B',
          'dark-tertiary': '#334155',
        },

        // --- Text tokens ---
        content: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
          inverse: '#FFFFFF',
          'inverse-secondary': 'rgba(255,255,255,0.75)',
          'inverse-tertiary': 'rgba(255,255,255,0.50)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        rounded: ['SF Pro Rounded', 'ui-rounded', 'sans-serif'],
        display: ['SF Pro Display', 'ui-sans-serif', 'system-ui'],
      },

      fontSize: {
        // iOS-inspired type scale
        'display': [96, { lineHeight: '96', fontWeight: '200', letterSpacing: '-4' }],
        'large-title': [34, { lineHeight: '41', fontWeight: '700', letterSpacing: '0.4' }],
        'title-1': [28, { lineHeight: '34', fontWeight: '700', letterSpacing: '0.3' }],
        'title-2': [22, { lineHeight: '28', fontWeight: '700', letterSpacing: '0.3' }],
        'title-3': [20, { lineHeight: '25', fontWeight: '600', letterSpacing: '0.3' }],
        'headline': [17, { lineHeight: '22', fontWeight: '600', letterSpacing: '-0.4' }],
        'body': [17, { lineHeight: '22', fontWeight: '400', letterSpacing: '-0.4' }],
        'callout': [16, { lineHeight: '21', fontWeight: '400', letterSpacing: '-0.3' }],
        'subheadline': [15, { lineHeight: '20', fontWeight: '400', letterSpacing: '-0.2' }],
        'footnote': [13, { lineHeight: '18', fontWeight: '400', letterSpacing: '-0.1' }],
        'caption-1': [12, { lineHeight: '16', fontWeight: '400', letterSpacing: '0' }],
        'caption-2': [11, { lineHeight: '13', fontWeight: '400', letterSpacing: '0.07' }],
      },

      borderRadius: {
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },

      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
      },

      opacity: {
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
        '35': '0.35',
        '55': '0.55',
        '65': '0.65',
        '85': '0.85',
        '95': '0.95',
      },
    },
  },
  plugins: [],
};
