import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'check-pop':  'checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up':   'slideUp 0.25s ease-out',
        'celebrate':  'celebrate 0.5s ease-out',
      },
      keyframes: {
        checkPop: {
          '0%':   { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        celebrate: {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(1.04)' },
          '70%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
