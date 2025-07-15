// Конфигурация цветов и стилей для VPEsports
const VPEsportsConfig = {
  // Основные цвета бренда
  colors: {
    primary: '#FF4655',
    primaryHover: '#FF6B75',
    secondary: '#2A2A2A',
    secondaryHover: '#3A3A3A',
    background: '#0F0F0F',
    backgroundLight: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    
    // Цвета статусов
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Цвета команд
    teamBlue: '#4A90E2',
    teamOrange: '#F5A623',
    teamPurple: '#7B68EE',
    teamGreen: '#50E3C2',
    
    // Градиенты
    gradientStart: '#FF4655',
    gradientEnd: '#FF6B75',
  },
  
  // Настройки типографики
  typography: {
    fontPrimary: 'Inter, system-ui, sans-serif',
    fontHeading: 'Orbitron, system-ui, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
    
    // Размеры шрифтов
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    }
  },
  
  // Настройки анимации
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  
  // Настройки компонентов
  components: {
    // Кнопки
    button: {
      borderRadius: '0.5rem',
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      }
    },
    
    // Карточки
    card: {
      borderRadius: '0.75rem',
      padding: '1.5rem',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    },
    
    // Формы
    input: {
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      borderWidth: '1px',
    }
  },
  
  // Настройки сетки и отступов
  layout: {
    container: {
      maxWidth: '1200px',
      padding: '0 1rem',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    }
  },
  
  // Настройки для WordPress интеграции
  wordpress: {
    // Префиксы для CSS классов
    cssPrefix: 'vpe-',
    
    // Настройки для кастомных полей
    customFields: {
      teamLogo: 'team_logo',
      matchDate: 'match_date',
      matchStatus: 'match_status',
      streamLink: 'stream_link',
    },
    
    // Настройки для постов
    postTypes: {
      matches: 'matches',
      tournaments: 'tournaments',
      teams: 'teams',
      players: 'players',
    }
  },
  
  // API endpoints (для будущего использования)
  api: {
    baseUrl: '/wp-json/vpe/v1/',
    endpoints: {
      matches: 'matches',
      tournaments: 'tournaments',
      teams: 'teams',
      players: 'players',
      news: 'news',
    }
  }
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VPEsportsConfig;
}

// Глобальная доступность в браузере
if (typeof window !== 'undefined') {
  window.VPEsportsConfig = VPEsportsConfig;
} 