// Manages the tab navigation functionality.

class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(clickedTab) {
        // Deactivate all tabs and hide all content
        this.tabs.forEach(tab => {
            tab.classList.remove('active', 'text-primary-500');
            tab.classList.add('text-gray-600', 'dark:text-gray-400');
        });
        this.tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Activate the clicked tab and show its content
        clickedTab.classList.add('active', 'text-primary-500');
        clickedTab.classList.remove('text-gray-600', 'dark:text-gray-400');
        const tabId = clickedTab.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TabManager();
}); 