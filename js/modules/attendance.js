import { StorageUtil } from '../utils/storage.js';

export class AttendanceModule {
    constructor() {
        this.attendance = StorageUtil.getAttendance() || this.getDefaultAttendance();
        this.subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
    }

    getDefaultAttendance() {
        const attendance = [];
        const dates = this.generateLast30Days();
        
        dates.forEach(date => {
            this.subjects.forEach(subject => {
                attendance.push({
                    id: `${date}-${subject}`,
                    date: date,
                    subject: subject,
                    present: Math.random() > 0.15 // 85% attendance rate
                });
            });
        });
        
        return attendance;
    }

    generateLast30Days() {
        const dates = [];
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        return dates;
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <!-- Attendance Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.renderSummaryCards()}
                </div>

                <!-- Attendance Chart and Details -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Attendance Overview</h3>
                        <canvas id="attendanceChart"></canvas>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject-wise Attendance</h3>
                        <div class="space-y-4" id="subjectAttendance">
                            ${this.renderSubjectAttendance()}
                        </div>
                    </div>
                </div>

                <!-- Attendance Records Table -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Recent Attendance</h3>
                        <div class="flex space-x-2">
                            <select id="subjectFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                                <option value="all">All Subjects</option>
                                ${this.subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                            </select>
                            <input type="date" id="dateFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b dark:border-gray-700">
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Subject</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="attendanceTableBody">
                                ${this.renderAttendanceRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.initializeChart();
        this.attachEventListeners();
    }

    renderSummaryCards() {
        const totalClasses = this.attendance.length;
        const presentClasses = this.attendance.filter(a => a.present).length;
        const attendancePercent = ((presentClasses / totalClasses) * 100).toFixed(1);
        
        const subjectStats = this.subjects.map(subject => {
            const subjectAttendance = this.attendance.filter(a => a.subject === subject);
            const present = subjectAttendance.filter(a => a.present).length;
            return {
                subject,
                percent: ((present / subjectAttendance.length) * 100).toFixed(1)
            };
        });

        const lowestSubject = subjectStats.reduce((min, curr) => 
            parseFloat(curr.percent) < parseFloat(min.percent) ? curr : min
        );

        return `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Overall Attendance</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${attendancePercent}%</p>
                <p class="text-sm text-green-600 mt-2">${presentClasses}/${totalClasses} classes</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Best Subject</p>
                <p class="text-xl font-bold text-gray-800 dark:text-white">${subjectStats[0].subject}</p>
                <p class="text-sm text-green-600 mt-2">${subjectStats[0].percent}%</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Needs Improvement</p>
                <p class="text-xl font-bold text-gray-800 dark:text-white">${lowestSubject.subject}</p>
                <p class="text-sm text-yellow-600 mt-2">${lowestSubject.percent}%</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Required to Maintain</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${this.calculateRequiredAttendance()}%</p>
                <p class="text-sm text-blue-600 mt-2">for 75% target</p>
            </div>
        `;
    }

    renderSubjectAttendance() {
        return this.subjects.map(subject => {
            const subjectAttendance = this.attendance.filter(a => a.subject === subject);
            const present = subjectAttendance.filter(a => a.present).length;
            const total = subjectAttendance.length;
            const percentage = ((present / total) * 100).toFixed(1);
            
            return `
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${subject}</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAttendanceRows(filterSubject = 'all', filterDate = '') {
        let filtered = [...this.attendance];
        
        if (filterSubject !== 'all') {
            filtered = filtered.filter(a => a.subject === filterSubject);
        }
        
        if (filterDate) {
            filtered = filtered.filter(a => a.date === filterDate);
        }

        // Get last 20 records
        filtered = filtered.slice(-20).reverse();

        return filtered.map(record => `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4 text-gray-800 dark:text-white">${new Date(record.date).toLocaleDateString()}</td>
                <td class="py-3 px-4 text-gray-800 dark:text-white">${record.subject}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 ${record.present ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-lg text-sm">
                        ${record.present ? 'Present' : 'Absent'}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <button class="toggle-attendance text-indigo-600 hover:text-indigo-800" data-id="${record.id}">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    calculateRequiredAttendance() {
        const totalClasses = this.attendance.length;
        const presentClasses = this.attendance.filter(a => a.present).length;
        const targetPercent = 75;
        
        const required = Math.ceil((targetPercent * totalClasses / 100) - presentClasses);
        return required > 0 ? required : 0;
    }

    initializeChart() {
        setTimeout(() => {
            const ctx = document.getElementById('attendanceChart').getContext('2d');
            
            // Group attendance by date
            const attendanceByDate = {};
            this.attendance.forEach(record => {
                if (!attendanceByDate[record.date]) {
                    attendanceByDate[record.date] = { present: 0, total: 0 };
                }
                attendanceByDate[record.date].total++;
                if (record.present) {
                    attendanceByDate[record.date].present++;
                }
            });

            const dates = Object.keys(attendanceByDate).slice(-15);
            const percentages = dates.map(date => 
                (attendanceByDate[date].present / attendanceByDate[date].total * 100).toFixed(1)
            );

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'Attendance %',
                        data: percentages,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    }
                }
            });
        }, 100);
    }

    attachEventListeners() {
        const subjectFilter = document.getElementById('subjectFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (subjectFilter) {
            subjectFilter.addEventListener('change', () => {
                document.getElementById('attendanceTableBody').innerHTML = 
                    this.renderAttendanceRows(subjectFilter.value, dateFilter.value);
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                document.getElementById('attendanceTableBody').innerHTML = 
                    this.renderAttendanceRows(subjectFilter.value, dateFilter.value);
            });
        }

        // Toggle attendance buttons
        document.querySelectorAll('.toggle-attendance').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.toggleAttendance(id);
            });
        });
    }

    toggleAttendance(id) {
        const record = this.attendance.find(a => a.id === id);
        if (record) {
            record.present = !record.present;
            StorageUtil.saveAttendance(this.attendance);
            this.render(); // Re-render the attendance section
        }
    }
}