// Manages theme settings for the application.

(function() {
    // Immediately apply the theme from localStorage to prevent FOUC
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
})();

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.sunIcon = document.getElementById('sunIcon');
        this.moonIcon = document.getElementById('moonIcon');
        this.init();
    }

    init() {
        this.updateIcon();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const currentTheme = this.isDarkMode() ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        this.updateIcon();
    }

    updateIcon() {
        if (this.isDarkMode()) {
            this.sunIcon.classList.remove('hidden');
            this.moonIcon.classList.add('hidden');
        } else {
            this.sunIcon.classList.add('hidden');
            this.moonIcon.classList.remove('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('themeToggle')) {
        new ThemeManager();
    }
}); 