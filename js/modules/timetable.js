import { StorageUtil } from '../utils/storage.js';

export class TimetableModule {
    constructor() {
        this.timetable = StorageUtil.getTimetable() || this.getDefaultTimetable();
    }

    getDefaultTimetable() {
        return [
            { id: 1, day: 'Monday', time: '09:00-10:30', subject: 'Mathematics', teacher: 'Dr. Smith', room: '101' },
            { id: 2, day: 'Monday', time: '11:00-12:30', subject: 'Physics', teacher: 'Prof. Johnson', room: '203' },
            { id: 3, day: 'Tuesday', time: '09:00-10:30', subject: 'Computer Science', teacher: 'Dr. Williams', room: '305' },
            { id: 4, day: 'Tuesday', time: '11:00-12:30', subject: 'Chemistry', teacher: 'Dr. Brown', room: '102' },
            { id: 5, day: 'Wednesday', time: '09:00-10:30', subject: 'Mathematics', teacher: 'Dr. Smith', room: '101' },
            { id: 6, day: 'Wednesday', time: '11:00-12:30', subject: 'Physics Lab', teacher: 'Prof. Johnson', room: 'Labs' },
            { id: 7, day: 'Thursday', time: '09:00-10:30', subject: 'Computer Science', teacher: 'Dr. Williams', room: '305' },
            { id: 8, day: 'Thursday', time: '11:00-12:30', subject: 'Chemistry Lab', teacher: 'Dr. Brown', room: 'Labs' },
            { id: 9, day: 'Friday', time: '09:00-10:30', subject: 'Mathematics', teacher: 'Dr. Smith', room: '101' },
            { id: 10, day: 'Friday', time: '11:00-12:30', subject: 'Elective', teacher: 'Various', room: 'Auditorium' }
        ];
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Timetable Manager</h2>
                    <button id="addClassBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Add Class
                    </button>
                </div>
                
                <!-- Day Filter -->
                <div class="flex space-x-2 mb-6 overflow-x-auto pb-2" id="dayFilter">
                    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => `
                        <button class="day-filter px-4 py-2 rounded-lg ${day === 'Monday' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}" data-day="${day}">
                            ${day}
                        </button>
                    `).join('')}
                </div>
                
                <!-- Timetable Grid -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b dark:border-gray-700">
                                <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Time</th>
                                <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Subject</th>
                                <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Teacher</th>
                                <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Room</th>
                                <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="timetableBody">
                            ${this.renderTimetableRows('Monday')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Add/Edit Class Modal -->
            <div id="classModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4" id="modalTitle">Add Class</h3>
                    <form id="classForm" class="space-y-4">
                        <input type="hidden" id="classId">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Day</label>
                            <select id="classDay" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                            <input type="text" id="classTime" placeholder="09:00-10:30" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <input type="text" id="classSubject" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teacher</label>
                            <input type="text" id="classTeacher" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room</label>
                            <input type="text" id="classRoom" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
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
    }

    renderTimetableRows(day) {
        const dayClasses = this.timetable.filter(cls => cls.day === day);
        if (dayClasses.length === 0) {
            return '<tr><td colspan="5" class="text-center py-8 text-gray-500 dark:text-gray-400">No classes scheduled</td></tr>';
        }

        return dayClasses.map(cls => `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50" data-id="${cls.id}">
                <td class="py-3 px-4 text-gray-800 dark:text-white">${cls.time}</td>
                <td class="py-3 px-4">
                    <div class="font-medium text-gray-800 dark:text-white">${cls.subject}</div>
                </td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${cls.teacher}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm">
                        Room ${cls.room}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <button class="edit-class text-indigo-600 hover:text-indigo-800 mr-2" data-id="${cls.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-class text-red-600 hover:text-red-800" data-id="${cls.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    attachEventListeners() {
        // Day filter buttons
        document.querySelectorAll('.day-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.day-filter').forEach(b => {
                    b.classList.remove('bg-indigo-600', 'text-white');
                    b.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                });
                e.target.classList.add('bg-indigo-600', 'text-white');
                const day = e.target.dataset.day;
                document.getElementById('timetableBody').innerHTML = this.renderTimetableRows(day);
            });
        });

        // Add class button
        document.getElementById('addClassBtn').addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add Class';
            document.getElementById('classForm').reset();
            document.getElementById('classId').value = '';
            document.getElementById('classModal').classList.remove('hidden');
        });

        // Close modal button
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('classModal').classList.add('hidden');
        });

        // Form submission
        document.getElementById('classForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClass();
        });

        // Edit buttons
        document.querySelectorAll('.edit-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.editClass(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteClass(id);
            });
        });
    }

    saveClass() {
        const classData = {
            id: document.getElementById('classId').value || Date.now(),
            day: document.getElementById('classDay').value,
            time: document.getElementById('classTime').value,
            subject: document.getElementById('classSubject').value,
            teacher: document.getElementById('classTeacher').value,
            room: document.getElementById('classRoom').value
        };

        if (document.getElementById('classId').value) {
            // Update existing
            const index = this.timetable.findIndex(c => c.id == classData.id);
            this.timetable[index] = classData;
        } else {
            // Add new
            this.timetable.push(classData);
        }

        StorageUtil.saveTimetable(this.timetable);
        document.getElementById('classModal').classList.add('hidden');
        this.render(); // Re-render the timetable
    }

    editClass(id) {
        const classData = this.timetable.find(c => c.id === id);
        if (classData) {
            document.getElementById('modalTitle').textContent = 'Edit Class';
            document.getElementById('classId').value = classData.id;
            document.getElementById('classDay').value = classData.day;
            document.getElementById('classTime').value = classData.time;
            document.getElementById('classSubject').value = classData.subject;
            document.getElementById('classTeacher').value = classData.teacher;
            document.getElementById('classRoom').value = classData.room;
            document.getElementById('classModal').classList.remove('hidden');
        }
    }

    deleteClass(id) {
        if (confirm('Are you sure you want to delete this class?')) {
            this.timetable = this.timetable.filter(c => c.id !== id);
            StorageUtil.saveTimetable(this.timetable);
            this.render(); // Re-render the timetable
        }
    }

    renderTodaySchedule() {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayClasses = this.timetable.filter(cls => cls.day === today);
        const scheduleContainer = document.getElementById('todaySchedule');
        
        if (scheduleContainer) {
            scheduleContainer.innerHTML = todayClasses.map(cls => `
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div class="w-2 h-12 bg-indigo-500 rounded-full mr-4"></div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 dark:text-white">${cls.subject}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${cls.teacher} • Room ${cls.room}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-indigo-600 dark:text-indigo-400 font-medium">${cls.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}