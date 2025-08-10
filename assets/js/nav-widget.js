class NavigationWidget {
    constructor() {
        this.pages = [
            { name: 'Home', path: 'index.html', icon: '🏠' },
            { name: 'Login', path: 'pages/login.html', icon: '🔐' },
            { name: 'Register', path: 'pages/register.html', icon: '📝' },
            { name: 'Profile', path: 'pages/profile.html', icon: '👤' },
            { name: 'Single Article', path: 'pages/single.html', icon: '📰' },
            { name: 'Single Slot', path: 'pages/single-slot.html', icon: '🎰' },
            { name: 'Single Steam Account', path: 'pages/single-steam-accounts.html', icon: '🎮' },
            { name: 'Single Player', path: 'pages/single-player.html', icon: '🏆' },
            { name: 'Single Team', path: 'pages/single-team.html', icon: '👥' },
            { name: 'Slots', path: 'pages/slots.html', icon: '🎲' },
            { name: 'Archive Steam Accounts', path: 'pages/archive-steam-accounts.html', icon: '📚' },
            { name: 'Archive Esports Matches', path: 'pages/archive-esports-matches.html', icon: '⚔️' },
            { name: 'Esports Betting', path: 'pages/esports-betting.html', icon: '💰' }
        ];
        
        this.currentPage = this.getCurrentPage();
        this.init();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        // Find the page that matches current filename
        const currentPage = this.pages.find(page => {
            const pageFilename = page.path.split('/').pop();
            return pageFilename === filename;
        });
        
        return currentPage || this.pages[0]; // Default to home if not found
    }
    
    init() {
        this.createWidget();
        this.bindEvents();
    }
    
    createWidget() {
        // Create widget container
        const widget = document.createElement('div');
        widget.className = 'nav-widget';
        
        // Create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'nav-widget-toggle';
        toggle.innerHTML = '🧭';
        toggle.title = 'Navigation Menu';
        
        // Create menu container
        const menu = document.createElement('div');
        menu.className = 'nav-widget-menu';
        
        // Create menu title
        const title = document.createElement('div');
        title.className = 'nav-widget-title';
        title.textContent = 'Pages Navigation';
        
        // Create links container
        const links = document.createElement('div');
        links.className = 'nav-widget-links';
        
        // Create links for each page
        this.pages.forEach(page => {
            const link = document.createElement('a');
            link.href = page.path;
            link.className = 'nav-widget-link';
            if (page.path === this.currentPage.path) {
                link.classList.add('current');
            }
            link.innerHTML = `${page.icon} ${page.name}`;
            links.appendChild(link);
        });
        
        // Assemble the widget
        menu.appendChild(title);
        menu.appendChild(links);
        widget.appendChild(toggle);
        widget.appendChild(menu);
        
        // Add to page
        document.body.appendChild(widget);
        
        // Store references
        this.widget = widget;
        this.toggle = toggle;
        this.menu = menu;
    }
    
    bindEvents() {
        // Toggle menu on button click
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Handle link clicks
        this.menu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-widget-link')) {
                // Add a small delay to show the click effect
                setTimeout(() => {
                    this.closeMenu();
                }, 100);
            }
        });
    }
    
    toggleMenu() {
        this.menu.classList.toggle('active');
        
        // Update button icon
        if (this.menu.classList.contains('active')) {
            this.toggle.innerHTML = '✕';
            this.toggle.title = 'Close Menu';
        } else {
            this.toggle.innerHTML = '🧭';
            this.toggle.title = 'Navigation Menu';
        }
    }
    
    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.innerHTML = '🧭';
        this.toggle.title = 'Navigation Menu';
    }
}

// Initialize the navigation widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationWidget();
}); 