# 📱 Руководство по разработке мобильной версии

## 🎯 Обзор системы

Была создана комплексная система для разработки мобильной версии сайта с поддержкой тем. Система включает:

### 📁 Новые файлы
- `assets/css/custom.css` - Основной файл для кастомных стилей и мобильной адаптации
- `assets/js/theme-manager.js` - Управление темами (светлая/темная)
- `assets/js/mobile-navigation.js` - Мобильная навигация с гамбургер меню

## 🎨 Система тем

### CSS переменные
Все цвета теперь управляются через CSS переменные в файле `custom.css`:

```css
:root {
  --bg-primary: #171719;      /* Основной фон */
  --bg-secondary: #222224;    /* Вторичный фон */
  --text-primary: #ffffff;    /* Основной текст */
  --brand-red: #FF2C2C;       /* Брендовый красный */
  /* и другие... */
}

[data-theme="light"] {
  --bg-primary: #ffffff;      /* Светлая тема */
  --text-primary: #212529;
  /* переопределения для светлой темы */
}
```

### Использование кастомных классов
Вместо изменения Tailwind классов используйте кастомные классы:

```html
<!-- Вместо class="bg-gray-900" -->
<div class="bg-custom-primary">

<!-- Вместо class="text-white" -->
<div class="text-custom-primary">

<!-- Вместо class="border-gray-600" -->
<div class="border-custom-primary">
```

### Переключение темы
Кнопка переключения темы автоматически работает для всех элементов с атрибутом `data-theme-toggle`:

```html
<button data-theme-toggle>Сменить тему</button>
```

## 📱 Мобильная адаптация

### Брейкпоинты
- До 768px - мобильная версия
- От 769px - десктопная версия

### Кастомные утилитарные классы для мобильных
```css
.mobile-hidden         /* Скрыть на мобильных */
.mobile-only          /* Показать только на мобильных */
.mobile-container     /* Мобильные отступы контейнера */
.mobile-text-sm       /* Мобильные размеры текста */
.mobile-mt-4          /* Мобильные отступы */
```

### Мобильная навигация
Автоматически создается мобильная шапка с:
- Логотипом
- Гамбургер меню
- Выпадающим меню со всеми ссылками

## 🛠 Как разрабатывать мобильную версию

### 1. Переопределение стилей в custom.css
Добавляйте медиа-запросы в `assets/css/custom.css`:

```css
@media (max-width: 768px) {
  /* Ваши мобильные стили */
  .your-component {
    padding: 16px !important;
    font-size: 14px !important;
  }
  
  /* Переопределение Tailwind классов */
  .text-3xl {
    font-size: 1.5rem !important;
  }
}
```

### 2. Использование CSS переменных
```css
.your-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

### 3. Адаптивные утилиты
```html
<div class="lg:text-4xl md:text-2xl mobile-text-xl">
  Адаптивный заголовок
</div>

<div class="desktop-only">Только на десктопе</div>
<div class="mobile-only">Только на мобильных</div>
```

## 🎯 Рекомендации по мобильной адаптации

### Шапка
- Мобильная шапка создается автоматически
- Десктопная навигация скрывается на мобильных
- Логотип адаптируется под размер экрана

### Контент
```css
@media (max-width: 768px) {
  /* Отступы контейнеров */
  .container {
    padding: 0 16px !important;
  }
  
  /* Размеры текста */
  .text-4xl { font-size: 1.875rem !important; }
  .text-3xl { font-size: 1.5rem !important; }
  
  /* Слайдеры */
  .slider-container {
    margin: 0 -16px !important;
  }
}
```

### Формы
```css
@media (max-width: 768px) {
  .form-input {
    width: 100% !important;
    font-size: 16px !important; /* Предотвращает зум на iOS */
  }
}
```

## 🔧 Инструменты разработки

### Тестирование тем
```javascript
// В консоли браузера
window.themeManager.toggleTheme();
window.themeManager.setTheme('light');
window.themeManager.setTheme('dark');
```

### События смены темы
```javascript
document.addEventListener('themeChanged', (e) => {
  console.log('Тема изменена:', e.detail.theme);
  console.log('Темная тема:', e.detail.isDark);
});
```

### Мобильная навигация
```javascript
// Управление мобильным меню
window.mobileNavigation.openMenu();
window.mobileNavigation.closeMenu();
window.mobileNavigation.toggleMenu();
```

## 📝 Пример использования

### HTML
```html
<!-- Контейнер с кастомными классами -->
<div class="bg-custom-primary text-custom-primary mobile-container">
  <h1 class="text-3xl mobile-text-xl">Заголовок</h1>
  <p class="text-custom-secondary mobile-text-sm">Описание</p>
  
  <!-- Кнопка смены темы -->
  <button data-theme-toggle class="bg-custom-red">
    Сменить тему
  </button>
</div>
```

### CSS в custom.css
```css
@media (max-width: 768px) {
  .your-component {
    background: var(--bg-secondary);
    padding: 16px;
    border-radius: 8px;
  }
  
  .your-component h1 {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }
}
```

## 🚀 Готовые компоненты

### Навигационный виджет
- Автоматически адаптируется под мобильные
- Использует CSS переменные для тем

### Слайдеры
- Мобильные настройки в custom.css
- Адаптивные размеры и отступы

### Формы
- Кастомные стили для мобильных
- Правильные размеры для предотвращения зума

## 💡 Советы

1. **Всегда используйте CSS переменные** для цветов
2. **Добавляйте !important** в медиа-запросы для переопределения Tailwind
3. **Тестируйте на реальных устройствах** или в DevTools
4. **Используйте font-size: 16px** для input на мобильных (предотвращает зум)
5. **Группируйте мобильные стили** в custom.css по компонентам

Теперь вы можете легко разрабатывать мобильную версию, добавляя стили в `custom.css` без изменения существующих Tailwind классов!
