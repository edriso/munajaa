// Manages the stopwatch functionality for focus timer.
class StopwatchManager {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.timeLeft = 0;
        this.duration = 5; // default 5 minutes
        this.audio = null;
        this.loadSettings();
        this.init();
    }

    init() {
        this.loadAudio();
        this.resetTimer();
        this.updateDisplay();
        this.addEventListeners();
    }

    loadAudio() {
        try {
            this.audio = new Audio('src/assets/sounds/almahdali_yosef--Subhan_Allah.mp3');
            this.audio.preload = 'auto';
            this.audio.addEventListener('error', () => {
                console.log('Stopwatch audio file not found.');
                this.audio = null;
            });
        } catch (error) {
            console.log('Failed to load stopwatch audio:', error);
            this.audio = null;
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        this.duration = settings.stopwatchDuration || 5;
    }

    saveSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        settings.stopwatchDuration = this.duration;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    startTimer() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.isRunning = true;
            this.updateDisplay(); // Update immediately for responsive UI
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.stopTimer();
                    this.playCompletionSound();
                    // Show completion message
                    this.showCompletionMessage();
                    // Auto reset after showing completion message
                    setTimeout(() => {
                        this.resetTimer();
                    }, 3000);
                }
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.updateDisplay(); // Update immediately for responsive UI
        }
    }

    resumeTimer() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.startTimer();
        }
    }

    stopTimer() {
        this.pauseTimer();
    }

    resetTimer() {
        this.stopTimer();
        this.timeLeft = this.duration * 60; // convert minutes to seconds
        this.updateDisplay();
    }

    setDuration(minutes) {
        this.duration = minutes;
        this.saveSettings();
        this.resetTimer();
    }

    playCompletionSound() {
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.play().catch(error => {
                console.log('Stopwatch completion sound failed:', error);
            });
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        const timeDisplay = document.getElementById('stopwatch-time');
        const startBtn = document.getElementById('stopwatch-start');
        const stopBtn = document.getElementById('stopwatch-stop');
        const resetBtn = document.getElementById('stopwatch-reset');
        const durationInput = document.getElementById('stopwatch-duration');

        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.timeLeft);
            // Add visual feedback when timer is running
            if (this.isRunning) {
                timeDisplay.classList.add('text-primary-500');
            } else {
                timeDisplay.classList.remove('text-primary-500');
            }
        }

        if (startBtn) {
            const canStart = !this.isRunning && this.timeLeft > 0;
            startBtn.disabled = !canStart;
            startBtn.textContent = this.isRunning ? 'إيقاف مؤقت' : 'ابدأ';
            
            // Update button styling based on state
            if (canStart) {
                startBtn.className = 'px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105';
            } else {
                startBtn.className = 'px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed transition-all duration-200';
            }
        }

        if (stopBtn) {
            stopBtn.disabled = !this.isRunning;
            
            // Update button styling based on state
            if (this.isRunning) {
                stopBtn.className = 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105';
            } else {
                stopBtn.className = 'px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed transition-all duration-200';
            }
        }

        if (resetBtn) {
            const canReset = !this.isRunning;
            resetBtn.disabled = !canReset;
            
            // Update button styling based on state
            if (canReset) {
                resetBtn.className = 'px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105';
            } else {
                resetBtn.className = 'px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed transition-all duration-200';
            }
        }

        if (durationInput) {
            durationInput.value = this.duration;
            durationInput.disabled = this.isRunning;
        }
    }

    showCompletionMessage() {
        // Create a temporary completion message
        const timeDisplay = document.getElementById('stopwatch-time');
        if (timeDisplay) {
            const originalText = timeDisplay.textContent;
            timeDisplay.textContent = 'انتهى الوقت!';
            timeDisplay.classList.add('text-primary-500', 'animate-pulse');
            
            // Reset after 3 seconds
            setTimeout(() => {
                timeDisplay.textContent = originalText;
                timeDisplay.classList.remove('text-primary-500', 'animate-pulse');
            }, 3000);
        }
    }

    addEventListeners() {
        const startBtn = document.getElementById('stopwatch-start');
        const stopBtn = document.getElementById('stopwatch-stop');
        const resetBtn = document.getElementById('stopwatch-reset');
        const durationInput = document.getElementById('stopwatch-duration');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopTimer());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }

        if (durationInput) {
            durationInput.addEventListener('change', (e) => {
                const minutes = parseInt(e.target.value);
                if (minutes > 0 && minutes <= 120) { // max 2 hours
                    this.setDuration(minutes);
                }
            });
        }
    }
}

// Initialize stopwatch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stopwatchManager = new StopwatchManager();
}); 