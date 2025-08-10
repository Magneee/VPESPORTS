/**
 * Esports News Slider
 * WordPress Compatible Slider with Touch Support
 */

class EsportsSlider {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.slider-track');
        this.slides = container.querySelectorAll('.slider-slide');
        this.dots = container.querySelectorAll('.slider-dot');
        this.prevBtn = container.querySelector('.slider-prev');
        this.nextBtn = container.querySelector('.slider-next');
        this.contentContainer = document.querySelector('.slider-content');
        this.contentSlides = document.querySelectorAll('.slide-content');

        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoplay();
        this.updateSlider();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dots navigation
        this.dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/swipe support
        this.setupTouchSupport();

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    setupTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const handleTouchStart = (e) => {
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoplay();
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.startAutoplay();
        };

        // Mouse events
        this.container.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleTouchEnd);

        // Touch events
        this.container.addEventListener('touchstart', handleTouchStart, { passive: false });
        this.container.addEventListener('touchmove', handleTouchMove, { passive: false });
        this.container.addEventListener('touchend', handleTouchEnd);
    }

    goToSlide(index) {

        if (index < 0 || index >= this.slideCount) {
            return;
        }

        if (index === this.currentSlide) {
            return;
        }

        this.isTransitioning = false;

        const translateX = -index * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        this.updateDots(index);

        this.updateContent(index);

        this.currentSlide = index;

    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slideCount;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    updateDots(activeIndex) {
        this.dots.forEach((dot) => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (slideIndex === activeIndex) {
                dot.classList.add('active');
                dot.style.setProperty('background-color', 'white', 'important');
            } else {
                dot.classList.remove('active');
                dot.style.setProperty('background-color', 'rgba(255, 255, 255, 0.5)', 'important');
            }
        });
    }

    updateContent(activeIndex) {
        this.contentSlides.forEach((content, index) => {
            if (index === activeIndex) {
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
            }
        });
    }

    updateSlider() {
        this.updateDots(this.currentSlide);
        this.updateContent(this.currentSlide);
    }

    startAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }

        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // WordPress
    addSlide(slideData) {
        const slideHTML = this.createSlideHTML(slideData);
        this.track.insertAdjacentHTML('beforeend', slideHTML);

        this.slideCount++;
        this.addDot();

        this.updateSlider();
    }

    createSlideHTML(data) {
        return `
            <div class="slider-slide w-full flex-shrink-0 relative">
                <img src="${data.image}" alt="${data.title}" class="w-full max-h-[370px] object-cover select-none pointer-events-none">
                <div class="absolute left-4 right-[17px] bottom-4 px-5 pb-4 pt-4 flex items-center justify-between gap-4 rounded-[24px]">
                    <div class="absolute rounded-[24px] pointer-events-none z-0" style="background: url('assets/images/slider-meta-background.png') center/100% 100% no-repeat; 
                        width: 100%; height: 64px; left: 0; right: 0; 
                        backdrop-filter: blur(16px); 
                        -webkit-mask: url('assets/images/slider-meta-background.png') center/100% 100% no-repeat;
                        mask: url('assets/images/slider-meta-background.png') center/100% 100% no-repeat;">
                    </div>
                    <div class="absolute rounded-[24px] pointer-events-none z-0" style="background: url('assets/images/slider-meta-background.png') center/100% 100% no-repeat; 
                        width: 100%; height: 64px; left: 0; right: 0; opacity: 1;">
                    </div>
                    <div class="relative z-10 flex items-center justify-between w-full">
                        <span class="bg-brand-red/20 text-brand-red text-sm leading-[17px] px-3 py-[7.5px] rounded-full font-medium tracking-tight">${data.category}</span>
                        <div class="flex items-center gap-6 text-white text-base tracking-tight font-semibold">
                            <span class="flex items-center gap-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.5" d="M12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.3221 11.447C2.8101 6.976 7.0271 3.75 12.0001 3.75C16.9701 3.75 21.1851 6.973 22.6751 11.44C22.7951 11.802 22.7951 12.192 22.6751 12.553C21.1881 17.024 16.9701 20.25 11.9981 20.25C7.0281 20.25 2.8121 17.027 1.3231 12.56C1.20285 12.1987 1.20285 11.8083 1.3231 11.447H1.3221ZM17.2491 12C17.2491 13.3924 16.696 14.7277 15.7114 15.7123C14.7268 16.6969 13.3915 17.25 11.9991 17.25C10.6067 17.25 9.27136 16.6969 8.28679 15.7123C7.30222 14.7277 6.7491 13.3924 6.7491 12C6.7491 10.6076 7.30222 9.27225 8.28679 8.28769C9.27136 7.30312 10.6067 6.75 11.9991 6.75C13.3915 6.75 14.7268 7.30312 15.7114 8.28769C16.696 9.27225 17.2491 10.6076 17.2491 12Z" fill="white" />
                                </svg>
                                ${data.views}
                            </span>
                            <span class="flex items-center gap-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.5" d="M12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.3221 11.447C2.8101 6.976 7.0271 3.75 12.0001 3.75C16.9701 3.75 21.1851 6.973 22.6751 11.44C22.7951 11.802 22.7951 12.192 22.6751 12.553C21.1881 17.024 16.9701 20.25 11.9981 20.25C7.0281 20.25 2.8121 17.027 1.3231 12.56C1.20285 12.1987 1.20285 11.8083 1.3231 11.447H1.3221ZM17.2491 12C17.2491 13.3924 16.696 14.7277 15.7114 15.7123C14.7268 16.6969 13.3915 17.25 11.9991 17.25C10.6067 17.25 9.27136 16.6969 8.28679 15.7123C7.30222 14.7277 6.7491 13.3924 6.7491 12C6.7491 10.6076 7.30222 9.27225 8.28679 8.28769C9.27136 7.30312 10.6067 6.75 11.9991 6.75C13.3915 6.75 14.7268 7.30312 15.7114 8.28769C16.696 9.27225 17.2491 10.6076 17.2491 12Z" fill="white" />
                                </svg>
                                ${data.comments}
                            </span>
                            <span class="flex items-center gap-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7502 4.50001C15.7502 3.80263 15.9931 3.12702 16.4372 2.58933C16.8813 2.05163 17.4988 1.68546 18.1836 1.55375C18.8685 1.42204 19.5778 1.53303 20.1897 1.86764C20.8015 2.20225 21.2777 2.73957 21.5363 3.38722C21.7949 4.03487 21.8198 4.75238 21.6068 5.41641C21.3937 6.08044 20.9559 6.64949 20.3687 7.02572C19.7815 7.40195 19.0816 7.56187 18.3893 7.47797C17.697 7.39407 17.0556 7.07161 16.5752 6.56601L8.15423 11.245C8.28289 11.7401 8.28289 12.2599 8.15423 12.755L16.5752 17.434C17.0785 16.9049 17.7574 16.5775 18.4848 16.5132C19.2122 16.4489 19.9381 16.6521 20.5263 17.0847C21.1146 17.5173 21.5249 18.1496 21.6803 18.8631C21.8357 19.5766 21.7255 20.3223 21.3704 20.9603C21.0154 21.5984 20.4398 22.0851 19.7515 22.3291C19.0633 22.5731 18.3097 22.5577 17.632 22.2858C16.9543 22.0139 16.399 21.5042 16.0702 20.8521C15.7415 20.2001 15.6618 19.4506 15.8462 18.744L7.42523 14.066C7.01209 14.501 6.47801 14.8021 5.89198 14.9305C5.30595 15.0589 4.6949 15.0086 4.13773 14.7862C3.58056 14.5638 3.10288 14.1794 2.76637 13.6827C2.42987 13.1861 2.25 12.5999 2.25 12C2.25 11.4001 2.42987 10.8139 2.76637 10.3173C3.10288 9.82061 3.58056 9.43624 4.13773 9.21382C4.6949 8.99139 5.30595 8.94112 5.89198 9.0695C6.47801 9.19788 7.01209 9.49902 7.42523 9.93401L15.8462 5.25501C15.7823 5.00844 15.7501 4.75473 15.7502 4.50001Z" fill="white" />
                                </svg>
                                ${data.shares}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addDot() {
        const dotsContainer = this.container.querySelector('.slider-dots');
        const dot = document.createElement('span');
        dot.className = 'slider-dot w-4 h-4 rounded-full bg-white/50 cursor-pointer transition-colors';
        dot.setAttribute('data-slide', this.slideCount - 1);
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            this.goToSlide(slideIndex);
        });
        dotsContainer.appendChild(dot);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        window.esportsSlider = new EsportsSlider(sliderContainer);
    }
});

// WordPress 
if (typeof wp !== 'undefined' && wp.ajax) {
    wp.ajax.post('get_slider_posts', {
        action: 'get_slider_posts',
        nonce: wpAjax.nonce
    }).done(function (response) {
        if (response.success && window.esportsSlider) {
            response.data.forEach(function (post) {
                window.esportsSlider.addSlide({
                    image: post.featured_image,
                    title: post.title,
                    category: post.category,
                    views: post.views,
                    comments: post.comments,
                    shares: post.shares
                });
            });
        }
    });
} 