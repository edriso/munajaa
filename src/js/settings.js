// Manages the settings functionality including theme switching.
class SettingsManager {
    constructor() {
        this.loadSettings();
        this.init();
    }

    init() {
        this.applyTheme();
        this.updateThemeDisplay();
        this.addEventListeners();
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        this.theme = settings.theme || this.getSystemTheme();
        this.remindersEnabled = settings.remindersEnabled !== undefined ? settings.remindersEnabled : true;
        this.reminderInterval = settings.reminderInterval || 10;
    }

    saveSettings() {
        const settings = {
            theme: this.theme,
            remindersEnabled: this.remindersEnabled,
            reminderInterval: this.reminderInterval
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveSettings();
        this.updateThemeDisplay();
    }

    updateThemeDisplay() {
        const themeBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');

        if (themeBtn) {
            themeBtn.className = `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                this.theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`;
        }

        if (themeIcon) {
            themeIcon.innerHTML = this.theme === 'dark' 
                ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>'
                : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>';
        }

        if (themeText) {
            themeText.textContent = this.theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن';
        }
    }

    addEventListeners() {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        const reminderToggle = document.getElementById('reminder-toggle');
        if (reminderToggle) {
            reminderToggle.addEventListener('click', () => {
                if (window.remindersManager) {
                    window.remindersManager.toggle();
                }
            });
        }

        const intervalInput = document.getElementById('reminder-interval');
        if (intervalInput) {
            intervalInput.addEventListener('change', (e) => {
                const minutes = parseInt(e.target.value);
                if (minutes > 0 && window.remindersManager) {
                    window.remindersManager.setInterval(minutes);
                }
            });
        }

        const playAudioBtn = document.getElementById('play-audio');
        if (playAudioBtn) {
            playAudioBtn.addEventListener('click', () => {
                if (window.audioManager && window.audioManager.isAudioLoaded('reminder')) {
                    window.audioManager.playAudio('reminder').catch(error => {
                        console.log('Audio preview failed:', error);
                    });
                } else {
                    console.log('Audio not loaded yet');
                }
            });
        }
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
}); 