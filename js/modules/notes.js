import { StorageUtil } from '../utils/storage.js';

export class NotesModule {
    constructor() {
        this.notes = StorageUtil.getNotes() || this.getDefaultNotes();
        this.categories = ['Lecture Notes', 'Assignments', 'Reference Materials', 'Exam Prep'];
    }

    getDefaultNotes() {
        return [
            {
                id: 1,
                title: 'Calculus Chapter 1 Notes',
                category: 'Lecture Notes',
                subject: 'Mathematics',
                description: 'Limits and continuity concepts with examples',
                fileUrl: '#',
                dateAdded: '2024-01-15'
            },
            {
                id: 2,
                title: 'Physics Lab Report 3',
                category: 'Assignments',
                subject: 'Physics',
                description: 'Ohm\'s law experiment results and analysis',
                fileUrl: '#',
                dateAdded: '2024-01-18'
            },
            {
                id: 3,
                title: 'Data Structures Cheat Sheet',
                category: 'Reference Materials',
                subject: 'Computer Science',
                description: 'Quick reference for common algorithms',
                fileUrl: '#',
                dateAdded: '2024-01-20'
            }
        ];
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <!-- Header with Add Button -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Study Material Manager</h2>
                    <button id="addNoteBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Add Material
                    </button>
                </div>

                <!-- Category Filters -->
                <div class="flex space-x-2 overflow-x-auto pb-2">
                    <button class="category-filter px-4 py-2 rounded-lg bg-indigo-600 text-white" data-category="all">All</button>
                    ${this.categories.map(cat => `
                        <button class="category-filter px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" data-category="${cat}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>

                <!-- Notes Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="notesGrid">
                    ${this.renderNotes()}
                </div>
            </div>

            <!-- Add/Edit Note Modal -->
            <div id="noteModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4" id="modalTitle">Add Study Material</h3>
                    <form id="noteForm" class="space-y-4">
                        <input type="hidden" id="noteId">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input type="text" id="noteTitle" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select id="noteCategory" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                                ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <input type="text" id="noteSubject" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea id="noteDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File URL (optional)</label>
                            <input type="url" id="noteFileUrl" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
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

    renderNotes(category = 'all') {
        let filteredNotes = this.notes;
        if (category !== 'all') {
            filteredNotes = this.notes.filter(note => note.category === category);
        }

        if (filteredNotes.length === 0) {
            return '<div class="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">No study materials found</div>';
        }

        return filteredNotes.map(note => `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition" data-id="${note.id}">
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm">
                        ${note.category}
                    </span>
                    <div class="flex space-x-2">
                        <button class="edit-note text-indigo-600 hover:text-indigo-800" data-id="${note.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-note text-red-600 hover:text-red-800" data-id="${note.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">${note.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${note.subject}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${note.description}</p>
                
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500 dark:text-gray-500">Added: ${new Date(note.dateAdded).toLocaleDateString()}</span>
                    ${note.fileUrl && note.fileUrl !== '#' ? `
                        <a href="${note.fileUrl}" class="text-indigo-600 hover:text-indigo-800">
                            <i class="fas fa-download"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Category filters
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-filter').forEach(b => {
                    b.classList.remove('bg-indigo-600', 'text-white');
                    b.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                });
                e.target.classList.add('bg-indigo-600', 'text-white');
                
                const category = e.target.dataset.category;
                document.getElementById('notesGrid').innerHTML = this.renderNotes(category);
            });
        });

        // Add note button
        document.getElementById('addNoteBtn').addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add Study Material';
            document.getElementById('noteForm').reset();
            document.getElementById('noteId').value = '';
            document.getElementById('noteModal').classList.remove('hidden');
        });

        // Close modal button
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('noteModal').classList.add('hidden');
        });

        // Form submission
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote();
        });

        // Edit and delete buttons (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-note')) {
                const id = parseInt(e.target.closest('.edit-note').dataset.id);
                this.editNote(id);
            }
            if (e.target.closest('.delete-note')) {
                const id = parseInt(e.target.closest('.delete-note').dataset.id);
                this.deleteNote(id);
            }
        });
    }

    saveNote() {
        const noteData = {
            id: document.getElementById('noteId').value || Date.now(),
            title: document.getElementById('noteTitle').value,
            category: document.getElementById('noteCategory').value,
            subject: document.getElementById('noteSubject').value,
            description: document.getElementById('noteDescription').value,
            fileUrl: document.getElementById('noteFileUrl').value || '#',
            dateAdded: new Date().toISOString().split('T')[0]
        };

        if (document.getElementById('noteId').value) {
            // Update existing
            const index = this.notes.findIndex(n => n.id == noteData.id);
            this.notes[index] = noteData;
        } else {
            // Add new
            this.notes.push(noteData);
        }

        StorageUtil.saveNotes(this.notes);
        document.getElementById('noteModal').classList.add('hidden');
        this.render(); // Re-render the notes section
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('modalTitle').textContent = 'Edit Study Material';
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteCategory').value = note.category;
            document.getElementById('noteSubject').value = note.subject;
            document.getElementById('noteDescription').value = note.description;
            document.getElementById('noteFileUrl').value = note.fileUrl;
            document.getElementById('noteModal').classList.remove('hidden');
        }
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this study material?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            StorageUtil.saveNotes(this.notes);
            this.render(); // Re-render the notes section
        }
    }
}