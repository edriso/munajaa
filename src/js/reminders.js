// Manages the reminders functionality for playing audio at intervals.
class RemindersManager {
    constructor() {
        this.audio = null;
        this.interval = null;
        this.isEnabled = false;
        this.intervalMinutes = 10;
        this.loadSettings();
        this.init();
    }

    init() {
        this.loadAudio();
        this.updateDisplay();
        // Start reminders if enabled by default
        if (this.isEnabled) {
            this.start();
        }
    }

    loadAudio() {
        try {
            this.audio = new Audio('src/assets/sounds/almahdali_yosef--Salli_ala_Mohamed.mp3');
            this.audio.preload = 'auto';
            this.audio.addEventListener('error', () => {
                console.log('Audio file not found. Please add the audio file to src/assets/sounds/');
                this.audio = null;
            });
        } catch (error) {
            console.log('Failed to load audio:', error);
            this.audio = null;
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        this.isEnabled = settings.remindersEnabled !== undefined ? settings.remindersEnabled : true;
        this.intervalMinutes = settings.reminderInterval || 10;
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
        if (this.audio) {
            // Reset audio to beginning if it was already played
            this.audio.currentTime = 0;
            
            this.audio.play().then(() => {
                console.log('Audio playing successfully');
            }).catch(error => {
                console.log('Audio playback failed:', error);
                // Try to reload the audio and play again
                this.loadAudio();
                if (this.audio) {
                    this.audio.play().catch(retryError => {
                        console.log('Audio retry failed:', retryError);
                    });
                }
            });
        } else {
            console.log('Audio not loaded, attempting to load...');
            this.loadAudio();
            if (this.audio) {
                this.audio.play().catch(error => {
                    console.log('Audio playback failed after reload:', error);
                });
            }
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