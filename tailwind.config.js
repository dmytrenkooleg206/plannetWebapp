/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      gray: {
        DEFAULT: '#686C71',
        333: '#333333',
        26: '#262626',
        15: '#151515',
        10: '#0A0A0A',
        158: '#F8F8F8',
        666: '#666666',
        212: '#2C2C2C',
        113: '#1D1D1D',
        814: '#8E8E8E',
      },
      primary: {
        DEFAULT: '#7440f5',
        100: 'rgba(116,64,245, 0.1)',
        200: '#C7B0FF',
      },
      black: {
        DEFAULT: '#000000',
        000: 'rgba(0, 0, 0, 0)',
        100: 'rgba(0, 0, 0, 0.1)',
        200: 'rgba(0, 0, 0, 0.2)',
        300: 'rgba(0, 0, 0, 0.3)',
        400: 'rgba(0, 0, 0, 0.4)',
        500: 'rgba(0, 0, 0, 0.5)',
        600: 'rgba(0, 0, 0, 0.6)',
        700: 'rgba(0, 0, 0, 0.7)',
        800: 'rgba(0, 0, 0, 0.8)',
        900: 'rgba(0, 0, 0, 0.9)',
      },
      white: {
        DEFAULT: 'rgb(255, 255, 255)',
        100: 'rgba(255, 255, 255, 0.1)',
        150: 'rgba(255, 255, 255, 0.15)',
        200: 'rgba(255, 255, 255, 0.2)',
        300: 'rgba(255, 255, 255, 0.3)',
        400: 'rgba(255, 255, 255, 0.4)',
        500: 'rgba(255, 255, 255, 0.5)',
        600: 'rgba(255, 255, 255, 0.6)',
        700: 'rgba(255, 255, 255, 0.7)',
        800: 'rgba(255, 255, 255, 0.8)',
        900: 'rgba(255, 255, 255, 0.9)',
      },
      blue: {
        DEFAULT: '#1474E2',
        100: '#0036a3',
        900: '#d4dffa',
      },
      red: {
        DEFAULT: '#FF4D42',
      },
      redLight: {
        DEFAULT: '#FF6767',
        100: 'rgba(255, 103, 103, 0.1)',
      },
      green: {
        DEFAULT: '#2CA251',
        100: '#0F7E32',
      },
    },
    extend: {},
  },
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
};
