import { StorageUtil } from '../utils/storage.js';

export class NotificationsModule {
    constructor() {
        this.notifications = [];
        this.notificationTypes = {
            info: { icon: 'fa-info-circle', color: 'blue' },
            success: { icon: 'fa-check-circle', color: 'green' },
            warning: { icon: 'fa-exclamation-triangle', color: 'yellow' },
            alert: { icon: 'fa-bell', color: 'red' }
        };
    }

    init() {
        this.loadNotifications();
        this.setupNotificationListeners();
        this.startNotificationChecker();
    }

    loadNotifications() {
        // Load saved notifications or create defaults
        this.notifications = StorageUtil.getNotifications() || this.getDefaultNotifications();
        this.renderNotifications();
    }

    getDefaultNotifications() {
        const now = new Date();
        const hourLater = new Date(now);
        hourLater.setHours(hourLater.getHours() + 1);

        return [
            {
                id: 1,
                type: 'info',
                title: 'Class Reminder',
                message: 'Mathematics class in 10 minutes',
                time: now.toISOString(),
                read: false,
                action: 'View Class'
            },
            {
                id: 2,
                type: 'warning',
                title: 'Assignment Due',
                message: 'Physics lab report due tomorrow',
                time: now.toISOString(),
                read: false,
                action: 'Submit Now'
            },
            {
                id: 3,
                type: 'success',
                title: 'Attendance Updated',
                message: 'Your attendance has been marked for today',
                time: now.toISOString(),
                read: true,
                action: 'View Details'
            },
            {
                id: 4,
                type: 'alert',
                title: 'Event Today',
                message: 'Tech Symposium starts at 2 PM',
                time: now.toISOString(),
                read: false,
                action: 'View Event'
            }
        ];
    }

    renderNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        if (!notificationsList) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        // Update notification badge
        const badge = document.querySelector('.fa-bell + span');
        if (badge) {
            if (unreadCount > 0) {
                badge.classList.remove('hidden');
                badge.textContent = unreadCount;
            } else {
                badge.classList.add('hidden');
            }
        }

        notificationsList.innerHTML = this.notifications.map(notification => `
            <div class="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}" data-id="${notification.id}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <i class="fas ${this.notificationTypes[notification.type].icon} text-${this.notificationTypes[notification.type].color}-500 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800 dark:text-white">${notification.title}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${notification.message}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${this.timeAgo(notification.time)}</p>
                        <button class="mt-2 text-xs text-indigo-600 hover:text-indigo-800 notification-action" data-id="${notification.id}">
                            ${notification.action} <i class="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                    ${!notification.read ? '<span class="w-2 h-2 bg-indigo-600 rounded-full"></span>' : ''}
                </div>
            </div>
        `).join('') || '<div class="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>';

        this.attachNotificationListeners();
    }

    timeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    attachNotificationListeners() {
        // Mark as read when clicked
        document.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-action')) {
                    const id = parseInt(e.currentTarget.dataset.id);
                    this.markAsRead(id);
                }
            });
        });

        // Notification action buttons
        document.querySelectorAll('.notification-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                this.handleNotificationAction(id);
            });
        });
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            StorageUtil.saveNotifications(this.notifications);
            this.renderNotifications();
        }
    }

    handleNotificationAction(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            // Mark as read
            this.markAsRead(id);
            
            // Trigger appropriate action
            switch(notification.title) {
                case 'Class Reminder':
                    // Navigate to timetable
                    document.querySelector('[data-section="timetable"]').click();
                    break;
                case 'Assignment Due':
                    // Navigate to notes
                    document.querySelector('[data-section="notes"]').click();
                    break;
                case 'Event Today':
                    // Navigate to events
                    document.querySelector('[data-section="events"]').click();
                    break;
            }
            
            // Hide notifications panel
            document.getElementById('notificationsPanel').classList.add('hidden');
        }
    }

    setupNotificationListeners() {
        // Listen for events that should trigger notifications
        window.addEventListener('class-reminder', (e) => {
            this.addNotification({
                type: 'info',
                title: 'Class Reminder',
                message: `${e.detail.subject} in 10 minutes`,
                action: 'View Class'
            });
        });

        window.addEventListener('assignment-due', (e) => {
            this.addNotification({
                type: 'warning',
                title: 'Assignment Due',
                message: e.detail.message,
                action: 'Submit Now'
            });
        });

        window.addEventListener('attendance-update', (e) => {
            this.addNotification({
                type: 'success',
                title: 'Attendance Updated',
                message: e.detail.message,
                action: 'View Details'
            });
        });
    }

    startNotificationChecker() {
        // Check for time-based notifications every minute
        setInterval(() => {
            this.checkForTimeBasedNotifications();
        }, 60000);
    }

    checkForTimeBasedNotifications() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Check for upcoming classes (from timetable)
        const timetable = StorageUtil.getTimetable() || [];
        const today = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        timetable.filter(cls => cls.day === today).forEach(cls => {
            const [startTime] = cls.time.split('-');
            const [hours, minutes] = startTime.split(':');
            const classTime = new Date();
            classTime.setHours(parseInt(hours), parseInt(minutes), 0);
            
            const timeDiff = (classTime - now) / (1000 * 60); // minutes
            
            // Notify 10 minutes before class
            if (timeDiff > 9 && timeDiff < 11) {
                this.addNotification({
                    type: 'info',
                    title: 'Class Reminder',
                    message: `${cls.subject} with ${cls.teacher} in 10 minutes`,
                    action: 'View Class'
                });
            }
        });

        // Check for events today
        const events = StorageUtil.getEvents() || [];
        events.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate.toDateString() === now.toDateString()) {
                const [hours, minutes] = event.time.match(/\d+/g);
                const eventTime = new Date();
                eventTime.setHours(parseInt(hours), parseInt(minutes), 0);
                
                const timeDiff = (eventTime - now) / (1000 * 60);
                
                if (timeDiff > 29 && timeDiff < 31) {
                    this.addNotification({
                        type: 'alert',
                        title: 'Event Starting Soon',
                        message: `${event.title} starts in 30 minutes`,
                        action: 'View Event'
                    });
                }
            }
        });
    }

    addNotification(notificationData) {
        const newNotification = {
            id: Date.now(),
            time: new Date().toISOString(),
            read: false,
            ...notificationData
        };

        this.notifications.unshift(newNotification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        StorageUtil.saveNotifications(this.notifications);
        this.renderNotifications();

        // Show toast notification
        this.showToast(newNotification);
    }

    showToast(notification) {
        const toast = document.getElementById('notificationToast');
        if (!toast) return;

        toast.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-${this.notificationTypes[notification.type].color}-500 animate-slide-in">
                <div class="flex items-start">
                    <i class="fas ${this.notificationTypes[notification.type].icon} text-${this.notificationTypes[notification.type].color}-500 mr-3 mt-1"></i>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800 dark:text-white">${notification.title}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${notification.message}</p>
                    </div>
                    <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.classList.add('hidden')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        toast.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        StorageUtil.saveNotifications(this.notifications);
        this.renderNotifications();
    }

    clearAll() {
        this.notifications = [];
        StorageUtil.saveNotifications(this.notifications);
        this.renderNotifications();
    }
}