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
        this.customItems = this.loadCustomItems();
        this.hiddenDefaultItems = this.loadHiddenDefaultItems();
        this.checkedItems = this.loadCheckedItems();
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
        const visibleDefaultItems = this.defaultItems.filter(item => !this.hiddenDefaultItems.includes(item));
        const allItems = [...visibleDefaultItems, ...this.customItems];

        allItems.forEach(item => {
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
            this.checkedItems.push(item);
            this.saveCheckedItems();
            this.app.addRecord(item);
            this.render();
        }
    }

    isChecked(item) {
        return this.checkedItems.includes(item);
    }

    loadCheckedItems() {
        const today = new Date().toISOString().split('T')[0];
        return JSON.parse(localStorage.getItem(`checklist_${today}`)) || [];
    }

    saveCheckedItems() {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`checklist_${today}`, JSON.stringify(this.checkedItems));
    }

    uncheckItem(itemText) {
        const index = this.checkedItems.indexOf(itemText);
        if (index > -1) {
            this.checkedItems.splice(index, 1);
            this.saveCheckedItems();
            this.render();
        }
    }

    addItem() {
        const newItem = this.newItemInput.value.trim();
        const allItems = [...this.defaultItems, ...this.customItems];
        if (newItem && !allItems.includes(newItem)) {
            this.customItems.push(newItem);
            this.saveCustomItems();
            this.newItemInput.value = '';
            this.render();
        }
    }

    deleteItem(item) {
        if (this.isCustomItem(item)) {
            this.customItems = this.customItems.filter(i => i !== item);
            this.saveCustomItems();
        } else if (this.defaultItems.includes(item)) {
            if (!this.hiddenDefaultItems.includes(item)) {
                this.hiddenDefaultItems.push(item);
                this.saveHiddenDefaultItems();
            }
        }
        this.render();
    }

    isCustomItem(item) {
        return this.customItems.includes(item);
    }

    loadCustomItems() {
        return JSON.parse(localStorage.getItem('customChecklistItems')) || [];
    }

    saveCustomItems() {
        localStorage.setItem('customChecklistItems', JSON.stringify(this.customItems));
    }

    loadHiddenDefaultItems() {
        return JSON.parse(localStorage.getItem('hiddenDefaultItems')) || [];
    }

    saveHiddenDefaultItems() {
        localStorage.setItem('hiddenDefaultItems', JSON.stringify(this.hiddenDefaultItems));
    }
} 