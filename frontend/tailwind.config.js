/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
    colors: {
      'fiona-light-green' : '#bfd4b6',
      'fiona-dark-green'  : '#607258'
      },
      fontFamily: {
        cardo: ["Cardo", "sans-serif"],
      },
    },
  },
  plugins: [],
}

