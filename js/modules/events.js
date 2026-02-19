import { StorageUtil } from '../utils/storage.js';

export class EventsModule {
    constructor() {
        this.events = StorageUtil.getEvents() || this.getDefaultEvents();
    }

    getDefaultEvents() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        return [
            {
                id: 1,
                title: 'Tech Symposium 2024',
                description: 'Annual technical festival with workshops and competitions',
                date: nextWeek.toISOString().split('T')[0],
                time: '10:00 AM',
                location: 'Main Auditorium',
                category: 'Academic',
                priority: 'high'
            },
            {
                id: 2,
                title: 'Guest Lecture: AI in Healthcare',
                description: 'Talk by Dr. Sarah Johnson from Stanford University',
                date: tomorrow.toISOString().split('T')[0],
                time: '2:00 PM',
                location: 'Lecture Hall 101',
                category: 'Seminar',
                priority: 'medium'
            },
            {
                id: 3,
                title: 'Sports Day Registration',
                description: 'Last date to register for inter-department sports',
                date: '2024-02-15',
                time: '5:00 PM',
                location: 'Sports Complex',
                category: 'Sports',
                priority: 'low'
            }
        ];
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Events & Notice Board</h2>
                    <button id="addEventBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Add Event
                    </button>
                </div>

                <!-- Countdown Banner -->
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 class="text-lg font-semibold mb-2">Upcoming Events Countdown</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="countdownTimers">
                        ${this.renderCountdowns()}
                    </div>
                </div>

                <!-- Events Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Upcoming Events -->
                    <div class="lg:col-span-2">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h3>
                            <div class="space-y-4" id="upcomingEvents">
                                ${this.renderUpcomingEvents()}
                            </div>
                        </div>
                    </div>

                    <!-- Notice Board -->
                    <div>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notice Board</h3>
                            <div class="space-y-3" id="noticeBoard">
                                ${this.renderNotices()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calendar View -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Event Calendar</h3>
                    <div id="eventCalendar" class="grid grid-cols-7 gap-2">
                        ${this.renderCalendar()}
                    </div>
                </div>
            </div>

            <!-- Add/Edit Event Modal -->
            <div id="eventModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4" id="modalTitle">Add Event</h3>
                    <form id="eventForm" class="space-y-4">
                        <input type="hidden" id="eventId">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input type="text" id="eventTitle" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea id="eventDescription" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input type="date" id="eventDate" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                            <input type="time" id="eventTime" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                            <input type="text" id="eventLocation" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select id="eventCategory" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                <option value="Academic">Academic</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Sports">Sports</option>
                                <option value="Cultural">Cultural</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                            <select id="eventPriority" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div class="flex space-x-3 pt-4">
                            <button type="submit" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
                            <button type="button" id="closeModalBtn" class="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.startCountdownUpdates();
    }

    renderCountdowns() {
        const upcomingEvents = this.events
            .filter(event => new Date(event.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        return upcomingEvents.map(event => {
            const daysLeft = this.calculateDaysLeft(event.date);
            return `
                <div class="text-center">
                    <p class="text-sm opacity-90">${event.title}</p>
                    <p class="text-3xl font-bold mt-1">${daysLeft}</p>
                    <p class="text-xs opacity-75">days left</p>
                </div>
            `;
        }).join('');
    }

    renderUpcomingEvents() {
        const upcomingEvents = this.events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return upcomingEvents.map(event => `
            <div class="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl event-item" data-id="${event.id}">
                <div class="flex-shrink-0 w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex flex-col items-center justify-center">
                    <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        ${new Date(event.date).getDate()}
                    </span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        ${new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                </div>
                <div class="flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-800 dark:text-white">${event.title}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${event.description}</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <span class="text-xs text-gray-500 dark:text-gray-500">
                                    <i class="far fa-clock mr-1"></i>${event.time}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-500">
                                    <i class="fas fa-map-marker-alt mr-1"></i>${event.location}
                                </span>
                            </div>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-lg ${this.getPriorityColor(event.priority)}">
                            ${event.priority}
                        </span>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-event text-indigo-600 hover:text-indigo-800" data-id="${event.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-event text-red-600 hover:text-red-800" data-id="${event.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderNotices() {
        const notices = this.events
            .filter(event => new Date(event.date) < new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        return notices.map(notice => `
            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <p class="text-sm font-medium text-gray-800 dark:text-white">${notice.title}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">${notice.date}</p>
            </div>
        `).join('');
    }

    renderCalendar() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Add day names
        dayNames.forEach(day => {
            days.push(`<div class="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">${day}</div>`);
        });

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push('<div class="h-12"></div>');
        }

        // Add days of month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(today.getFullYear(), today.getMonth(), d);
            const dateStr = date.toISOString().split('T')[0];
            const hasEvent = this.events.some(event => event.date === dateStr);
            
            days.push(`
                <div class="h-12 flex items-center justify-center rounded-lg ${hasEvent ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
                    ${d}
                </div>
            `);
        }

        return days.join('');
    }

    getPriorityColor(priority) {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    calculateDaysLeft(eventDate) {
        const today = new Date();
        const event = new Date(eventDate);
        const diffTime = event - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    startCountdownUpdates() {
        setInterval(() => {
            const countdownContainer = document.getElementById('countdownTimers');
            if (countdownContainer) {
                countdownContainer.innerHTML = this.renderCountdowns();
            }
        }, 60000); // Update every minute
    }

    attachEventListeners() {
        // Add event button
        document.getElementById('addEventBtn').addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add Event';
            document.getElementById('eventForm').reset();
            document.getElementById('eventId').value = '';
            document.getElementById('eventModal').classList.remove('hidden');
        });

        // Close modal button
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('eventModal').classList.add('hidden');
        });

        // Form submission
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        // Edit and delete buttons (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-event')) {
                const id = parseInt(e.target.closest('.edit-event').dataset.id);
                this.editEvent(id);
            }
            if (e.target.closest('.delete-event')) {
                const id = parseInt(e.target.closest('.delete-event').dataset.id);
                this.deleteEvent(id);
            }
        });
    }

    saveEvent() {
        const timeValue = document.getElementById('eventTime').value;
        const timeFormatted = timeValue ? 
            new Date('2000-01-01T' + timeValue).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
            : '12:00 PM';

        const eventData = {
            id: document.getElementById('eventId').value || Date.now(),
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            time: timeFormatted,
            location: document.getElementById('eventLocation').value,
            category: document.getElementById('eventCategory').value,
            priority: document.getElementById('eventPriority').value
        };

        if (document.getElementById('eventId').value) {
            // Update existing
            const index = this.events.findIndex(e => e.id == eventData.id);
            this.events[index] = eventData;
        } else {
            // Add new
            this.events.push(eventData);
        }

        StorageUtil.saveEvents(this.events);
        document.getElementById('eventModal').classList.add('hidden');
        this.render(); // Re-render the events section
    }

    editEvent(id) {
        const event = this.events.find(e => e.id === id);
        if (event) {
            document.getElementById('modalTitle').textContent = 'Edit Event';
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventDate').value = event.date;
            
            // Convert time back to 24-hour format for input
            if (event.time) {
                const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1]);
                    const minutes = timeMatch[2];
                    const ampm = timeMatch[3].toUpperCase();
                    
                    if (ampm === 'PM' && hours < 12) hours += 12;
                    if (ampm === 'AM' && hours === 12) hours = 0;
                    
                    document.getElementById('eventTime').value = `${hours.toString().padStart(2, '0')}:${minutes}`;
                }
            }
            
            document.getElementById('eventLocation').value = event.location;
            document.getElementById('eventCategory').value = event.category;
            document.getElementById('eventPriority').value = event.priority;
            document.getElementById('eventModal').classList.remove('hidden');
        }
    }

    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== id);
            StorageUtil.saveEvents(this.events);
            this.render(); // Re-render the events section
        }
    }
}