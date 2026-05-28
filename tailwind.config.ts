import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'soft-beige': 'rgb(var(--color-soft-beige) / <alpha-value>)',
        'warm-gray': 'rgb(var(--color-warm-gray) / <alpha-value>)',
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)',
        champagne: 'rgb(var(--color-champagne) / <alpha-value>)',
        ink: '#17130f',
        parchment: '#fffaf2',
        clay: '#80664f',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'slow-zoom': 'slowZoom 18s ease-in-out infinite alternate',
        'sheen': 'sheen 3.8s ease-in-out infinite',
        'line-draw': 'lineDraw 1.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.045)' },
        },
        sheen: {
          '0%, 35%': { transform: 'translateX(-120%)' },
          '80%, 100%': { transform: 'translateX(140%)' },
        },
        lineDraw: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
