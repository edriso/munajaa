// Manages the daily checklist functionality.

class ChecklistManager {
    constructor(app) {
        this.app = app;
        this.checklistList = document.getElementById('checklist-list');
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
        this.checkedItems = this.loadCheckedItems();
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        this.checklistList.innerHTML = '';
        this.defaultItems.forEach(item => {
            const isChecked = this.isChecked(item);
            const li = document.createElement('li');
            li.className = `flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${isChecked ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`;
            li.dataset.item = item;
            if (!isChecked) {
                li.classList.add('cursor-pointer');
            }
            li.innerHTML = `
                <span>${item}</span>
                <span class="text-2xl ${isChecked ? 'cursor-not-allowed' : ''}">
                    ${isChecked ? '✔️' : '⚪'}
                </span>
            `;
            this.checklistList.appendChild(li);
        });

        this.addEventListeners();
    }

    addEventListeners() {
        this.checklistList.querySelectorAll('li').forEach(li => {
            const item = li.dataset.item;
            if (!this.isChecked(item)) {
                li.addEventListener('click', () => this.handleCheck(item));
            }
        });
    }

    handleCheck(item) {
        if (item && !this.isChecked(item)) {
            this.checkedItems.push(item);
            this.saveCheckedItems();
            this.app.addRecord(item); // Add to today's list in app.js
            this.render();
        }
    }

    isChecked(item) {
        return this.checkedItems.includes(item);
    }

    loadCheckedItems() {
        const today = new Date().toISOString().split('T')[0];
        const items = JSON.parse(localStorage.getItem(`checklist_${today}`)) || [];
        return items;
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
} 