import { AuthModule } from './modules/auth.js';
import { TimetableModule } from './modules/timetable.js';
import { AttendanceModule } from './modules/attendance.js';
import { NotesModule } from './modules/notes.js';
import { EventsModule } from './modules/events.js';
import { MapModule } from './modules/map.js';
import { NotificationsModule } from './modules/notifications.js';
import { StudyPlannerModule } from './modules/studyplanner.js';
import { AnalyticsModule } from './modules/analytics.js';
import { StorageUtil } from './utils/storage.js';
import { ThemeUtil } from './utils/theme.js';

class SmartCampusApp {
    constructor() {
        this.modules = {};
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        // Check authentication
        if (!AuthModule.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize theme
        ThemeUtil.init();

        // Initialize modules
        this.modules = {
            auth: AuthModule,
            timetable: new TimetableModule(),
            attendance: new AttendanceModule(),
            notes: new NotesModule(),
            events: new EventsModule(),
            map: new MapModule(),
            notifications: new NotificationsModule(),
            studyplanner: new StudyPlannerModule(),
            analytics: new AnalyticsModule()
        };

        // Setup event listeners
        this.setupEventListeners();
        
        // Load user data
        this.loadUserData();
        
        // Load initial section
        this.loadSection('dashboard');
        
        // Initialize notifications
        this.modules.notifications.init();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.loadSection(section);
            });
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            AuthModule.logout();
        });

        // Notifications toggle
        document.getElementById('notificationsBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notificationsPanel').classList.toggle('hidden');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', () => {
            document.getElementById('notificationsPanel').classList.add('hidden');
        });
    }

    loadUserData() {
        const user = StorageUtil.getUser();
        if (user) {
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userDept').textContent = user.department;
        }
    }

    loadSection(section) {
        this.currentSection = section;
        
        // Update page title
        document.getElementById('pageTitle').textContent = 
            section.charAt(0).toUpperCase() + section.slice(1);

        // Update active sidebar link
        document.querySelectorAll('[data-section]').forEach(link => {
            link.classList.remove('text-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-900/20');
            if (link.dataset.section === section) {
                link.classList.add('text-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-900/20');
            }
        });

        // Load section content
        if (section === 'dashboard') {
            this.loadDashboard();
        } else {
            this.loadModuleSection(section);
        }
    }

    loadDashboard() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `...`; // Dashboard HTML content
        
        // Initialize dashboard charts
        this.modules.analytics.initDashboardCharts();
        
        // Load today's schedule
        this.modules.timetable.renderTodaySchedule();
        
        // Update stats
        this.updateDashboardStats();
    }

    loadModuleSection(moduleName) {
        if (this.modules[moduleName]) {
            this.modules[moduleName].render();
        }
    }

    updateDashboardStats() {
        // Update stats with real data from storage
        const attendance = StorageUtil.getAttendance();
        const timetable = StorageUtil.getTimetable();
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        const todayClasses = timetable.filter(cls => cls.day === today).length;
        const avgAttendance = attendance.length > 0 
            ? (attendance.filter(a => a.present).length / attendance.length * 100).toFixed(1)
            : 85;
        
        document.getElementById('todayClasses').textContent = todayClasses;
        document.getElementById('attendancePercent').textContent = avgAttendance + '%';
    }
}

// Initialize app
new SmartCampusApp();