import type { Config } from 'tailwindcss';

// Colors are exposed as CSS variables (see src/index.css) so each client
// deployment can override the palette from a single place: src/config/theme.config.ts.
// Tailwind reads the variables here — component code never hardcodes hex values.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          soft: 'rgb(var(--color-text-soft) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          alt: 'rgb(var(--color-surface-alt) / <alpha-value>)',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Jost"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        brand: 'var(--radius)',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgb(0 0 0 / 0.04), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
        card: '0 4px 16px -4px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.05)',
        lift: '0 20px 40px -12px rgb(0 0 0 / 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '12%': { opacity: 'var(--particle-opacity, 1)' },
          '88%': { opacity: 'var(--particle-opacity, 1)' },
          '100%': { transform: 'translateY(-115vh) translateX(var(--particle-drift, 16px))', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 34s linear infinite',
        shine: 'shine 5s linear infinite',
        'float-up': 'float-up 8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
