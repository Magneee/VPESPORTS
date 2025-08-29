# 📝 Система управления размерами шрифтов

## 🎯 Обзор

Создана система для быстрого изменения размеров шрифтов на мобильных устройствах без изменения HTML классов. Система использует CSS переменные и автоматически переопределяет все Tailwind классы размеров шрифтов.

## 🚀 Как это работает

### 1. **CSS переменные**
Все размеры шрифтов определены через CSS переменные в `:root`:

```css
:root {
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
  --font-size-6xl: 3.75rem;     /* 60px */
}
```

### 2. **Автоматическое переопределение**
На мобильных устройствах (до 768px) размеры автоматически изменяются:

```css
@media (max-width: 768px) {
  :root {
    --font-size-xs: 0.625rem;      /* 10px */
    --font-size-sm: 0.75rem;       /* 12px */
    --font-size-base: 0.875rem;    /* 14px */
    --font-size-lg: 1rem;          /* 16px */
    --font-size-xl: 1.125rem;      /* 18px */
    --font-size-2xl: 1.25rem;      /* 20px */
    --font-size-3xl: 1.5rem;       /* 24px */
    --font-size-4xl: 1.75rem;      /* 28px */
    --font-size-5xl: 2rem;         /* 32px */
    --font-size-6xl: 2.5rem;       /* 40px */
  }
}
```

### 3. **Переопределение Tailwind классов**
Все Tailwind классы размеров шрифтов автоматически переопределяются:

```css
@media (max-width: 768px) {
  .text-xs { font-size: var(--font-size-xs) !important; }
  .text-sm { font-size: var(--font-size-sm) !important; }
  .text-base { font-size: var(--font-size-base) !important; }
  .text-lg { font-size: var(--font-size-lg) !important; }
  .text-xl { font-size: var(--font-size-xl) !important; }
  .text-2xl { font-size: var(--font-size-2xl) !important; }
  .text-3xl { font-size: var(--font-size-3xl) !important; }
  .text-4xl { font-size: var(--font-size-4xl) !important; }
  .text-5xl { font-size: var(--font-size-5xl) !important; }
  .text-6xl { font-size: var(--font-size-6xl) !important; }
}
```

## 📱 Использование

### **Ничего не нужно менять в HTML!**
Все существующие Tailwind классы автоматически адаптируются:

```html
<!-- Этот код будет работать на всех устройствах -->
<h1 class="text-4xl">Заголовок</h1>
<p class="text-base">Обычный текст</p>
<span class="text-sm">Мелкий текст</span>
```

### **Результат:**
- **Десктоп:** `text-4xl` = 36px, `text-base` = 16px, `text-sm` = 14px
- **Мобильные:** `text-4xl` = 28px, `text-base` = 14px, `text-sm` = 12px

## 🛠 Настройка размеров

### **Изменить мобильные размеры:**
Отредактируйте переменные в `assets/css/custom.css`:

```css
@media (max-width: 768px) {
  :root {
    --font-size-4xl: 1.5rem;      /* Изменить с 1.75rem на 1.5rem */
    --font-size-5xl: 1.75rem;     /* Изменить с 2rem на 1.75rem */
  }
}
```

### **Добавить новые размеры:**
1. Добавьте переменную в `:root`:
```css
:root {
  --font-size-7xl: 4rem;          /* 64px */
}
```

2. Добавьте мобильную версию:
```css
@media (max-width: 768px) {
  :root {
    --font-size-7xl: 3rem;        /* 48px */
  }
}
```

3. Добавьте переопределение Tailwind:
```css
@media (max-width: 768px) {
  .text-7xl { font-size: var(--font-size-7xl) !important; }
}
```

## 📊 Таблица размеров

| Класс | Десктоп | Мобильные | Разница |
|-------|---------|-----------|---------|
| `text-xs` | 12px | 10px | -2px |
| `text-sm` | 14px | 12px | -2px |
| `text-base` | 16px | 14px | -2px |
| `text-lg` | 18px | 16px | -2px |
| `text-xl` | 20px | 18px | -2px |
| `text-2xl` | 24px | 20px | -4px |
| `text-3xl` | 30px | 24px | -6px |
| `text-4xl` | 36px | 28px | -8px |
| `text-5xl` | 48px | 32px | -16px |
| `text-6xl` | 60px | 40px | -20px |

## 🎨 Дополнительные возможности

### **Кастомные размеры через CSS переменные:**
```css
.your-custom-text {
  font-size: var(--font-size-2xl);
}
```

### **Адаптивные размеры:**
```css
.responsive-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
}
```

### **Программное изменение:**
```javascript
// Изменить размеры программно
document.documentElement.style.setProperty('--font-size-4xl', '2rem');
```

## 🔧 Преимущества системы

✅ **Не нужно менять HTML** - все работает автоматически  
✅ **Централизованное управление** - все размеры в одном месте  
✅ **Легко настраивать** - измените переменные и все обновится  
✅ **Совместимость с Tailwind** - все классы работают как обычно  
✅ **Производительность** - CSS переменные работают быстро  
✅ **Масштабируемость** - легко добавлять новые размеры  

## 📝 Примеры использования

### **Заголовки:**
```html
<h1 class="text-6xl font-bold">Главный заголовок</h1>
<h2 class="text-4xl font-semibold">Подзаголовок</h2>
<h3 class="text-2xl font-medium">Заголовок секции</h3>
```

### **Текст:**
```html
<p class="text-base leading-relaxed">Основной текст</p>
<p class="text-sm text-gray-600">Дополнительная информация</p>
<span class="text-xs text-gray-500">Мелкий текст</span>
```

### **Кнопки:**
```html
<button class="text-lg font-medium px-6 py-3">Большая кнопка</button>
<button class="text-base font-medium px-4 py-2">Обычная кнопка</button>
<button class="text-sm font-medium px-3 py-1">Маленькая кнопка</button>
```

Теперь вы можете легко управлять размерами шрифтов на мобильных устройствах, просто изменяя CSS переменные в файле `custom.css`! 🚀

