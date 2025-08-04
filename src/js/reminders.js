// Manages the reminders functionality for playing audio at intervals.
class RemindersManager {
    constructor() {
        this.interval = null;
        this.isEnabled = false;
        this.intervalMinutes = 5;
        this.loadSettings();
        this.init();
    }

    init() {
        this.updateDisplay();
        // Start reminders if enabled by default
        if (this.isEnabled) {
            this.start();
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        this.isEnabled = settings.remindersEnabled !== undefined ? settings.remindersEnabled : true;
        this.intervalMinutes = settings.reminderInterval || 5;
    }

    saveSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        settings.remindersEnabled = this.isEnabled;
        settings.reminderInterval = this.intervalMinutes;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    start() {
        if (this.isEnabled && !this.interval) {
            this.interval = setInterval(() => {
                this.playAudio();
            }, this.intervalMinutes * 60 * 1000);
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    playAudio() {
        if (window.audioManager && window.audioManager.isAudioLoaded('reminder')) {
            window.audioManager.playAudio('reminder').catch(error => {
                console.log('Reminder audio playback failed:', error);
            });
        } else {
            console.log('Reminder audio not loaded yet');
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            this.start();
        } else {
            this.stop();
        }
        this.saveSettings();
        this.updateDisplay();
    }

    setInterval(minutes) {
        this.intervalMinutes = minutes;
        this.saveSettings();
        if (this.isEnabled) {
            this.stop();
            this.start();
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const toggleBtn = document.getElementById('reminder-toggle');
        const intervalInput = document.getElementById('reminder-interval');
        const statusText = document.getElementById('reminder-status');

        if (toggleBtn) {
            toggleBtn.textContent = this.isEnabled ? 'إيقاف التذكيرات' : 'تشغيل التذكيرات';
            toggleBtn.className = `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                this.isEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`;
        }

        if (intervalInput) {
            intervalInput.value = this.intervalMinutes;
        }

        if (statusText) {
            statusText.textContent = this.isEnabled 
                ? `التذكيرات مفعلة كل ${this.intervalMinutes} دقيقة` 
                : 'التذكيرات متوقفة';
            statusText.className = `text-sm ${this.isEnabled ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`;
        }
    }
}

// Initialize reminders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.remindersManager = new RemindersManager();
}); 