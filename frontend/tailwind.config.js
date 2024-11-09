// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E6FFFA',
          DEFAULT: '#38B2AC',
          dark: '#2C7A7B',
        },
        secondary: {
          light: '#FFF5F7',
          DEFAULT: '#ED64A6',
          dark: '#D53F8C',
        },
        background: '#F0FFF4',
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}