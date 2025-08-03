class App {
    constructor() {
        this.gratitudeInput = document.getElementById('gratitudeInput');
        this.addGratitudeBtn = document.getElementById('addGratitudeBtn');
        this.gratitudeList = document.getElementById('gratitudeList');
        
        this.gratitudeRecords = [];
        this.maxGratitudeDays = 7;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Load gratitudeRecords from localStorage
        const gratitudeRecords = localStorage.getItem('gratitudeRecords');

        if(gratitudeRecords && gratitudeRecords.length > 0) {
            this.gratitudeRecords = JSON.parse(gratitudeRecords);
        }

        this.init();
    }
    
    init() {
        this.displayGratitude();
        this.bindEvents();
    }
    
    displayGratitude() {
        // Collect all valid entries with their opacity classes
        const allEntries = [];
        
        this.gratitudeRecords.forEach((record) => {
            // Calculate days difference from today
            const daysDiff = this.getDaysDifference(record.date);
            
            
            // Skip and delete old records
            if (daysDiff > this.maxGratitudeDays) {
                this.gratitudeRecords = this.gratitudeRecords.filter(item => item.date !== record.date);
                localStorage.setItem('gratitudeRecords', JSON.stringify(this.gratitudeRecords));
                return;
            }
            
            // Calculate opacity based on days difference
            let opacityClass;
            switch (daysDiff) {
                case 0: opacityClass = 'opacity-100 text-primary-500 dark:text-white'; break;
                case 1: opacityClass = 'opacity-90'; break;
                case 2: opacityClass = 'opacity-80'; break;
                case 3: opacityClass = 'opacity-70'; break;
                case 4: opacityClass = 'opacity-60'; break;
                case 5: opacityClass = 'opacity-50'; break;
                case 6: opacityClass = 'opacity-40'; break;
                case 7: opacityClass = 'opacity-30'; break;
                default: opacityClass = 'opacity-0';
            }
            
            // Add each entry to the collection
            record.entries.forEach((entry) => {
                allEntries.push({ text: entry, opacityClass });
            });
        });

        if(allEntries.length === 0) {
            const emptyListTextEn = "No gratitude added yet. Start by adding something you're grateful for!"    
            const emptyListTextAr = "لا يوجد نعم مضافة بعد. أبدأ بإضافة شيء تحمد الله عليه.";
            const language = document.documentElement.lang;
            const emptyListText = language === 'ar' ? emptyListTextAr : emptyListTextEn;
            this.gratitudeList.innerHTML = `<li class="font-text-body text-lg" data-en="${emptyListTextEn}" data-ar="${emptyListTextAr}">${emptyListText}</li>`;
            return;
        }

        this.gratitudeList.innerHTML = '';
        
        // Shuffle the entries randomly
        const shuffledEntries = this.shuffleArray(allEntries);
        
        // Display shuffled entries with random rotation
        shuffledEntries.forEach((entry) => {
            const entryLi = document.createElement('li');
            entryLi.className = `${entry.opacityClass} inline-block p-4`;
            entryLi.textContent = entry.text;
            entryLi.dataset.date = this.getDateStringFromUTC(this.gratitudeRecords.find(record => record.entries.includes(entry.text)).date);

            // Apply random rotation
            this.applyRandomRotation(entryLi);
            
            this.gratitudeList.appendChild(entryLi);
        });
    }
    
    // Shuffle array randomly
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Get current date in UTC (for storage) - Standard convention
    getCurrentDateUTC() {
        return new Date().toISOString(); // Full UTC ISO timestamp
    }
    
    // Get previous date in UTC (for storage)
    getPreviousDateUTC(daysAgo) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - daysAgo); // Use UTC methods for accurate calculation
        return date.toISOString(); // Full UTC ISO timestamp
    }
    
    // Get date string from full UTC ISO timestamp
    getDateStringFromUTC(utcISOString) {
        try {
            const utcDate = new Date(utcISOString);
            return utcDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
            console.error('Error extracting date from UTC ISO string:', error);
            return utcISOString; // Fallback to original string
        }
    }
    
    // Calculate days difference between two UTC dates
    getDaysDifference(date1UTC, date2UTC = this.getCurrentDateUTC()) {
        try {
            const date1 = new Date(date1UTC);
            const date2 = new Date(date2UTC);
            
            // Get dates at midnight UTC for accurate day calculation
            const date1Date = new Date(Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()));
            const date2Date = new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate()));
            
            // Calculate difference in milliseconds and convert to days
            const diffTime = date1Date.getTime() - date2Date.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 1000ms * 60s * 60m * 24h = 1 day
            
            return Math.abs(diffDays);
        } catch (error) {
            console.error('Error calculating days difference:', error);
            return 0; // Return 0 if calculation fails
        }
    }
    
    // Convert UTC date string to user's timezone for display
    displayDateInUserTimezone(utcDateString) {
        try {
            // Parse UTC date string properly - treat as UTC noon to avoid timezone edge cases
            const utcDate = new Date(utcDateString);
            
            // Convert to user's timezone for display
            return utcDate.toLocaleDateString(undefined, {
                timeZone: this.userTimezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error converting UTC date to user timezone:', error);
            return utcDateString; // Fallback to original string
        }
    }
    
    applyRandomRotation(element) {
        const randomDegree = Math.ceil(Math.random() * 10) - 5; // Random degrees between -5 and 5
        element.style.transform = `rotate(${randomDegree}deg)`;
    }
    
    addGratitude() {
        const text = this.gratitudeInput.value.trim();
        if (!text) return;

        const today = this.getDateStringFromUTC(this.getCurrentDateUTC());

        const record = this.gratitudeRecords.find(record => this.getDateStringFromUTC(record.date) === today);

        if (!record) {
            this.gratitudeRecords.push({ date: this.getCurrentDateUTC(), entries: [text] });
        } else {
            this.gratitudeRecords.find(record => {
                if (this.getDateStringFromUTC(record.date) === today) {
                    record.entries.push(text);
                }
            });
        }

        localStorage.setItem('gratitudeRecords', JSON.stringify(this.gratitudeRecords));

        // Clear input
        this.gratitudeInput.value = '';
        
        // Refresh display
        this.displayGratitude();
    }
    
    bindEvents() {
        this.addGratitudeBtn.addEventListener('click', () => this.addGratitude());
        
        this.gratitudeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addGratitude();
            }
        });

        this.gratitudeList.addEventListener('dblclick', (e) => {
            const target = e.target;

            if(target.tagName !== 'LI') return;

            const record = this.gratitudeRecords.find(record => this.getDateStringFromUTC(record.date) === target.dataset.date);
            
            if (!record) return;
            
            record.entries = record.entries.filter(entry => entry !== target.textContent);

            if (record.entries.length === 0) {
                this.gratitudeRecords = this.gratitudeRecords.filter(item => item.date !== record.date);
            }

            localStorage.setItem('gratitudeRecords', JSON.stringify(this.gratitudeRecords));
            this.displayGratitude();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
