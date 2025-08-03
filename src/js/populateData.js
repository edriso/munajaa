// Demo data functionality - can be easily removed later
class PopulateDataManager {
    constructor(app) {
        this.app = app;
        this.sampleEntries = {
            today: [
                "صلاة الفجر في وقتها",
                "قراءة القرآن الكريم",
                "الاستغفار 100 مرة",
                "صدقة",
                "بر الوالدين"
            ],
            yesterday: [
                "صلاة العشاء في المسجد",
                "أذكار الصباح و المساء",
                "مساعدة جاري",
                "سبحان الله و بحمده 100 مرة",
                "الدعاء للمسلمين"
            ],
            threeDaysAgo: [
                "صلاة الفجر في جماعة",
                "التسبيح 33 مرة",
                "زيارة مريض",
                "إماطة أذى عن الطريق",
                "التواضع في المشي"
            ],
            fiveDaysAgo: [
                "صلاة العصر في وقتها",
                "قراءة أذكار المساء",
                "إفشاء السلام",
                "صدقة",
                "طلب العلم"
            ]
        };
    }

    populateDemoData() {
        // Add entries for different dates
        this.addEntriesForDate(new Date(), this.sampleEntries.today);
        this.addEntriesForDate(this.getDateOffset(-1), this.sampleEntries.yesterday);
        this.addEntriesForDate(this.getDateOffset(-3), this.sampleEntries.threeDaysAgo);
        this.addEntriesForDate(this.getDateOffset(-5), this.sampleEntries.fiveDaysAgo);
        
        // Save to localStorage and refresh display
        localStorage.setItem('records', JSON.stringify(this.app.records));
        this.app.displayRecords();
    }

    clearDemoData() {
        this.app.records = [];
        localStorage.removeItem('records');
        this.app.displayRecords();
    }

    addEntriesForDate(date, entries) {
        const dateString = date.toISOString().split('T')[0];
        
        // Check if we already have entries for this date
        let existingRecord = this.app.records.find(r => {
            const recordDate = new Date(r.date).toISOString().split('T')[0];
            return recordDate === dateString;
        });
        
        if (existingRecord) {
            // Add new entries to existing record
            entries.forEach(entry => {
                if (!existingRecord.entries.includes(entry)) {
                    existingRecord.entries.push(entry);
                }
            });
        } else {
            // Create new record for this date
            this.app.records.push({
                date: date.toISOString(),
                entries: [...entries]
            });
        }
    }

    getDateOffset(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    }

    hasDemoData() {
        return this.app.records.length > 0;
    }

    getDemoInfo() {
        return {
            totalRecords: this.app.records.length,
            totalEntries: this.app.records.reduce((sum, record) => sum + record.entries.length, 0),
            dateRange: this.app.records.length > 0 ? {
                oldest: new Date(Math.min(...this.app.records.map(r => new Date(r.date)))),
                newest: new Date(Math.max(...this.app.records.map(r => new Date(r.date))))
            } : null
        };
    }
}

// Explicitly assign to window to ensure global availability
window.PopulateDataManager = PopulateDataManager;

// Create global populate data manager instance
window.populateDataManager = null;