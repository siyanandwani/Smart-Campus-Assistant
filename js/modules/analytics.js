import { StorageUtil } from '../utils/storage.js';

export class AnalyticsModule {
    constructor() {
        this.charts = {};
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h2>
                
                <!-- Overview Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.renderOverviewCards()}
                </div>

                <!-- Charts Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Attendance Trend -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Attendance Trend</h3>
                        <canvas id="attendanceTrendChart"></canvas>
                    </div>

                    <!-- Subject Performance -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject Performance</h3>
                        <canvas id="subjectPerformanceChart"></canvas>
                    </div>

                    <!-- Study Hours Distribution -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Study Hours Distribution</h3>
                        <canvas id="studyHoursChart"></canvas>
                    </div>

                    <!-- Class Schedule Analysis -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Class Distribution</h3>
                        <canvas id="classDistributionChart"></canvas>
                    </div>
                </div>

                <!-- Detailed Statistics -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Performers</h3>
                        <div class="space-y-3" id="topPerformers">
                            ${this.renderTopPerformers()}
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Areas for Improvement</h3>
                        <div class="space-y-3" id="improvementAreas">
                            ${this.renderImprovementAreas()}
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Progress</h3>
                        <div class="space-y-3" id="monthlyProgress">
                            ${this.renderMonthlyProgress()}
                        </div>
                    </div>
                </div>

                <!-- Export Options -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Export Reports</h3>
                    <div class="flex space-x-4">
                        <button class="export-btn px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" data-type="pdf">
                            <i class="fas fa-file-pdf mr-2"></i>Export as PDF
                        </button>
                        <button class="export-btn px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" data-type="csv">
                            <i class="fas fa-file-csv mr-2"></i>Export as CSV
                        </button>
                        <button class="export-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-type="image">
                            <i class="fas fa-camera mr-2"></i>Export Charts
                        </button>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            this.initializeCharts();
        }, 100);
        
        this.attachEventListeners();
    }

    renderOverviewCards() {
        const attendance = StorageUtil.getAttendance() || [];
        const timetable = StorageUtil.getTimetable() || [];
        const notes = StorageUtil.getNotes() || [];
        
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(a => a.present).length;
        const attendancePercent = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
        
        const totalStudyHours = this.calculateTotalStudyHours();
        const completionRate = this.calculateCompletionRate();

        return `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${attendancePercent}%</p>
                <p class="text-sm text-green-600 mt-2">${presentClasses}/${totalClasses} classes</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Study Hours</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${totalStudyHours}</p>
                <p class="text-sm text-blue-600 mt-2">this month</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Study Materials</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${notes.length}</p>
                <p class="text-sm text-purple-600 mt-2">notes & resources</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Task Completion</p>
                <p class="text-3xl font-bold text-gray-800 dark:text-white">${completionRate}%</p>
                <p class="text-sm text-yellow-600 mt-2">weekly average</p>
            </div>
        `;
    }

    calculateTotalStudyHours() {
        // Simulate study hours based on timetable and attendance
        const timetable = StorageUtil.getTimetable() || [];
        const classHours = timetable.length * 1.5; // Each class is 1.5 hours
        const selfStudyHours = Math.floor(classHours * 0.5); // Self study is 50% of class time
        return classHours + selfStudyHours;
    }

    calculateCompletionRate() {
        // Simulate task completion rate
        return Math.floor(Math.random() * 20 + 70); // Random between 70-90%
    }

    initializeCharts() {
        this.initAttendanceTrendChart();
        this.initSubjectPerformanceChart();
        this.initStudyHoursChart();
        this.initClassDistributionChart();
    }

    initAttendanceTrendChart() {
        const ctx = document.getElementById('attendanceTrendChart').getContext('2d');
        
        const attendance = StorageUtil.getAttendance() || [];
        const last30Days = this.getLast30Days();
        
        // Group attendance by date
        const dailyAttendance = last30Days.map(date => {
            const dayAttendance = attendance.filter(a => a.date === date);
            if (dayAttendance.length === 0) return null;
            const present = dayAttendance.filter(a => a.present).length;
            return (present / dayAttendance.length) * 100;
        });

        this.charts.attendanceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Attendance %',
                    data: dailyAttendance,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: (context) => {
                        const value = context.raw;
                        if (value < 60) return '#ef4444';
                        if (value < 75) return '#f59e0b';
                        return '#10b981';
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    }
                }
            }
        });
    }

    initSubjectPerformanceChart() {
        const ctx = document.getElementById('subjectPerformanceChart').getContext('2d');
        
        const attendance = StorageUtil.getAttendance() || [];
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
        
        const subjectData = subjects.map(subject => {
            const subjectAttendance = attendance.filter(a => a.subject === subject);
            if (subjectAttendance.length === 0) return 85;
            const present = subjectAttendance.filter(a => a.present).length;
            return (present / subjectAttendance.length) * 100;
        });

        this.charts.subjectPerformance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Performance %',
                    data: subjectData,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: '#4f46e5',
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                }
            }
        });
    }

    initStudyHoursChart() {
        const ctx = document.getElementById('studyHoursChart').getContext('2d');
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const hours = days.map(() => Math.floor(Math.random() * 4 + 2)); // Random 2-6 hours

        this.charts.studyHours = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Study Hours',
                    data: hours,
                    backgroundColor: [
                        '#4f46e5', '#10b981', '#f59e0b', '#ef4444', 
                        '#8b5cf6', '#ec4899', '#6366f1'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 8,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    }
                }
            }
        });
    }

    initClassDistributionChart() {
        const ctx = document.getElementById('classDistributionChart').getContext('2d');
        
        const timetable = StorageUtil.getTimetable() || [];
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Other'];
        
        const classCount = subjects.map(subject => {
            if (subject === 'Other') {
                return timetable.filter(c => !subjects.includes(c.subject)).length;
            }
            return timetable.filter(c => c.subject === subject).length;
        });

        this.charts.classDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjects,
                datasets: [{
                    data: classCount,
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    renderTopPerformers() {
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
        
        return subjects.map((subject, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                    <p class="font-medium text-gray-800 dark:text-white">${subject}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Score: ${Math.floor(Math.random() * 10 + 85)}%</p>
                </div>
                <span class="text-${index === 0 ? 'yellow' : 'gray'}-400">
                    <i class="fas fa-trophy"></i>
                </span>
            </div>
        `).join('');
    }

    renderImprovementAreas() {
        const areas = [
            { subject: 'Physics', issue: 'Low attendance', action: 'Attend more classes' },
            { subject: 'Chemistry', issue: 'Poor lab performance', action: 'Practice experiments' },
            { subject: 'Mathematics', issue: 'Problem solving', action: 'More practice' },
            { subject: 'Assignments', issue: 'Late submissions', action: 'Start early' }
        ];

        return areas.map(area => `
            <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="font-medium text-gray-800 dark:text-white">${area.subject}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${area.issue}</p>
                <p class="text-xs text-indigo-600 dark:text-indigo-400 mt-2">${area.action}</p>
            </div>
        `).join('');
    }

    renderMonthlyProgress() {
        const months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const progress = months.map(() => Math.floor(Math.random() * 20 + 70));

        return months.map((month, index) => `
            <div class="space-y-1">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">${month}</span>
                    <span class="text-gray-800 dark:text-white font-medium">${progress[index]}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-indigo-600 h-2 rounded-full" style="width: ${progress[index]}%"></div>
                </div>
            </div>
        `).join('');
    }

    getLast30Days() {
        const dates = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    attachEventListeners() {
        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.exportData(type);
            });
        });
    }

    exportData(type) {
        switch(type) {
            case 'pdf':
                alert('Exporting as PDF... (Demo functionality)');
                break;
            case 'csv':
                this.exportAsCSV();
                break;
            case 'image':
                this.exportChartsAsImage();
                break;
        }
    }

    exportAsCSV() {
        const attendance = StorageUtil.getAttendance() || [];
        let csv = 'Date,Subject,Status\n';
        
        attendance.forEach(record => {
            csv += `${record.date},${record.subject},${record.present ? 'Present' : 'Absent'}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_report.csv';
        a.click();
    }

    exportChartsAsImage() {
        // Capture each chart as image
        Object.entries(this.charts).forEach(([name, chart]) => {
            const canvas = chart.canvas;
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}_chart.png`;
            a.click();
        });
    }

    initDashboardCharts() {
        // Initialize charts for dashboard view
        setTimeout(() => {
            // Attendance chart
            const attendanceCtx = document.getElementById('attendanceChart');
            if (attendanceCtx) {
                new Chart(attendanceCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        datasets: [{
                            data: [85, 92, 78, 88, 95],
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }

            // Performance chart
            const perfCtx = document.getElementById('performanceChart');
            if (perfCtx) {
                new Chart(perfCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Math', 'Physics', 'Chemistry', 'CS'],
                        datasets: [{
                            data: [88, 82, 75, 92],
                            backgroundColor: '#4f46e5'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }, 100);
    }
}