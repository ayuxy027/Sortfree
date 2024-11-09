// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f9',
          100: '#dcf2f3',
          200: '#bce7e8',
          300: '#8fd6d8',
          400: '#5cbec1',
          500: '#3ea4a7',
          600: '#358589',
          700: '#2f6c70',
          800: '#2b595c',
          900: '#274b4e',
          950: '#143133',
        },
        secondary: {
          50: '#f6f7f9',
          100: '#ebeef3',
          200: '#d5dce6',
          300: '#b3c1d1',
          400: '#8ba0b7',
          500: '#6d84a1',
          600: '#586b87',
          700: '#49596f',
          800: '#3f4b5d',
          900: '#37414f',
          950: '#252b35',
        },
        ambient: {
          50: '#f4f6f8',
          100: '#e8ecf1',
          200: '#d1dbe3',
          300: '#b0c2d0',
          400: '#89a2b8',
          500: '#6d86a1',
          600: '#5b6f89',
          700: '#4d5c71',
          800: '#434f60',
          900: '#3b4452',
          950: '#272c35',
        },
        background: {
          light: '#f8fafc',  // Softer white
          dark: '#1a1f2a',   // Warmer dark
        },
        surface: {
          light: '#ffffff',
          dark: '#212836',
        },
        text: {
          light: {
            primary: '#334155',    // Softer than pure black
            secondary: '#64748b',   // Muted text
            tertiary: '#94a3b8',   // Even more muted
          },
          dark: {
            primary: '#e2e8f0',    // Not pure white
            secondary: '#94a3b8',   // Muted light
            tertiary: '#64748b',    // More muted light
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'ambient-sm': '0px 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'ambient': '0px 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'ambient-lg': '0px 8px 24px -6px rgba(0, 0, 0, 0.12)',
        'ambient-dark': '0px 4px 16px -4px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'noise-light': "url('/noise-light.png')",
        'noise-dark': "url('/noise-dark.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}