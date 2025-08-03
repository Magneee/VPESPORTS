/**
 * Slot Game Controller
 * Handles play button functionality and iframe management
 * 
 * WordPress Integration Notes:
 * - This script is designed for easy WordPress theme integration
 * - Uses custom events for WordPress hooks compatibility
 * - Game URLs should be managed through WordPress admin/database
 * - Supports wp.hooks for action/filter integration
 * - All styling is handled via external CSS for easy customization
 */

class SlotGameController {
    constructor() {
        this.playNowBtn = document.getElementById('play-now-btn');
        this.gameIframe = document.getElementById('game-iframe');
        this.gamePreview = document.getElementById('game-preview');
        
        this.init();
    }

    init() {
        if (this.playNowBtn && this.gameIframe && this.gamePreview) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.playNowBtn.addEventListener('click', this.handlePlayNowClick.bind(this));
    }

    handlePlayNowClick() {
        // Hide the preview and show the iframe
        this.gamePreview.style.display = 'none';
        this.gameIframe.style.opacity = '1';
        this.gameIframe.style.pointerEvents = 'auto';
        
        // Set iframe source to actual game URL
        // For demo purposes, using a placeholder
        this.gameIframe.src = 'https://demo-game-url.com/call-of-zeus';
        
        // Optional: Add loading state
        this.gameIframe.addEventListener('load', () => {
            console.log('Game loaded successfully');
        });

        // WordPress integration hook
        this.triggerWordPressEvent();
    }

    triggerWordPressEvent() {
        // Custom event for WordPress integration
        const event = new CustomEvent('slotGameStarted', {
            detail: {
                gameId: 'call-of-zeus',
                provider: 'nucleus-gaming',
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);

        // WordPress hooks integration
        if (typeof wp !== 'undefined' && wp.hooks) {
            wp.hooks.doAction('slot_game_started', 'call-of-zeus', 'nucleus-gaming');
        }
    }

    // Public API methods
    resetGame() {
        this.gamePreview.style.display = 'flex';
        this.gameIframe.style.opacity = '0';
        this.gameIframe.style.pointerEvents = 'none';
        this.gameIframe.src = 'about:blank';
    }

    loadGame(gameUrl) {
        this.gameIframe.src = gameUrl;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const slotController = new SlotGameController();
    
    // Make globally available for WordPress
    window.SlotGameController = SlotGameController;
    window.slotControllerInstance = slotController;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlotGameController;
} 