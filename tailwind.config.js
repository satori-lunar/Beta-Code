/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d5d1',
          300: '#f4b5ad',
          400: '#ec8b7f',
          500: '#e06b5c',
          600: '#cc4a3c',
          700: '#ab3c30',
          800: '#8d352c',
          900: '#76322a',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd5cd',
          300: '#ffb5a6',
          400: '#ff8a72',
          500: '#f86f4d',
          600: '#e54d2a',
          700: '#c03d1e',
          800: '#9e351c',
          900: '#83311d',
        },
        sage: {
          50: '#f4f9f4',
          100: '#e6f2e6',
          200: '#cde5ce',
          300: '#a5d0a7',
          400: '#76b378',
          500: '#529756',
          600: '#3f7a42',
          700: '#346136',
          800: '#2d4e2f',
          900: '#264128',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        cream: {
          50: '#fefdfb',
          100: '#fcf9f3',
          200: '#f9f3e7',
          300: '#f4e8d4',
          400: '#edd9bb',
          500: '#e4c89f',
          600: '#d4ae78',
          700: '#c0915a',
          800: '#a0764a',
          900: '#84623f',
        },
        wellness: {
          pink: '#f8b4b4',
          peach: '#fcd5ce',
          mint: '#d8f3dc',
          lavender: '#e2d5f1',
          sky: '#bde0fe',
          sand: '#f5ebe0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 40px -15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
