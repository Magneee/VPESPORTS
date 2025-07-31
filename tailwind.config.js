/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./pages/*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // Основные цвета бренда
        'brand-red': '#FF2C2C',
        'brand-dark': '#1A1A1A',
        'brand-darker': '#0E0E10',
        'brand-gray': '#1B1B1E',
        'brand-light-gray': '#1B1B1E',
        'brand-yellow': '#FFC107',
        'brand-accent': '#FF6B75',
        'brand-dark-gray': '#171719',
        'brand-tags-bg': '#29292A',
        'brand-border-dark': '#FFFFFF',
        'brand-bg-dark': '#FFFFFF',

        // Цвета для статусов
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
        
        // Цвета для команд
        'team-blue': '#4A90E2',
        'team-orange': '#F5A623',
        'team-purple': '#7B68EE',
        'team-green': '#50E3C2',
        'team-gray': '#EEEEEE',
        'team-red-2': '#FF2C2C',
        'team-red-1': '#FF0000',
        
        'tag-legendary': '#D83BD8',
        'tag-new': '#0CC70C',
        'tag-popular': '#FFC107',
        'tag-top': '#FF2C2C',
        'tag-free': '#00B9FF',
        'tag-bonus': '#FF9900',
        
        // Градиенты
        'gradient-start': '#FF4655',
        'gradient-end': '#FF6B75',
      },
      fontFamily: {
        'primary': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Furore', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'furore': ['Furore', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '15px' }],
        'sm': ['0.875rem', { lineHeight: '1.0625rem' }],
        'base': ['1rem', { lineHeight: '19px' }],
        'lg': ['1.125rem', { lineHeight: '1.5625rem' }],
        'xl': ['1.25rem', { lineHeight: '100%' }],
        'xl-2': ['1.375rem', { lineHeight: '140%' }],
        '2xl': ['1.5rem', { lineHeight: '140%' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '3.5xl': ['2rem', { lineHeight: '2.4375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      maxHeight: {
        '8xl': '85rem',
      },
      maxWidth: {
        '8xl': '85rem', // 1360px
      },
      spacing: {
        '18': '4.5rem',
        '25': '25px',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem', 
        '3xl': '2rem', // 32px

      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 70, 85, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 70, 85, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 70, 85, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      letterSpacing: {
        tightest: '-0.03em',
        tight: '-0.02em',
        tightestLg: '-0.01em',
      },
    },
  },
  plugins: [],
} 