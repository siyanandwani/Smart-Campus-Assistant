export class StorageUtil {
    static KEYS = {
        USER: 'sca_user',
        TIMETABLE: 'sca_timetable',
        ATTENDANCE: 'sca_attendance',
        NOTES: 'sca_notes',
        EVENTS: 'sca_events',
        NOTIFICATIONS: 'sca_notifications',
        STUDY_SESSIONS: 'sca_study_sessions',
        THEME: 'sca_theme'
    };

    // User methods
    static getUser() {
        const user = localStorage.getItem(this.KEYS.USER);
        return user ? JSON.parse(user) : null;
    }

    static saveUser(user) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    }

    static clearUser() {
        localStorage.removeItem(this.KEYS.USER);
    }

    // Timetable methods
    static getTimetable() {
        const timetable = localStorage.getItem(this.KEYS.TIMETABLE);
        return timetable ? JSON.parse(timetable) : null;
    }

    static saveTimetable(timetable) {
        localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(timetable));
    }

    // Attendance methods
    static getAttendance() {
        const attendance = localStorage.getItem(this.KEYS.ATTENDANCE);
        return attendance ? JSON.parse(attendance) : null;
    }

    static saveAttendance(attendance) {
        localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(attendance));
    }

    // Notes methods
    static getNotes() {
        const notes = localStorage.getItem(this.KEYS.NOTES);
        return notes ? JSON.parse(notes) : null;
    }

    static saveNotes(notes) {
        localStorage.setItem(this.KEYS.NOTES, JSON.stringify(notes));
    }

    // Events methods
    static getEvents() {
        const events = localStorage.getItem(this.KEYS.EVENTS);
        return events ? JSON.parse(events) : null;
    }

    static saveEvents(events) {
        localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(events));
    }

    // Notifications methods
    static getNotifications() {
        const notifications = localStorage.getItem(this.KEYS.NOTIFICATIONS);
        return notifications ? JSON.parse(notifications) : null;
    }

    static saveNotifications(notifications) {
        localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }

    // Study sessions methods
    static getStudySessions() {
        const sessions = localStorage.getItem(this.KEYS.STUDY_SESSIONS);
        return sessions ? JSON.parse(sessions) : null;
    }

    static saveStudySessions(sessions) {
        localStorage.setItem(this.KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
    }

    // Theme methods
    static getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    }

    static saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    }

    // Clear all data
    static clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Export data
    static exportData() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                data[key] = JSON.parse(value);
            }
        });
        return data;
    }

    // Import data
    static importData(data) {
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
}