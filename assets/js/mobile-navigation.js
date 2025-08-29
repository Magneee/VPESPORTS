/**
 * Mobile Navigation Manager - Управление мобильной навигацией
 * Обрабатывает гамбургер меню и мобильные взаимодействия
 */

class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.breakpoint = 768; // Точка перехода на мобильную версию
        this.init();
    }
    
    /**
     * Инициализация мобильной навигации
     */
    init() {
        this.createMobileHeader();
        this.bindEvents();
        this.handleResize();
    }
    
    /**
     * Создание мобильной шапки
     */
    createMobileHeader() {
        // Находим существующую шапку
        const existingHeader = document.querySelector('header');
        if (!existingHeader) return;
        
        // Создаем мобильную шапку
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header mobile-only';
        mobileHeader.innerHTML = `
            <div class="mobile-logo-container">
                <img src="assets/images/logo-vpe.png" alt="VPEsports" class="mobile-logo">
            </div>
            <div class="mobile-actions">
                <button class="mobile-action-button mobile-theme-button" data-theme-toggle aria-label="Сменить тему">
                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2.625C14.2321 2.625 14.4546 2.71719 14.6187 2.88128C14.7828 3.04538 14.875 3.26794 14.875 3.5V6.125C14.875 6.35706 14.7828 6.57962 14.6187 6.74372C14.4546 6.90781 14.2321 7 14 7C13.7679 7 13.5454 6.90781 13.3813 6.74372C13.2172 6.57962 13.125 6.35706 13.125 6.125V3.5C13.125 3.26794 13.2172 3.04538 13.3813 2.88128C13.5454 2.71719 13.7679 2.625 14 2.625ZM8.75 14C8.75 12.6076 9.30312 11.2723 10.2877 10.2877C11.2723 9.30312 12.6076 8.75 14 8.75C15.3924 8.75 16.7277 9.30312 17.7123 10.2877C18.6969 11.2723 19.25 12.6076 19.25 14C19.25 15.3924 18.6969 16.7277 17.7123 17.7123C16.7277 18.6969 15.3924 19.25 14 19.25C12.6076 19.25 11.2723 18.6969 10.2877 17.7123C9.30312 16.7277 8.75 15.3924 8.75 14ZM22.043 7.19367C22.1976 7.0278 22.2817 6.80841 22.2777 6.58172C22.2737 6.35504 22.1819 6.13876 22.0216 5.97844C21.8612 5.81813 21.645 5.7263 21.4183 5.7223C21.1916 5.7183 20.9722 5.80244 20.8063 5.957L18.9502 7.812C18.8666 7.89268 18.7999 7.9892 18.7539 8.09593C18.708 8.20266 18.6838 8.31747 18.6828 8.43365C18.6817 8.54983 18.7038 8.66506 18.7477 8.77261C18.7917 8.88017 18.8566 8.97789 18.9387 9.06009C19.0209 9.14228 19.1185 9.2073 19.226 9.25134C19.3335 9.29539 19.4488 9.31758 19.5649 9.31663C19.6811 9.31568 19.7959 9.29159 19.9027 9.24579C20.0095 9.19998 20.1061 9.13337 20.1868 9.04983L22.043 7.19367ZM25.375 14C25.375 14.2321 25.2828 14.4546 25.1187 14.6187C24.9546 14.7828 24.7321 14.875 24.5 14.875H21.875C21.6429 14.875 21.4204 14.7828 21.2563 14.6187C21.0922 14.4546 21 14.2321 21 14C21 13.7679 21.0922 13.5454 21.2563 13.3813C21.4204 13.2172 21.6429 13.125 21.875 13.125H24.5C24.7321 13.125 24.9546 13.2172 25.1187 13.3813C25.2828 13.5454 25.375 13.7679 25.375 14ZM20.8063 22.043C20.9722 22.1976 21.1916 22.2817 21.4183 22.2777C21.645 22.2737 21.8612 22.1819 22.0216 22.0216C22.1819 21.8612 22.2737 21.645 22.2777 21.4183C22.2817 21.1916 22.1976 20.9722 22.043 20.8063L20.188 18.9502C20.1073 18.8666 20.0108 18.7999 19.9041 18.7539C19.7973 18.708 19.6825 18.6838 19.5664 18.6828C19.4502 18.6817 19.3349 18.7038 19.2274 18.7477C19.1198 18.7917 19.0221 18.8566 18.9399 18.9387C18.8577 19.0209 18.7927 19.1185 18.7487 19.226C18.7046 19.3335 18.6824 19.4488 18.6834 19.5649C18.6843 19.6811 18.7084 19.7959 18.7542 19.9027C18.8 20.0095 18.8666 20.1061 18.9502 20.1868L20.8063 22.043ZM14 21C14.2321 21 14.4546 21.0922 14.6187 21.2563C14.7828 21.4204 14.875 21.6429 14.875 21.875V24.5C14.875 24.7321 14.7828 24.9546 14.6187 25.1187C14.4546 25.2828 14.2321 25.375 14 25.375C13.7679 25.375 13.5454 25.2828 13.3813 25.1187C13.2172 24.9546 13.125 24.7321 13.125 24.5V21.875C13.125 21.6429 13.2172 21.4204 13.3813 21.2563C13.5454 21.0922 13.7679 21 14 21ZM9.051 20.1868C9.21031 20.0217 9.2984 19.8007 9.2963 19.5712C9.2942 19.3418 9.20208 19.1224 9.03977 18.9602C8.87746 18.7981 8.65795 18.7062 8.42853 18.7043C8.1991 18.7024 7.97812 18.7907 7.81317 18.9502L5.957 20.8052C5.79753 20.9701 5.70923 21.1911 5.71112 21.4205C5.713 21.65 5.80492 21.8695 5.96708 22.0318C6.12923 22.1941 6.34865 22.2862 6.57807 22.2883C6.8075 22.2904 7.02856 22.2023 7.19367 22.043L9.04983 20.188L9.051 20.1868ZM7 14C7 14.2321 6.90781 14.4546 6.74372 14.6187C6.57962 14.7828 6.35706 14.875 6.125 14.875H3.5C3.26794 14.875 3.04538 14.7828 2.88128 14.6187C2.71719 14.4546 2.625 14.2321 2.625 14C2.625 13.7679 2.71719 13.5454 2.88128 13.3813C3.04538 13.2172 3.26794 13.125 3.5 13.125H6.125C6.35706 13.125 6.57962 13.2172 6.74372 13.3813C6.90781 13.5454 7 13.7679 7 14ZM7.81317 9.04983C7.97904 9.20439 8.19842 9.28854 8.42511 9.28454C8.65179 9.28054 8.86808 9.18871 9.02839 9.02839C9.18871 8.86808 9.28054 8.65179 9.28454 8.42511C9.28854 8.19842 9.20439 7.97904 9.04983 7.81317L7.19483 5.957C7.02988 5.79753 6.8089 5.70923 6.57947 5.71112C6.35005 5.713 6.13054 5.80492 5.96823 5.96708C5.80592 6.12923 5.7138 6.34865 5.7117 6.57807C5.7096 6.8075 5.79769 7.02856 5.957 7.19367L7.81317 9.04983Z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="mobile-action-button mobile-menu-button" data-mobile-menu-toggle aria-label="Открыть меню">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Создаем мобильное выпадающее меню
        const mobileDropdown = document.createElement('div');
        mobileDropdown.className = 'mobile-dropdown';
        mobileDropdown.innerHTML = `
            <div class="mobile-dropdown-content">
                <div class="mobile-dropdown-header">
                    <img src="assets/images/logo-vpe.png" alt="VPEsports" class="mobile-logo">
                    <button class="mobile-close-button" data-mobile-menu-close aria-label="Закрыть меню">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <nav class="mobile-nav-links">
                    <a href="index.html" class="mobile-nav-link">Главная</a>
                    <a href="pages/slots.html" class="mobile-nav-link">Слоты</a>
                    <a href="pages/esports-betting.html" class="mobile-nav-link">Киберспорт ставки</a>
                    <a href="pages/archive-esports-matches.html" class="mobile-nav-link">Архив матчей</a>
                    <a href="pages/archive-steam-accounts.html" class="mobile-nav-link">Steam аккаунты</a>
                </nav>
                <div class="mobile-nav-actions">
                    <a href="pages/login.html" class="mobile-nav-button mobile-nav-button-outline">Войти</a>
                    <a href="pages/register.html" class="mobile-nav-button mobile-nav-button-primary">Регистрация</a>
                </div>
                <div class="mobile-theme-toggle">
                    <button data-theme-toggle class="mobile-theme-button">
                        <span>Сменить тему</span>
                    </button>
                </div>
            </div>
        `;
        
            // Добавляем стили для мобильной навигации
    
        document.body.insertBefore(mobileHeader, document.body.firstChild);
        document.body.appendChild(mobileDropdown);
        
        // Добавляем класс для скрытия десктопной навигации на мобильных
        existingHeader.classList.add('desktop-nav');
        
        this.mobileHeader = mobileHeader;
        this.mobileDropdown = mobileDropdown;
    }
    
    /**
     * Открыть мобильное меню
     */
    openMenu() {
        this.isOpen = true;
        this.mobileDropdown.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл
        
        // Устанавливаем фокус на первую ссылку
        const firstLink = this.mobileDropdown.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    /**
     * Закрыть мобильное меню
     */
    closeMenu() {
        this.isOpen = false;
        this.mobileDropdown.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
    
    /**
     * Переключить состояние мобильного меню
     */
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    /**
     * Проверить, мобильная ли версия
     */
    isMobile() {
        return window.innerWidth <= this.breakpoint;
    }
    
    /**
     * Обработать изменение размера окна
     */
    handleResize() {
        if (!this.isMobile() && this.isOpen) {
            this.closeMenu();
        }
    }
    
    /**
     * Привязать события
     */
    bindEvents() {
        // Открыть/закрыть меню
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-mobile-menu-toggle]')) {
                e.preventDefault();
                this.toggleMenu();
            }
            
            if (e.target.closest('[data-mobile-menu-close]')) {
                e.preventDefault();
                this.closeMenu();
            }
            
            // Закрыть при клике на фон
            if (e.target.classList.contains('mobile-dropdown')) {
                this.closeMenu();
            }
        });
        
        // Обработка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeMenu();
                }
                
                // Управление фокусом внутри меню
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e);
                }
            }
        });
        
        // Изменение размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Закрыть меню при переходе по ссылке
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-nav-link')) {
                setTimeout(() => this.closeMenu(), 100);
            }
        });
    }
    
    /**
     * Обработка навигации по Tab внутри меню
     */
    handleTabNavigation(e) {
        const focusableElements = this.mobileDropdown.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    /**
     * Обновить активную ссылку в мобильном меню
     */
    updateActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.mobileDropdown.querySelectorAll('.mobile-nav-link');
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Статический метод для быстрого доступа
     */
    static getInstance() {
        if (!window.mobileNavigation) {
            window.mobileNavigation = new MobileNavigation();
        }
        return window.mobileNavigation;
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.mobileNavigation = new MobileNavigation();
});

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}
