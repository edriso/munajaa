// Manages the daily checklist functionality.

class ChecklistManager {
    constructor(app) {
        this.app = app;
        this.checklistList = document.getElementById('checklist-list');
        this.newItemInput = document.getElementById('new-checklist-item-input');
        this.addItemBtn = document.getElementById('add-checklist-item-btn');
        this.defaultItems = [
            'صلاة الفجر في وقتها',
            'أذكار الصباح',
            'صلاة الضحى',
            'وِرد القرآن',
            'صلاة الظهر في وقتها',
            'الاستغفار',
            'الصدقة',
            'صلة الرحم',
            'صلاة العصر في وقتها',
            'أذكار المساء',
            'صلاة المغرب في وقتها',
            'سبحان الله وبحمده 100 مرة',
            'صلاة العشاء في وقتها',
            'الوتر',
            'صلاة قيام الليل',
            'بر الوالدين',
            'الأمر بالمعروف والنهي عن المنكر'
        ];
        this.allItems = this.loadAllItems();
        this.init();
    }

    init() {
        this.render();
        this.addItemBtn.addEventListener('click', () => this.addItem());
        this.newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
    }

    render() {
        this.checklistList.innerHTML = '';
        
        this.allItems.forEach(item => {
            const isChecked = this.isChecked(item);
            const li = document.createElement('li');
            li.className = `flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${isChecked ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`;
            li.dataset.item = item;
            if (!isChecked) {
                li.classList.add('cursor-pointer');
            }

            const uncheckedIcon = `<svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="1.5"></circle></svg>`;
            const checkedIcon = `<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>`;
            const deleteIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

            li.innerHTML = `
                <span class="flex-1 mr-2">${item}</span>
                <div class="flex items-center gap-3">
                    <span class="check-icon">${isChecked ? checkedIcon : uncheckedIcon}</span>
                    <button type="button" class="delete-item-btn text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 transition-colors duration-200">${deleteIcon}</button>
                </div>
            `;
            this.checklistList.appendChild(li);
        });

        this.addEventListeners();
    }

    addEventListeners() {
        this.checklistList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                const item = li.dataset.item;
                if (e.target.closest('.delete-item-btn')) {
                    this.deleteItem(item);
                } else if (!this.isChecked(item)) {
                    this.handleCheck(item);
                }
            });
        });
    }

    handleCheck(item) {
        if (item && !this.isChecked(item)) {
            this.app.addRecord(item);
            this.render();
        }
    }

    isChecked(item) {
        // Check if item is in today's entries
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = this.app.records.find(r => {
            const recordDate = new Date(r.date).toISOString().split('T')[0];
            return recordDate === today;
        });
        
        return todayRecord && todayRecord.entries.includes(item);
    }

    addItem() {
        const newItem = this.newItemInput.value.trim();
        if (newItem && !this.allItems.includes(newItem)) {
            this.allItems.push(newItem);
            this.saveAllItems();
            this.newItemInput.value = '';
            this.render();
        } else if (newItem && this.allItems.includes(newItem)) {
            // If item already exists, just check it
            if (!this.isChecked(newItem)) {
                this.handleCheck(newItem);
            }
            this.newItemInput.value = '';
        }
    }

    deleteItem(item) {
        this.allItems = this.allItems.filter(i => i !== item);
        this.saveAllItems();
        this.render();
    }

    loadAllItems() {
        const savedItems = JSON.parse(localStorage.getItem('customChecklistItems')) || [];
        // If no saved items, initialize with default items
        if (savedItems.length === 0) {
            return [...this.defaultItems];
        }
        return savedItems;
    }

    saveAllItems() {
        localStorage.setItem('customChecklistItems', JSON.stringify(this.allItems));
    }

    refresh() {
        this.render();
    }
} 