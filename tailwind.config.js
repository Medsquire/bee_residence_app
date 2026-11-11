/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // White & Blue Theme Palette
        navy: {
          50: '#F0F6FF',
          100: '#E0EDFE',
          200: '#BAE0FD',
          300: '#7DC4FB',
          400: '#38A4F7',
          500: '#0E85EC',
          600: '#0267CA',
          700: '#0352A3',
          800: '#074585',
          900: '#0A396E',
          950: '#08254A'
        },
        // Re-routed bee palette to clean electric and sapphire blues so any legacy references become white & blue
        bee: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.78)',
          'white-hover': 'rgba(255, 255, 255, 0.92)',
          border: 'rgba(255, 255, 255, 0.85)',
          blue: 'rgba(37, 99, 235, 0.08)',
          'blue-border': 'rgba(147, 197, 253, 0.45)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(37, 99, 235, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 25px -5px rgba(37, 99, 235, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-lg': '0 14px 40px -4px rgba(37, 99, 235, 0.12), 0 6px 16px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -3px rgba(37, 99, 235, 0.35)',
        'glow-sky': '0 0 25px -3px rgba(56, 189, 248, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '32px'
      }
    },
  },
  plugins: [],
}
