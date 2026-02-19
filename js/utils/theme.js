import { StorageUtil } from '../utils/storage.js';

export class AuthModule {
    static checkAuth() {
        const user = StorageUtil.getUser();
        if (!user) {
            return false;
        }
        return true;
    }

    static login(studentId, password) {
        // Dummy authentication
        const user = {
            id: studentId,
            name: 'John Doe',
            email: 'john.doe@university.edu',
            department: 'Computer Science',
            year: '3rd Year',
            rollNo: 'CS2021001',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=100&background=4f46e5&color=fff'
        };

        StorageUtil.saveUser(user);
        return user;
    }

    static logout() {
        StorageUtil.clearUser();
        window.location.href = 'login.html';
    }

    static getUser() {
        return StorageUtil.getUser();
    }

    static updateProfile(profileData) {
        const currentUser = this.getUser();
        const updatedUser = { ...currentUser, ...profileData };
        StorageUtil.saveUser(updatedUser);
        return updatedUser;
    }

    static renderProfile() {
        const user = this.getUser();
        const contentArea = document.getElementById('dynamicSection');
        
        contentArea.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <!-- Profile Header -->
                    <div class="flex items-center space-x-6 mb-8">
                        <img src="${user.avatar}" alt="Profile" class="w-24 h-24 rounded-full border-4 border-indigo-500">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${user.name}</h2>
                            <p class="text-gray-600 dark:text-gray-400">${user.department} • ${user.year}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">${user.rollNo}</p>
                        </div>
                        <button id="editProfileBtn" class="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <i class="fas fa-edit mr-2"></i>Edit Profile
                        </button>
                    </div>

                    <!-- Profile Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                <p class="text-gray-800 dark:text-white font-medium">${user.email}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Student ID</label>
                                <p class="text-gray-800 dark:text-white font-medium">${user.id}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Department</label>
                                <p class="text-gray-800 dark:text-white font-medium">${user.department}</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Year</label>
                                <p class="text-gray-800 dark:text-white font-medium">${user.year}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Roll Number</label>
                                <p class="text-gray-800 dark:text-white font-medium">${user.rollNo}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">CGPA</label>
                                <p class="text-gray-800 dark:text-white font-medium">8.5/10</p>
                            </div>
                        </div>
                    </div>

                    <!-- Academic Stats -->
                    <div class="mt-8 pt-8 border-t dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Academic Overview</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                                <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">24</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Credits</p>
                            </div>
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                                <p class="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                            </div>
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                            </div>
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Profile Modal -->
                <div id="profileModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Profile</h3>
                        <form id="profileForm" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input type="text" id="profileName" value="${user.name}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input type="email" id="profileEmail" value="${user.email}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                                <input type="text" id="profileDept" value="${user.department}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                                <select id="profileYear" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                                    <option value="1st Year" ${user.year === '1st Year' ? 'selected' : ''}>1st Year</option>
                                    <option value="2nd Year" ${user.year === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                                    <option value="3rd Year" ${user.year === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                                    <option value="4th Year" ${user.year === '4th Year' ? 'selected' : ''}>4th Year</option>
                                </select>
                            </div>
                            <div class="flex space-x-3 pt-4">
                                <button type="submit" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
                                <button type="button" id="closeModalBtn" class="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.attachProfileListeners();
    }

    static attachProfileListeners() {
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            document.getElementById('profileModal').classList.remove('hidden');
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('profileModal').classList.add('hidden');
        });

        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateUserProfile();
        });
    }

    static updateUserProfile() {
        const updatedData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            department: document.getElementById('profileDept').value,
            year: document.getElementById('profileYear').value
        };

        this.updateProfile(updatedData);
        document.getElementById('profileModal').classList.add('hidden');
        this.renderProfile(); // Re-render profile
    }
}