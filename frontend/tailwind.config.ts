export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0000', // YouTube red
          dark: '#CC0000',
        },
        secondary: {
          DEFAULT: '#1C1C1E', // dark backgrounds
          light: '#F9F9F9',   // light backgrounds
        },
        accent: {
          DEFAULT: '#FF0000', // hover highlights
        },
        grayCustom: {
          50: '#FAFAFA',
          100: '#F2F2F2',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.05)',
      },
    },
  },
}
