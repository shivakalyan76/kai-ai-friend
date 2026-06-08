/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#0A0C12',
        surface: '#12151F',
        surface2: '#1A1E2E',
        surface3: '#222840',
        accent: '#7C6EFA',
        accent2: '#9B8FFB',
        accent3: '#5B50D6',
        teal: '#4DD0B8',
        pink: '#F06292',
        amber: '#FFB74D',
        border: 'rgba(255,255,255,0.07)',
        border2: 'rgba(255,255,255,0.12)',
        text1: '#F0F2FF',
        text2: '#8B92B8',
        text3: '#555D7A',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.2s ease',
        'pop-in': 'popIn 0.2s ease',
        'bounce-dot': 'bounceDot 1.2s ease infinite',
        'status-pulse': 'statusPulse 2s ease infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        bounceDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
