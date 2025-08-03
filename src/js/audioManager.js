// Centralized audio manager for preloading and caching audio files
class AudioManager {
    constructor() {
        this.audioFiles = {
            reminder: 'src/assets/sounds/almahdali_yosef--Salli_ala_Mohamed.mp3',
            stopwatch: 'src/assets/sounds/almahdali_yosef--Subhan_Allah.mp3'
        };
        this.cachedAudio = {};
        this.init();
    }

    init() {
        this.preloadAllAudio();
    }

    preloadAllAudio() {
        Object.entries(this.audioFiles).forEach(([key, path]) => {
            this.preloadAudio(key, path);
        });
    }

    preloadAudio(key, path) {
        try {
            const audio = new Audio(path);
            audio.preload = 'auto';
            
            audio.addEventListener('canplaythrough', () => {
                this.cachedAudio[key] = audio;
            });
            
            audio.addEventListener('error', (error) => {
                console.log(`Failed to preload audio ${key}:`, error);
                this.cachedAudio[key] = null;
            });
            
            // Start loading the audio
            audio.load();
            
        } catch (error) {
            console.log(`Error creating audio for ${key}:`, error);
            this.cachedAudio[key] = null;
        }
    }

    getAudio(key) {
        return this.cachedAudio[key] || null;
    }

    playAudio(key) {
        const audio = this.getAudio(key);
        if (audio) {
            // Reset audio to beginning if it was already played
            audio.currentTime = 0;
            
            return audio.play().then(() => {}).catch(error => {
                console.log(`Audio playback failed for ${key}:`, error);
                throw error;
            });
        } else {
            console.log(`Audio not found: ${key}`);
            return Promise.reject(new Error(`Audio not found: ${key}`));
        }
    }

    isAudioLoaded(key) {
        return this.cachedAudio[key] !== null && this.cachedAudio[key] !== undefined;
    }

    getAllAudioStatus() {
        const status = {};
        Object.keys(this.audioFiles).forEach(key => {
            status[key] = this.isAudioLoaded(key);
        });
        return status;
    }
}

// Create global audio manager instance
window.audioManager = new AudioManager(); 