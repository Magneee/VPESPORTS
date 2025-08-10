/**
 * Steam Account Slider Manager
 * Manages the 3-image preview slider for steam accounts
 */
class SteamAccountSlider {
    constructor() {
        this.slider = document.getElementById('steamAccountSlider');
        this.track = document.getElementById('steamSliderTrack');
        this.slides = document.querySelectorAll('.steam-account-slide');
        this.prevBtn = document.getElementById('steamSliderPrev');
        this.nextBtn = document.getElementById('steamSliderNext');
        this.dots = document.querySelectorAll('.steam-account-dot');
        this.getAccountBtn = document.getElementById('getAccountBtn');
        
        // Modal elements
        this.modal = document.getElementById('steamAccountModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.copyKey = document.getElementById('copyKey');
        this.goToTelegram = document.getElementById('goToTelegram');
        
        this.currentSlide = 1;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        if (!this.slider || !this.track || this.slides.length === 0) return;
        
        this.bindEvents();
        this.updateSlider();
    }

    bindEvents() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.goToPrevSlide();
            });
        }

        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.goToNextSlide();
            });
        }

        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Modal events
        if (this.getAccountBtn) {
            this.getAccountBtn.addEventListener('click', () => {
                this.openModal();
            });
        }

        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (this.copyKey) {
            this.copyKey.addEventListener('click', () => {
                this.copySteamKey();
            });
        }

        if (this.goToTelegram) {
            this.goToTelegram.addEventListener('click', () => {
                this.goToTelegramChannel();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToNextSlide();
            } else if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        this.slider.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();

            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    this.goToNextSlide();
                } else {
                    this.goToPrevSlide();
                }
            }

            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
            return;
        }

        this.isTransitioning = true;
        this.currentSlide = index;
        this.updateSlider();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    goToPrevSlide() {
        const prevIndex = this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1;
        this.goToSlide(prevIndex);
    }

    goToNextSlide() {
        const nextIndex = this.currentSlide < this.totalSlides - 1 ? this.currentSlide + 1 : 0;
        this.goToSlide(nextIndex);
    }

    updateSlider() {
        const container = this.slider.querySelector('.steam-account-slider-container');
        const containerWidth = container.offsetWidth;
        const slideElement = this.slides[0];
        const slideWidth = slideElement.offsetWidth + 16; // 443px + 16px margin
        
        const centerPosition = (containerWidth - slideElement.offsetWidth) / 2;
        const slideOffset = slideWidth * this.currentSlide;
        const transformX = centerPosition - slideOffset;
        
        this.track.style.transform = `translateX(${transformX}px)`;

        this.slides.forEach((slide, index) => {
            slide.classList.remove('steam-account-slide-active');
            if (index === this.currentSlide) {
                slide.classList.add('steam-account-slide-active');
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.remove('steam-account-dot-active');
            if (index === this.currentSlide) {
                dot.classList.add('steam-account-dot-active');
            }
        });

        this.updateNavigationState();
    }

    updateNavigationState() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.prevBtn.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto';
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.5' : '1';
            this.nextBtn.style.pointerEvents = this.currentSlide === this.totalSlides - 1 ? 'none' : 'auto';
        }
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    copySteamKey() {
        const input = document.querySelector('.steam-account-modal-input');
        if (input) {
            input.select();
            input.setSelectionRange(0, 99999);
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = this.copyKey.innerHTML;
            this.copyKey.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.707 5.293L7.293 14.707L3.293 10.707" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            setTimeout(() => {
                this.copyKey.innerHTML = originalText;
            }, 2000);
        }
    }

    goToTelegramChannel() {
        // Replace with your actual Telegram channel URL
        const telegramUrl = 'https://t.me/your_channel';
        window.open(telegramUrl, '_blank');
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    startAutoPlay(interval = 5000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.goToNextSlide();
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    destroy() {
        this.stopAutoPlay();
        
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.goToPrevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.goToNextSlide);
        }
        
        this.dots.forEach((dot) => {
            dot.removeEventListener('click', this.goToSlide);
        });
        
        if (this.getAccountBtn) {
            this.getAccountBtn.removeEventListener('click', this.handleGetAccount);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const steamSlider = new SteamAccountSlider();
    
    window.steamAccountSlider = steamSlider;
});

if (typeof wp !== 'undefined' && wp.hooks) {
    wp.hooks.addAction('init', 'steam-account-slider', () => {
        new SteamAccountSlider();
    });
}