/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#060d1f',
          800: '#0a1628',
          700: '#0d1b36',
          600: '#112043',
          500: '#1a2a4a',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1e3a8a',
        },
        purple: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
        },
        electric: '#60A5FA',
        'brand-gold': '#F59E0B',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan-line 4s linear infinite',
        'grid-breathe': 'grid-fade 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'grid-fade': {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'morph': {
          '0%, 100%': { borderRadius: '40% 60% 70% 30% / 40% 40% 60% 50%' },
          '34%': { borderRadius: '70% 30% 50% 50% / 30% 30% 70% 70%' },
          '67%': { borderRadius: '100% 60% 60% 100% / 100% 100% 60% 60%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.1) 0%, transparent 60%), linear-gradient(180deg, #030712 0%, #060d1f 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(59,130,246,0.2), 0 0 80px rgba(59,130,246,0.08)',
        'glow-sm': '0 0 20px rgba(59,130,246,0.25)',
        'glow-lg': '0 0 60px rgba(59,130,246,0.35), 0 8px 32px rgba(0,0,0,0.5)',
        'glow-cyan': '0 0 30px rgba(6,182,212,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.2)',
        'button': '0 4px 20px rgba(59,130,246,0.4)',
        'button-hover': '0 8px 30px rgba(59,130,246,0.6)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
      },
    },
  },
  plugins: [],
}