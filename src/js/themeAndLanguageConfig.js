// Prevent flash of unstyled content for language and theme
(function() {
    // Get stored preferences immediately
    const theme = localStorage.getItem('theme') || 'light';
    const language = localStorage.getItem('language') || 'en';
    
    // Apply theme immediately
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    // Apply language immediately
    if (language === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    }
    
    // Hide content until language is applied
    document.documentElement.style.visibility = 'hidden';
})();

// Theme and Language Management
class AppSettings {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.language = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        // Apply theme and language (ensures consistency)
        this.applyTheme();
        this.applyLanguage();
        this.setupEventListeners();
    }

    applyTheme() {
        const html = document.documentElement;
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        if (this.theme === 'dark') {
            html.classList.add('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            html.classList.remove('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    applyLanguage() {
        const html = document.documentElement;
        
        if (this.language === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            // Update body font to arabic font
            document.documentElement.style.setProperty('--font-text-body', 'var(--font-arabic)');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            // Update body font to english font
            document.documentElement.style.setProperty('--font-text-body', 'var(--font-english)');
        }

        // Update all translatable elements
        this.updateTranslatableElements();
    }

    updateTranslatableElements() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const text = this.language === 'ar' ? element.getAttribute('data-ar') : element.getAttribute('data-en');
            
            // Handle different element types
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                // Update placeholder for input elements
                element.placeholder = text;
            } else {
                // Update text content for other elements
                element.textContent = text;
            }
        });
        
        // Show content after language is applied
        document.documentElement.style.visibility = 'visible';
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.theme);
            this.applyTheme();
        });

        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            this.language = this.language === 'en' ? 'ar' : 'en';
            localStorage.setItem('language', this.language);
            this.applyLanguage();
        });
    }
}

// Initialize app settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppSettings();
}); 