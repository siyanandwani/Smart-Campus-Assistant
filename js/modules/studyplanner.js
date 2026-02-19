import { StorageUtil } from '../utils/storage.js';

export class StudyPlannerModule {
    constructor() {
        this.studySessions = StorageUtil.getStudySessions() || [];
        this.subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
        this.studyTips = [
            'Study in 45-minute blocks with 15-minute breaks',
            'Review material within 24 hours of learning',
            'Use active recall instead of passive reading',
            'Teach concepts to someone else to reinforce learning',
            'Create mind maps for complex topics',
            'Practice problems > reading notes',
            'Get 7-8 hours of sleep for better memory consolidation',
            'Stay hydrated while studying',
            'Use the Pomodoro technique for better focus',
            'Review past exam papers for practice'
        ];
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">AI Study Planner</h2>
                    <button id="generatePlanBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-robot mr-2"></i>Generate Smart Plan
                    </button>
                </div>

                <!-- AI Recommendations -->
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-brain text-3xl mr-3"></i>
                        <h3 class="text-xl font-semibold">AI-Powered Recommendations</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="aiRecommendations">
                        ${this.generateAIRecommendations()}
                    </div>
                </div>

                <!-- Study Schedule -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Today's Plan -->
                    <div class="lg:col-span-2">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Today's Smart Schedule</h3>
                            <div class="space-y-3" id="todayPlan">
                                ${this.renderTodayPlan()}
                            </div>
                        </div>
                    </div>

                    <!-- Study Tips -->
                    <div>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Study Tips</h3>
                            <div class="space-y-3" id="studyTips">
                                ${this.renderStudyTips()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subject Performance Analysis -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject Performance Analysis</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="subjectAnalysis">
                        ${this.renderSubjectAnalysis()}
                    </div>
                </div>

                <!-- Weekly Study Plan -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Study Plan</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b dark:border-gray-700">
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Day</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Morning</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Afternoon</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Evening</th>
                                    <th class="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="weeklyPlanBody">
                                ${this.renderWeeklyPlan()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Generate Plan Modal -->
            <div id="planModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Generate Study Plan</h3>
                    <form id="planForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Study Goal</label>
                            <select id="studyGoal" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                <option value="exam">Exam Preparation</option>
                                <option value="daily">Daily Study</option>
                                <option value="project">Project Work</option>
                                <option value="revision">Quick Revision</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Hours/Day</label>
                            <input type="number" id="availableHours" min="1" max="12" value="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Subjects</label>
                            <select id="prioritySubjects" multiple class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" size="3">
                                ${this.subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Hold Ctrl to select multiple</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Study Time</label>
                            <select id="preferredTime" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                <option value="morning">Morning (6 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                <option value="evening">Evening (5 PM - 10 PM)</option>
                                <option value="night">Night (10 PM - 2 AM)</option>
                            </select>
                        </div>
                        <div class="flex space-x-3 pt-4">
                            <button type="submit" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate</button>
                            <button type="button" id="closeModalBtn" class="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    generateAIRecommendations() {
        const attendance = StorageUtil.getAttendance() || [];
        const timetable = StorageUtil.getTimetable() || [];
        
        // Analyze weak subjects based on attendance
        const weakSubjects = this.analyzeWeakSubjects(attendance);
        
        // Generate recommendations based on data
        const recommendations = [
            {
                subject: weakSubjects[0] || 'Mathematics',
                tip: 'Focus on this subject - your attendance is below 75%',
                action: 'Schedule extra practice'
            },
            {
                subject: 'Upcoming Exams',
                tip: this.getUpcomingExamsTip(timetable),
                action: 'View schedule'
            },
            {
                subject: 'Study Efficiency',
                tip: this.getStudyEfficiencyTip(),
                action: 'Try technique'
            },
            {
                subject: 'Break Reminder',
                tip: 'Take regular breaks to improve retention',
                action: 'Set reminder'
            }
        ];

        return recommendations.map(rec => `
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h4 class="font-medium mb-1">${rec.subject}</h4>
                <p class="text-sm opacity-90 mb-2">${rec.tip}</p>
                <button class="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                    ${rec.action} <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        `).join('');
    }

    analyzeWeakSubjects(attendance) {
        const subjectAttendance = {};
        
        attendance.forEach(record => {
            if (!subjectAttendance[record.subject]) {
                subjectAttendance[record.subject] = { present: 0, total: 0 };
            }
            subjectAttendance[record.subject].total++;
            if (record.present) {
                subjectAttendance[record.subject].present++;
            }
        });

        return Object.entries(subjectAttendance)
            .map(([subject, stats]) => ({
                subject,
                percentage: (stats.present / stats.total) * 100
            }))
            .sort((a, b) => a.percentage - b.percentage)
            .map(item => item.subject);
    }

    getUpcomingExamsTip(timetable) {
        const now = new Date();
        const examDates = [
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14)
        ];
        
        const daysUntilExam = Math.ceil((examDates[0] - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExam <= 7) {
            return `First exam in ${daysUntilExam} days - start intensive revision`;
        }
        return 'Plan your study schedule for upcoming exams';
    }

    getStudyEfficiencyTip() {
        const tips = [
            'Try the Pomodoro Technique: 25 min study, 5 min break',
            'Use active recall instead of passive reading',
            'Create mind maps for complex topics',
            'Teach concepts to others to reinforce learning'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    renderTodayPlan() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Rule-based study plan generation
        let plan = [];
        
        if (currentHour < 12) {
            plan = [
                { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', activity: 'Practice problems', completed: false },
                { time: '10:45 AM - 12:15 PM', subject: 'Physics', activity: 'Review concepts', completed: false },
                { time: '12:15 PM - 1:00 PM', subject: 'Break', activity: 'Lunch and rest', completed: false }
            ];
        } else if (currentHour < 17) {
            plan = [
                { time: '2:00 PM - 3:30 PM', subject: 'Computer Science', activity: 'Coding practice', completed: false },
                { time: '3:45 PM - 5:15 PM', subject: 'Chemistry', activity: 'Review notes', completed: false }
            ];
        } else {
            plan = [
                { time: '7:00 PM - 8:30 PM', subject: 'Revision', activity: 'Review today\'s topics', completed: false },
                { time: '8:45 PM - 9:30 PM', subject: 'Preview', activity: 'Preview tomorrow\'s topics', completed: false }
            ];
        }

        return plan.map(item => `
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input type="checkbox" class="mr-3 rounded text-indigo-600" ${item.completed ? 'checked' : ''}>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-800 dark:text-white">${item.subject}</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${item.time}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${item.activity}</p>
                </div>
            </div>
        `).join('');
    }

    renderStudyTips() {
        // Randomly select 5 tips
        const selectedTips = [...this.studyTips]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        return selectedTips.map(tip => `
            <div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <i class="fas fa-lightbulb text-indigo-600 dark:text-indigo-400 mr-2"></i>
                <span class="text-sm text-gray-700 dark:text-gray-300">${tip}</span>
            </div>
        `).join('');
    }

    renderSubjectAnalysis() {
        const attendance = StorageUtil.getAttendance() || [];
        
        return this.subjects.map(subject => {
            const subjectAttendance = attendance.filter(a => a.subject === subject);
            const presentCount = subjectAttendance.filter(a => a.present).length;
            const percentage = subjectAttendance.length > 0 
                ? (presentCount / subjectAttendance.length * 100).toFixed(1)
                : Math.random() * 30 + 70; // Random for demo
            
            let status, color;
            if (percentage >= 75) {
                status = 'Good';
                color = 'green';
            } else if (percentage >= 60) {
                status = 'Needs Improvement';
                color = 'yellow';
            } else {
                status = 'Critical';
                color = 'red';
            }

            return `
                <div class="p-4 border dark:border-gray-700 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-800 dark:text-white">${subject}</h4>
                        <span class="px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-600 dark:bg-${color}-900 dark:text-${color}-400">
                            ${status}
                        </span>
                    </div>
                    <div class="mb-2">
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div class="bg-${color}-500 h-2 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${percentage}% attendance</p>
                    <p class="text-xs text-gray-500 mt-2">${this.getSubjectRecommendation(subject, percentage)}</p>
                </div>
            `;
        }).join('');
    }

    getSubjectRecommendation(subject, percentage) {
        if (percentage < 60) {
            return `⚠️ Urgent: Need to focus on ${subject}`;
        } else if (percentage < 75) {
            return `📚 Increase study time for ${subject}`;
        } else {
            return `✅ Keep up the good work in ${subject}`;
        }
    }

    renderWeeklyPlan() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        return days.map(day => `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4 font-medium text-gray-800 dark:text-white">${day}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${this.getMorningSession(day)}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${this.getAfternoonSession(day)}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${this.getEveningSession(day)}</td>
                <td class="py-3 px-4">
                    <button class="edit-plan text-indigo-600 hover:text-indigo-800 mr-2" data-day="${day}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getMorningSession(day) {
        const sessions = {
            'Monday': 'Mathematics (9-11 AM)',
            'Tuesday': 'Physics (9-11 AM)',
            'Wednesday': 'Computer Science (9-11 AM)',
            'Thursday': 'Chemistry (9-11 AM)',
            'Friday': 'Mathematics (9-11 AM)',
            'Saturday': 'Revision (9-12 PM)',
            'Sunday': 'Rest/Review'
        };
        return sessions[day];
    }

    getAfternoonSession(day) {
        const sessions = {
            'Monday': 'Physics Lab (2-5 PM)',
            'Tuesday': 'Chemistry (2-4 PM)',
            'Wednesday': 'Programming Practice (2-5 PM)',
            'Thursday': 'Mathematics Problems (2-4 PM)',
            'Friday': 'Physics (2-4 PM)',
            'Saturday': 'Project Work (2-5 PM)',
            'Sunday': 'Light Reading'
        };
        return sessions[day];
    }

    getEveningSession(day) {
        const sessions = {
            'Monday': 'Review & Practice (7-9 PM)',
            'Tuesday': 'Assignment Work (7-9 PM)',
            'Wednesday': 'Group Study (7-9 PM)',
            'Thursday': 'Problem Solving (7-9 PM)',
            'Friday': 'Weekend Prep (7-9 PM)',
            'Saturday': 'Free Study (7-9 PM)',
            'Sunday': 'Plan Next Week (7-8 PM)'
        };
        return sessions[day];
    }

    attachEventListeners() {
        // Generate plan button
        document.getElementById('generatePlanBtn').addEventListener('click', () => {
            document.getElementById('planModal').classList.remove('hidden');
        });

        // Close modal button
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('planModal').classList.add('hidden');
        });

        // Form submission
        document.getElementById('planForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateStudyPlan();
        });

        // Checkbox listeners for today's plan
        document.querySelectorAll('#todayPlan input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const task = e.target.closest('.flex');
                if (e.target.checked) {
                    task.classList.add('opacity-50');
                } else {
                    task.classList.remove('opacity-50');
                }
            });
        });
    }

    generateStudyPlan() {
        const goal = document.getElementById('studyGoal').value;
        const hours = document.getElementById('availableHours').value;
        const prioritySubjects = Array.from(document.getElementById('prioritySubjects').selectedOptions).map(opt => opt.value);
        const preferredTime = document.getElementById('preferredTime').value;

        // Rule-based plan generation
        let planMessage = '';
        
        if (goal === 'exam') {
            planMessage = 'Focus on past papers and key concepts. Prioritize weak subjects.';
        } else if (goal === 'daily') {
            planMessage = 'Maintain consistent study schedule with regular breaks.';
        } else if (goal === 'project') {
            planMessage = 'Break project into milestones. Focus 2 hours daily on progress.';
        } else {
            planMessage = 'Quick review of notes and flashcards for active recall.';
        }

        // Create AI-generated plan
        const aiPlan = {
            id: Date.now(),
            goal,
            hours,
            prioritySubjects,
            preferredTime,
            plan: planMessage,
            schedule: this.createPersonalizedSchedule(hours, prioritySubjects, preferredTime),
            date: new Date().toISOString()
        };

        // Save to storage
        this.studySessions.push(aiPlan);
        StorageUtil.saveStudySessions(this.studySessions);

        // Show success message and close modal
        alert('AI Study Plan Generated! Check your personalized schedule.');
        document.getElementById('planModal').classList.add('hidden');
        
        // Refresh the display
        this.render();
    }

    createPersonalizedSchedule(hours, prioritySubjects, preferredTime) {
        const schedule = [];
        const timeSlots = this.getTimeSlots(preferredTime, parseInt(hours));
        
        prioritySubjects.forEach((subject, index) => {
            if (timeSlots[index]) {
                schedule.push({
                    time: timeSlots[index],
                    subject: subject,
                    activity: this.getActivityForSubject(subject)
                });
            }
        });

        return schedule;
    }

    getTimeSlots(preferredTime, totalHours) {
        const slots = [];
        const startTimes = {
            morning: 9,
            afternoon: 14,
            evening: 19,
            night: 22
        };

        let startHour = startTimes[preferredTime] || 9;
        
        for (let i = 0; i < totalHours; i += 1.5) {
            const endHour = startHour + 1.5;
            slots.push(`${startHour}:00 - ${Math.floor(endHour)}:${endHour % 1 === 0.5 ? '30' : '00'}`);
            startHour = endHour;
        }

        return slots;
    }

    getActivityForSubject(subject) {
        const activities = {
            'Mathematics': 'Problem Solving',
            'Physics': 'Concept Review',
            'Chemistry': 'Practice Questions',
            'Computer Science': 'Coding Practice',
            'English': 'Reading/Writing'
        };
        return activities[subject] || 'Study Session';
    }
}