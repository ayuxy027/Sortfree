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
          500: '#3ba4a7',
          600: '#308589',
          700: '#296c6f',
          800: '#25595c',
          900: '#204b4d',
          950: '#0c2f30',
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
          950: '#222b35',
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
          950: '#242c35',
        },
        background: {
          light: '#f9fafc',  // Even softer white
          dark: '#171b24',   // Richer dark
        },
        surface: {
          light: '#ffffff',
          dark: '#1e2432',
        },
        text: {
          light: {
            primary: '#313e51',    // Richer than before
            secondary: '#5e7088',   // Improved contrast
            tertiary: '#8b9cb3',   // Better tertiary
          },
          dark: {
            primary: '#e6ecf4',    // Slightly warmer
            secondary: '#9aabc2',   // Better mid-tone
            tertiary: '#6c8099',    // Improved low-contrast
          },
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
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
        'ambient': '0px 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'ambient-lg': '0px 8px 24px -6px rgba(0, 0, 0, 0.1)',
        'ambient-dark': '0px 4px 16px -4px rgba(0, 0, 0, 0.15)',
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