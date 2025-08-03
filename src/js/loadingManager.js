// Manages loading screen and FOUC prevention
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }

    init() {
        // Show loading screen immediately
        this.showLoadingScreen();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handlePageLoad();
            });
        } else {
            this.handlePageLoad();
        }

        // Also listen for window load event for complete page load
        window.addEventListener('load', () => {
            this.handleCompleteLoad();
        });
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    handlePageLoad() {
        // Make content visible to prevent FOUC
        document.documentElement.classList.add('loaded');
        
        // Hide loading screen after a minimum time to prevent flash
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1000);
    }

    handleCompleteLoad() {
        // Ensure loading screen is hidden after everything is loaded
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 500);
    }
}

// Initialize loading manager immediately
window.loadingManager = new LoadingManager(); 