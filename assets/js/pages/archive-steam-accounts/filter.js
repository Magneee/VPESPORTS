/**
 * Games Filter Manager
 * Manages the games filter
 */
class GamesFilterManager {
    constructor() {
        this.filterContainer = document.querySelector('.bg-brand-dark-gray');
        this.filterCount = document.querySelector('.bg-brand-red span');
        this.countBadge = document.querySelector('.bg-brand-red.rounded-full');
        this.resetBtn = document.getElementById('reset-filter-btn');
        this.saveBtn = document.getElementById('save-filter-btn');
        
        this.init();
    }

    init() {
        if (!this.filterContainer) return;

        this.bindEvents();
        this.updateFilterCount();
    }

    bindEvents() {
        document.querySelectorAll('.game-filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilterCount();
                this.updateTextColors(checkbox);
            });
        });

        document.querySelectorAll('[data-toggle]').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.toggleSection(e.currentTarget);
            });
            toggle.style.cursor = 'pointer';
        });

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => {
                this.resetFilter();
            });
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => {
                this.saveFilter();
            });
        }
    }

    updateFilterCount() {
        const checkedBoxes = document.querySelectorAll('.game-filter-checkbox:checked');
        const count = checkedBoxes.length;
        
        if (this.filterCount) {
            this.filterCount.textContent = count;
        }

        if (this.countBadge) {
            this.countBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateTextColors(changedCheckbox) {
        if (changedCheckbox) {
            const label = changedCheckbox.closest('label');
            const span = label.querySelector('span');
            
            if (changedCheckbox.checked) {
                span.className = span.className.replace('text-white/70', 'text-white');
            } else {
                span.className = span.className.replace('text-white', 'text-white/70');
            }
        } else {
            document.querySelectorAll('.game-filter-checkbox').forEach(checkbox => {
                const label = checkbox.closest('label');
                const span = label.querySelector('span');
                
                if (checkbox.checked) {
                    span.className = span.className.replace('text-white/70', 'text-white');
                } else {
                    span.className = span.className.replace('text-white', 'text-white/70');
                }
            });
        }
    }

    toggleSection(header) {
        const section = header.closest('.filter-section');
        const sectionType = header.getAttribute('data-toggle');
        const content = document.querySelector(`[data-content="${sectionType}"]`);
        const arrow = header.querySelector('.filter-arrow');
        
        if (!content || !arrow) return;

        const isCollapsed = content.style.display === 'none';
        
        if (isCollapsed) {
            section.classList.add('filter-section-active');
            content.style.display = 'block';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            section.classList.remove('filter-section-active');
            content.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
    }

    resetFilter() {
        document.querySelectorAll('.game-filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.updateFilterCount();
        this.updateTextColors();
        
        if (this.resetBtn) {
            const originalText = this.resetBtn.textContent;
            this.resetBtn.textContent = 'Filters cleared';
            setTimeout(() => {
                this.resetBtn.textContent = originalText;
            }, 1000);
        }
    }

    saveFilter() {
        const selectedFilters = [];
        
        document.querySelectorAll('.game-filter-checkbox:checked').forEach(checkbox => {
            const label = checkbox.closest('label');
            const text = label.querySelector('span').textContent.trim();
            selectedFilters.push(text);
        });

        console.log('Saving filters:', selectedFilters);
        
        // Visual feedback
        if (this.saveBtn) {
            const originalText = this.saveBtn.textContent;
            this.saveBtn.textContent = 'Filter saved!';
            setTimeout(() => {
                this.saveBtn.textContent = originalText;
            }, 1000);
        }

        // WordPress integration hook
        if (typeof wp !== 'undefined' && wp.hooks) {
            wp.hooks.doAction('games_filter_saved', selectedFilters);
        }
    }

    // Method to get current filter state
    getFilterState() {
        const filters = {};
        
        document.querySelectorAll('.game-filter-checkbox').forEach(checkbox => {
            const label = checkbox.closest('label');
            const text = label.querySelector('span').textContent.trim();
            filters[text] = checkbox.checked;
        });

        return filters;
    }

    setFilterState(filters) {
        document.querySelectorAll('.game-filter-checkbox').forEach(checkbox => {
            const label = checkbox.closest('label');
            const text = label.querySelector('span').textContent.trim();
            
            if (filters.hasOwnProperty(text)) {
                checkbox.checked = filters[text];
            }
        });

        this.updateFilterCount();
        this.updateTextColors();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GamesFilterManager();
});

// WordPress
if (typeof wp !== 'undefined' && wp.hooks) {
    wp.hooks.addAction('init', 'games-filter', () => {
        new GamesFilterManager();
    });
}