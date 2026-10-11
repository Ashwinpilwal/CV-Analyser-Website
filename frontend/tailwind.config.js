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
        canvas: {
          DEFAULT: 'var(--canvas-bg)',
          subtle: 'var(--canvas-subtle)',
        },
        surface: {
          DEFAULT: 'var(--surface-bg)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
          border: 'var(--surface-border)',
          'border-light': 'var(--surface-border)',
        },
        accent: {
          sage: {
            DEFAULT: '#4ade80',
            muted: '#2a4d38',
            dim: '#182b20',
            text: '#86efac',
          },
          amber: {
            DEFAULT: '#f59e0b',
            muted: '#4a3b22',
            dim: '#2a2215',
            text: '#fcd34d',
          },
          rose: {
            DEFAULT: '#f87171',
            muted: '#4f2b2b',
            dim: '#2d1818',
            text: '#fca5a5',
          },
          cyan: {
            DEFAULT: '#38bdf8',
            muted: '#1e3a4a',
            dim: '#10222d',
            text: '#7dd3fc',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle-card': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'elevated-card': '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
