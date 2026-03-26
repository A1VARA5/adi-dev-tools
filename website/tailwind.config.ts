import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:          '#07090f',
        surface:     '#0d1117',
        card:        '#0f1623',
        border:      '#1a2235',
        'border-hi': '#2a3555',
        primary:     '#6366f1',
        'primary-dark': '#1e1b4b',
        accent:      '#06b6d4',
        'accent-dim':'#0a3340',
        green:       '#22c55e',
        yellow:      '#f59e0b',
        red:         '#ef4444',
        muted:       '#4a5568',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink':   'blink 1s steps(2, start) infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'glow':    'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          from: { boxShadow: '0 0 8px #6366f130' },
          to:   { boxShadow: '0 0 24px #6366f155' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
