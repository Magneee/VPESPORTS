/**
 * Single Article Image Slider
 * Handles image gallery for single article pages
 * Based on the main EsportsSlider but simplified for image-only navigation
 */

class SingleSlider {
  constructor(containerSelector = '.slider-container') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.slider-track');
    this.slides = this.container.querySelectorAll('.slider-slide');
    this.dots = this.container.querySelectorAll('.slider-dot');
    this.prevBtn = null; // Нет стрелок в single слайдере
    this.nextBtn = null;

    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    this.setupEventListeners();
    this.updateSlider();
    
    // Auto-initialize for WordPress
    this.initWordPressIntegration();
  }

  setupEventListeners() {
    // Dots navigation (основная навигация)
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        this.goToSlide(slideIndex);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isInViewport()) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
      }
    });

    // Touch/swipe support
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 50; // minimum distance for swipe
    let restraint = 100; // maximum perpendicular distance
    let allowedTime = 300; // maximum time allowed to travel distance
    let startTime = 0;

    this.track.addEventListener('touchstart', (e) => {
      const touchObj = e.changedTouches[0];
      startX = touchObj.pageX;
      startY = touchObj.pageY;
      startTime = new Date().getTime();
    });

    this.track.addEventListener('touchend', (e) => {
      const touchObj = e.changedTouches[0];
      distX = touchObj.pageX - startX;
      distY = touchObj.pageY - startY;
      const elapsedTime = new Date().getTime() - startTime;

      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          if (distX > 0) {
            this.prevSlide();
          } else {
            this.nextSlide();
          }
        }
      }
    });
  }

  isInViewport() {
    const rect = this.container.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  goToSlide(slideIndex) {
    if (this.isTransitioning || slideIndex === this.currentSlide) return;
    
    this.currentSlide = slideIndex;
    this.updateSlider();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateSlider();
  }

  updateSlider() {
    if (!this.track) return;

    this.isTransitioning = true;
    
    // Update track position
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Update dots
    this.updateDots();

    // Reset transition flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);

    // WordPress integration
    this.triggerWordPressEvent();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
        dot.style.backgroundColor = 'white';
      } else {
        dot.classList.remove('active');
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }
    });
  }

  // WordPress Integration Methods
  initWordPressIntegration() {
    if (typeof wp !== 'undefined') {
      // WordPress is available
      this.setupWordPressHooks();
    }
  }

  setupWordPressHooks() {
    // Listen for WordPress events
    if (typeof wp !== 'undefined' && wp.hooks) {
      wp.hooks.addAction('single_slider_navigate', 'vpesports', (slideIndex) => {
        this.goToSlide(slideIndex);
      });
    }
  }

  triggerWordPressEvent() {
    // Trigger WordPress event when slide changes
    if (typeof wp !== 'undefined' && wp.hooks) {
      wp.hooks.doAction('single_slider_changed', this.currentSlide, this.totalSlides);
    }

    // Custom event for other integrations
    const event = new CustomEvent('singleSliderChanged', {
      detail: {
        currentSlide: this.currentSlide,
        totalSlides: this.totalSlides,
        slider: this
      }
    });
    document.dispatchEvent(event);
  }

  // Public API methods
  getCurrentSlide() {
    return this.currentSlide;
  }

  getTotalSlides() {
    return this.totalSlides;
  }

  destroy() {
    // Clean up event listeners
    this.dots.forEach(dot => {
      dot.removeEventListener('click', this.goToSlide);
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const singleSlider = new SingleSlider();
  
  // Make globally available for WordPress
  window.SingleSlider = SingleSlider;
  window.singleSliderInstance = singleSlider;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SingleSlider;
} 

/**
 * News Slider for horizontal scrolling news cards
 * Supports mouse drag and touch swipe navigation
 */
class NewsSlider {
  constructor(containerSelector = '.news-slider-container') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.news-slider-track');
    this.cards = this.container.querySelectorAll('.news-card');
    
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    this.currentIndex = 0;
    
    this.cardWidth = 373; // 320px (w-80) + 24px gap
    this.containerWidth = window.innerWidth;
    this.visibleWidth = this.containerWidth - 128; // Minus gradient overlays (64px each side)
    
    // Calculate max translate to show last card properly
    this.totalWidth = this.cards.length * this.cardWidth - 24.5; // Remove last gap
    this.maxTranslate = Math.min(0, -(this.totalWidth - this.visibleWidth + 48)); // +48px padding right
    
    // Center the slider initially if content is smaller than container
    this.initialOffset = this.totalWidth < this.visibleWidth ? 
      (this.visibleWidth - this.totalWidth) / 2 : 48; // 48px left padding or center

    this.init();
  }

  init() {
    if (this.cards.length === 0) return;

    this.setupEventListeners();
    this.setInitialPosition();
  }

  setInitialPosition() {
    // Set initial position with proper offset
    this.currentTranslate = this.initialOffset;
    this.prevTranslate = this.currentTranslate;
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  setupEventListeners() {
    // Mouse events
    this.track.addEventListener('mousedown', this.dragStart.bind(this));
    this.track.addEventListener('mousemove', this.dragMove.bind(this));
    this.track.addEventListener('mouseup', this.dragEnd.bind(this));
    this.track.addEventListener('mouseleave', this.dragEnd.bind(this));

    // Touch events
    this.track.addEventListener('touchstart', this.dragStart.bind(this));
    this.track.addEventListener('touchmove', this.dragMove.bind(this));
    this.track.addEventListener('touchend', this.dragEnd.bind(this));

    // Prevent context menu on drag
    this.track.addEventListener('contextmenu', (e) => {
      if (this.isDragging) e.preventDefault();
    });

    // Prevent default drag behavior on images
    this.cards.forEach(card => {
      const img = card.querySelector('img');
      if (img) {
        img.addEventListener('dragstart', (e) => e.preventDefault());
      }
    });

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  dragStart(e) {
    this.isDragging = true;
    this.startPos = this.getPositionX(e);
    this.track.style.cursor = 'grabbing';
    this.track.style.transition = 'none';
    
    // Stop any ongoing animation
    cancelAnimationFrame(this.animationID);
  }

  dragMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    const currentPosition = this.getPositionX(e);
    const diff = currentPosition - this.startPos;
    
    this.currentTranslate = this.prevTranslate + diff;
    
    // Limit dragging bounds with proper offset
    const maxRight = this.initialOffset;
    const maxLeft = this.maxTranslate + this.initialOffset;
    this.currentTranslate = Math.max(maxLeft, Math.min(maxRight, this.currentTranslate));
    
    this.setSliderPosition();
  }

  dragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.style.cursor = 'grab';
    this.track.style.transition = 'transform 0.3s ease-out';
    
    this.prevTranslate = this.currentTranslate;
    
    // Слайдер останавливается в любом положении без привязки к карточкам
    // this.snapToNearestCard(); - убрано
  }

  setSliderPosition() {
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  handleResize() {
    // Recalculate dimensions on resize
    this.containerWidth = window.innerWidth;
    this.visibleWidth = this.containerWidth - 128;
    this.totalWidth = this.cards.length * this.cardWidth - 24;
    this.maxTranslate = Math.min(0, -(this.totalWidth - this.visibleWidth + 48));
    this.initialOffset = this.totalWidth < this.visibleWidth ? 
      (this.visibleWidth - this.totalWidth) / 2 : 48;
    
    // Reset position if needed
    const maxRight = this.initialOffset;
    const maxLeft = this.maxTranslate + this.initialOffset;
    this.currentTranslate = Math.max(maxLeft, Math.min(maxRight, this.currentTranslate));
    this.prevTranslate = this.currentTranslate;
    
    this.setSliderPosition();
  }

  // Public API methods
  slideToCard(index) {
    if (index < 0 || index >= this.cards.length) return;
    
    this.currentIndex = index;
    this.currentTranslate = -index * this.cardWidth;
    this.prevTranslate = this.currentTranslate;
    
    this.track.style.transition = 'transform 0.3s ease-out';
    this.setSliderPosition();
  }

  slideNext() {
    if (this.currentIndex < this.cards.length - 1) {
      this.slideToCard(this.currentIndex + 1);
    }
  }

  slidePrev() {
    if (this.currentIndex > 0) {
      this.slideToCard(this.currentIndex - 1);
    }
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalCards() {
    return this.cards.length;
  }
}

// Auto-initialize news slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const newsSlider = new NewsSlider();
  
  // Make globally available
  window.NewsSlider = NewsSlider;
  window.newsSliderInstance = newsSlider;
}); 