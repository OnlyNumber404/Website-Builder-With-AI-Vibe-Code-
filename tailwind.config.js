/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-slate': '#0f172a',
        'electric-blue': '#2563eb',
        'clean-white': '#ffffff',
        'subtle-gray': '#f8fafc',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Electric blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        slate: {
          850: '#131f37',
          900: '#0f172a', // Deep slate
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 0 35px -5px rgba(37, 99, 235, 0.15)',
        'card-subtle': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'float-button': '0 10px 25px -3px rgba(15, 23, 42, 0.25)',
      }
    },
  },
  plugins: [],
}
