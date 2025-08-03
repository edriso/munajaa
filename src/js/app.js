class App {
    constructor() {
        this.gratitudeInput = document.getElementById('gratitudeInput');
        this.addGratitudeBtn = document.getElementById('addGratitudeBtn');
        this.gratitudeList = document.getElementById('gratitudeList');
        
        this.records = [];
        this.maxDays = 7;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Load records from localStorage
        const records = localStorage.getItem('records');

        if(records && records.length > 0) {
            this.records = JSON.parse(records);
        }

        this.init();
    }
    
    init() {
        this.displayRecords();
        this.bindEvents();
    }
    
    displayRecords() {
        // Collect all valid entries with their opacity classes
        const allEntries = [];
        
        this.records.forEach((record) => {
            // Calculate days difference from today
            const daysDiff = this.getDaysDifference(record.date);
            
            
            // Skip and delete old records
            if (daysDiff > this.maxDays) {
                this.records = this.records.filter(item => item.date !== record.date);
                localStorage.setItem('records', JSON.stringify(this.records));
                return;
            }
            
            // Calculate opacity based on days difference
            let opacityClass;
            switch (daysDiff) {
                case 0: opacityClass = 'opacity-100 text-primary-500 text-white'; break;
                case 1: opacityClass = 'opacity-90'; break;
                case 2: opacityClass = 'opacity-80'; break;
                case 3: opacityClass = 'opacity-70'; break;
                case 4: opacityClass = 'opacity-60'; break;
                case 5: opacityClass = 'opacity-50'; break;
                case 6: opacityClass = 'opacity-40'; break;
                case 7: opacityClass = 'opacity-30'; break;
                default: opacityClass = 'opacity-0';
            }
            
            // Add each entry to the collection with date info
            record.entries.forEach((entry) => {
                allEntries.push({ 
                    text: entry, 
                    opacityClass, 
                    date: record.date,
                    daysDiff 
                });
            });
        });

        if(allEntries.length === 0) {
            const emptyListText = "لا يوجد عبادات مُضافة بعد. أبدأ بإضافة ذِكر أو عبادة.";
            this.gratitudeList.innerHTML = `<li class="font-text-body text-base sm:text-lg">${emptyListText}</li>`;
            return;
        }

        this.gratitudeList.innerHTML = '';
        
        // Group entries by date
        const groupedByDate = {};
        allEntries.forEach(entry => {
            const dateKey = this.getDateStringFromUTC(entry.date);
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = [];
            }
            groupedByDate[dateKey].push(entry);
        });

        // Display entries grouped by date
        const dateKeys = Object.keys(groupedByDate);
        const shuffledDateKeys = this.shuffleArray(dateKeys);
        
        shuffledDateKeys.forEach(dateKey => {
            const entries = groupedByDate[dateKey];
            
            // Create day heading
            const dayHeading = document.createElement('h3');
            dayHeading.className = 'w-full text-lg font-bold text-primary-400';
            
            // Format date in Arabic
            const date = new Date(dateKey);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const dateString = date.toDateString();
            
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let weekDay = `يوم`;
            
            if (dateString === today.toDateString()) {
                options = { year: 'numeric', month: 'long', day: 'numeric' };
                weekDay = 'اليوم،';
            } else if (dateString === yesterday.toDateString()) {
                options = { year: 'numeric', month: 'long', day: 'numeric' };
                weekDay = 'يوم الأمس،';
            }
            
            dayHeading.textContent = `${weekDay} ${date.toLocaleDateString('ar-SA', options)}:`;
            this.gratitudeList.appendChild(dayHeading);
            
            // Create container for this day's entries
            const dayContainer = document.createElement('div');
            dayContainer.className = 'w-full flex gap-4 flex-wrap justify-center mb-4';
            
            // Shuffle the entries for this day
            const shuffledEntries = this.shuffleArray(entries);
            
            // Display shuffled entries with random rotation
            shuffledEntries.forEach((entry) => {
                const entryLi = document.createElement('li');
                entryLi.className = `${entry.opacityClass} inline-block p-4`;
                entryLi.textContent = entry.text;
                entryLi.dataset.date = this.getDateStringFromUTC(entry.date);

                // Apply random rotation
                this.applyRandomRotation(entryLi);
                
                dayContainer.appendChild(entryLi);
            });
            
            this.gratitudeList.appendChild(dayContainer);
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
    
    addRecord() {
        const text = this.gratitudeInput.value.trim();
        if (!text) return;

        const today = this.getDateStringFromUTC(this.getCurrentDateUTC());

        const record = this.records.find(record => this.getDateStringFromUTC(record.date) === today);

        if (!record) {
            this.records.push({ date: this.getCurrentDateUTC(), entries: [text] });
        } else {
            this.records.find(record => {
                if (this.getDateStringFromUTC(record.date) === today) {
                    record.entries.push(text);
                }
            });
        }

        localStorage.setItem('records', JSON.stringify(this.records));

        // Clear input
        this.gratitudeInput.value = '';
        
        // Refresh display
        this.displayRecords();
    }
    
    bindEvents() {
        this.addGratitudeBtn.addEventListener('click', () => this.addRecord());
        
        this.gratitudeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addRecord();
            }
        });

        this.gratitudeList.addEventListener('dblclick', (e) => {
            const target = e.target;

            if(target.tagName !== 'LI') return;

            const record = this.records.find(record => this.getDateStringFromUTC(record.date) === target.dataset.date);
            
            if (!record) return;
            
            // Find the index of the specific entry to remove
            const entryIndex = record.entries.indexOf(target.textContent);
            if (entryIndex > -1) {
                // Remove only the specific entry at this index
                record.entries.splice(entryIndex, 1);
            }

            if (record.entries.length === 0) {
                this.records = this.records.filter(item => item.date !== record.date);
            }

            localStorage.setItem('records', JSON.stringify(this.records));
            this.displayRecords();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
