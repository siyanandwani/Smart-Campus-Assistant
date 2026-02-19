import { StorageUtil } from '../utils/storage.js';

export class MapModule {
    constructor() {
        this.buildings = [
            { id: 1, name: 'Main Academic Block', code: 'MAB', lat: 40.7128, lng: -74.0060, departments: ['Administration', 'CS', 'Math'] },
            { id: 2, name: 'Science Complex', code: 'SCI', lat: 40.7138, lng: -74.0050, departments: ['Physics', 'Chemistry', 'Biology'] },
            { id: 3, name: 'Engineering Building', code: 'ENG', lat: 40.7148, lng: -74.0040, departments: ['Mechanical', 'Electrical', 'Civil'] },
            { id: 4, name: 'Library', code: 'LIB', lat: 40.7158, lng: -74.0030, departments: ['All'] },
            { id: 5, name: 'Student Center', code: 'STC', lat: 40.7168, lng: -74.0020, departments: ['Cafeteria', 'Student Affairs'] },
            { id: 6, name: 'Sports Complex', code: 'SPC', lat: 40.7178, lng: -74.0010, departments: ['Gym', 'Sports'] },
            { id: 7, name: 'Auditorium', code: 'AUD', lat: 40.7188, lng: -74.0000, departments: ['Events'] },
            { id: 8, name: 'Hostel Block A', code: 'HSA', lat: 40.7198, lng: -73.9990, departments: ['Boys Hostel'] },
            { id: 9, name: 'Hostel Block B', code: 'HSB', lat: 40.7208, lng: -73.9980, departments: ['Girls Hostel'] }
        ];
    }

    render() {
        const contentArea = document.getElementById('dynamicSection');
        contentArea.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Campus Map</h2>
                    <div class="relative">
                        <input type="text" id="buildingSearch" placeholder="Search buildings..." 
                               class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white w-64">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>

                <!-- Map Container -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Map Visualization -->
                    <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <div id="campusMap" class="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                            <!-- SVG Map -->
                            <svg class="w-full h-full" viewBox="0 0 800 400">
                                <!-- Background Grid -->
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
                                </pattern>
                                <rect width="800" height="400" fill="url(#grid)" class="dark:stroke-gray-600"/>
                                
                                <!-- Buildings -->
                                ${this.renderMapBuildings()}
                                
                                <!-- Paths -->
                                <path d="M 100 100 L 700 100" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                                <path d="M 100 200 L 700 200" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                                <path d="M 100 300 L 700 300" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                                <path d="M 200 50 L 200 350" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                                <path d="M 400 50 L 400 350" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                                <path d="M 600 50 L 600 350" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5" class="dark:stroke-gray-500"/>
                            </svg>
                            
                            <!-- Map Legend -->
                            <div class="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</p>
                                <div class="space-y-1">
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                                        <span class="text-xs text-gray-600 dark:text-gray-400">Academic</span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        <span class="text-xs text-gray-600 dark:text-gray-400">Student Facilities</span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                        <span class="text-xs text-gray-600 dark:text-gray-400">Hostels</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Building Information -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Building Directory</h3>
                        <div class="space-y-3 max-h-96 overflow-y-auto" id="buildingList">
                            ${this.renderBuildingList()}
                        </div>
                    </div>
                </div>

                <!-- Quick Navigation -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Navigation</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        ${this.renderQuickNav()}
                    </div>
                </div>

                <!-- Directions Panel -->
                <div id="directionsPanel" class="hidden bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Directions</h3>
                        <button id="closeDirections" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="directionsContent"></div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderMapBuildings() {
        const buildingPositions = [
            { x: 150, y: 100, color: 'indigo', type: 'academic' },
            { x: 350, y: 100, color: 'indigo', type: 'academic' },
            { x: 550, y: 100, color: 'green', type: 'facility' },
            { x: 250, y: 200, color: 'indigo', type: 'academic' },
            { x: 450, y: 200, color: 'green', type: 'facility' },
            { x: 650, y: 200, color: 'yellow', type: 'hostel' },
            { x: 150, y: 300, color: 'yellow', type: 'hostel' },
            { x: 350, y: 300, color: 'yellow', type: 'hostel' },
            { x: 550, y: 300, color: 'green', type: 'facility' }
        ];

        return buildingPositions.map((pos, index) => `
            <g class="building cursor-pointer" data-building-id="${index + 1}" data-x="${pos.x}" data-y="${pos.y}">
                <rect x="${pos.x - 30}" y="${pos.y - 20}" width="60" height="40" 
                      rx="6" fill="${this.getBuildingColor(pos.color)}" 
                      stroke="#ffffff" stroke-width="2"
                      class="hover:opacity-80 transition-opacity"/>
                <text x="${pos.x}" y="${pos.y - 5}" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                    ${this.buildings[index].code}
                </text>
                <circle cx="${pos.x + 20}" cy="${pos.y - 25}" r="3" fill="#10b981" class="animate-pulse"/>
            </g>
        `).join('');
    }

    getBuildingColor(color) {
        switch(color) {
            case 'indigo': return '#4f46e5';
            case 'green': return '#10b981';
            case 'yellow': return '#f59e0b';
            default: return '#6b7280';
        }
    }

    renderBuildingList() {
        return this.buildings.map(building => `
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition building-item" data-id="${building.id}">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-medium text-gray-800 dark:text-white">${building.name}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Code: ${building.code}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${building.departments.join(' • ')}</p>
                    </div>
                    <button class="get-directions text-indigo-600 hover:text-indigo-800" data-id="${building.id}">
                        <i class="fas fa-directions"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderQuickNav() {
        const quickLocations = ['Library', 'Cafeteria', 'Gym', 'Auditorium', 'Medical Center', 'Bank'];
        return quickLocations.map(loc => `
            <button class="quick-nav-btn p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                <i class="fas fa-map-marker-alt mr-1"></i>${loc}
            </button>
        `).join('');
    }

    attachEventListeners() {
        // Building search
        const searchInput = document.getElementById('buildingSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredBuildings = this.buildings.filter(b => 
                    b.name.toLowerCase().includes(searchTerm) || 
                    b.code.toLowerCase().includes(searchTerm) ||
                    b.departments.some(d => d.toLowerCase().includes(searchTerm))
                );
                
                document.getElementById('buildingList').innerHTML = 
                    this.renderBuildingList(filteredBuildings);
            });
        }

        // Building click on map
        document.querySelectorAll('.building').forEach(building => {
            building.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.buildingId;
                this.showBuildingDetails(id);
            });
        });

        // Building item click
        document.querySelectorAll('.building-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.get-directions')) {
                    const id = e.currentTarget.dataset.id;
                    this.highlightBuildingOnMap(id);
                }
            });
        });

        // Directions button
        document.querySelectorAll('.get-directions').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                this.showDirections(id);
            });
        });

        // Quick navigation
        document.querySelectorAll('.quick-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const location = e.currentTarget.textContent.trim();
                this.quickNavigate(location);
            });
        });

        // Close directions
        const closeBtn = document.getElementById('closeDirections');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('directionsPanel').classList.add('hidden');
            });
        }
    }

    showBuildingDetails(id) {
        const building = this.buildings.find(b => b.id == id);
        if (building) {
            // Create and show tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl z-10';
            tooltip.style.left = '50%';
            tooltip.style.top = '50%';
            tooltip.innerHTML = `
                <h4 class="font-bold text-gray-800 dark:text-white">${building.name}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${building.departments.join(', ')}</p>
                <button class="mt-2 text-xs text-indigo-600 get-directions" data-id="${building.id}">
                    <i class="fas fa-directions mr-1"></i>Get Directions
                </button>
            `;
            
            // Remove existing tooltips
            document.querySelectorAll('.building-tooltip').forEach(t => t.remove());
            tooltip.classList.add('building-tooltip');
            document.getElementById('campusMap').appendChild(tooltip);
            
            // Position tooltip near building
            const buildingEl = document.querySelector(`[data-building-id="${id}"]`);
            if (buildingEl) {
                const rect = buildingEl.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - 60) + 'px';
            }
        }
    }

    highlightBuildingOnMap(id) {
        // Remove previous highlights
        document.querySelectorAll('.building rect').forEach(rect => {
            rect.setAttribute('stroke', '#ffffff');
            rect.setAttribute('stroke-width', '2');
        });
        
        // Highlight selected building
        const building = document.querySelector(`[data-building-id="${id}"] rect`);
        if (building) {
            building.setAttribute('stroke', '#f59e0b');
            building.setAttribute('stroke-width', '4');
        }
    }

    showDirections(id) {
        const building = this.buildings.find(b => b.id == id);
        if (building) {
            const directionsPanel = document.getElementById('directionsPanel');
            const directionsContent = document.getElementById('directionsContent');
            
            // Simulate directions
            directionsContent.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <i class="fas fa-map-pin text-indigo-600 mr-3"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Start: Main Gate</span>
                    </div>
                    <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <i class="fas fa-arrow-right text-green-600 mr-3"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Walk straight 200m</span>
                    </div>
                    <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <i class="fas fa-arrow-left text-yellow-600 mr-3"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Turn left at Library</span>
                    </div>
                    <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <i class="fas fa-flag-checkered text-red-600 mr-3"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Destination: ${building.name}</span>
                    </div>
                    <div class="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total distance: 450m • 6 mins walk</p>
                    </div>
                </div>
            `;
            
            directionsPanel.classList.remove('hidden');
        }
    }

    quickNavigate(location) {
        // Find building matching location
        const building = this.buildings.find(b => 
            b.name.toLowerCase().includes(location.toLowerCase())
        );
        
        if (building) {
            this.highlightBuildingOnMap(building.id);
            this.showBuildingDetails(building.id);
        }
    }
}