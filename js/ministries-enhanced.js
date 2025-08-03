// Enhanced Ministries Management System
class EnhancedMinistriesManager {
    constructor() {
        this.ministries = [];
        this.volunteerOpportunities = [];
        this.currentFilter = 'all';
        this.currentMonth = new Date();
        this.editingMinistry = null;
        this.editingOpportunity = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderPage();
    }

    loadData() {
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.ministries = data.ministries || [];
            this.volunteerOpportunities = data.volunteerOpportunities || [];
        } else {
            this.ministries = this.generateSampleMinistries();
            this.volunteerOpportunities = this.generateSampleOpportunities();
            this.saveData();
        }
    }

    saveData() {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        data.ministries = this.ministries;
        data.volunteerOpportunities = this.volunteerOpportunities;
        localStorage.setItem('accordChurchData', JSON.stringify(data));
    }

    generateSampleMinistries() {
        return [
            {
                id: 1,
                name: 'Worship Team',
                category: 'worship',
                description: 'Lead the congregation in worship through music and song',
                meetingDay: 'wednesday',
                meetingTime: '19:00',
                location: 'main-sanctuary',
                leader: 'Sarah Johnson',
                assistantLeaders: ['Mike Davis'],
                isActive: true,
                acceptsVolunteers: true,
                requiresTraining: true,
                contactEmail: 'worship@accordchurch.org',
                annualBudget: 5000,
                volunteers: 12,
                events: 4
            },
            {
                id: 2,
                name: 'Children\'s Ministry',
                category: 'children',
                description: 'Nurturing faith in children through engaging programs and activities',
                meetingDay: 'sunday',
                meetingTime: '09:00',
                location: 'children-room',
                leader: 'Emily Brown',
                assistantLeaders: ['David Wilson', 'Lisa Garcia'],
                isActive: true,
                acceptsVolunteers: true,
                requiresTraining: true,
                contactEmail: 'children@accordchurch.org',
                annualBudget: 3000,
                volunteers: 8,
                events: 6
            },
            {
                id: 3,
                name: 'Community Outreach',
                category: 'outreach',
                description: 'Serving our community through various outreach programs and initiatives',
                meetingDay: 'saturday',
                meetingTime: '10:00',
                location: 'fellowship-hall',
                leader: 'John Smith',
                assistantLeaders: ['Mary Johnson'],
                isActive: true,
                acceptsVolunteers: true,
                requiresTraining: false,
                contactEmail: 'outreach@accordchurch.org',
                annualBudget: 8000,
                volunteers: 15,
                events: 8
            },
            {
                id: 4,
                name: 'Youth Group',
                category: 'youth',
                description: 'Building strong relationships and faith among teenagers',
                meetingDay: 'friday',
                meetingTime: '19:30',
                location: 'youth-room',
                leader: 'Michael Davis',
                assistantLeaders: ['Sarah Brown'],
                isActive: true,
                acceptsVolunteers: true,
                requiresTraining: true,
                contactEmail: 'youth@accordchurch.org',
                annualBudget: 4000,
                volunteers: 6,
                events: 12
            },
            {
                id: 5,
                name: 'Senior Fellowship',
                category: 'fellowship',
                description: 'Providing fellowship and support for our senior members',
                meetingDay: 'tuesday',
                meetingTime: '14:00',
                location: 'fellowship-hall',
                leader: 'Robert Wilson',
                assistantLeaders: ['Helen Davis'],
                isActive: true,
                acceptsVolunteers: true,
                requiresTraining: false,
                contactEmail: 'seniors@accordchurch.org',
                annualBudget: 2000,
                volunteers: 4,
                events: 3
            }
        ];
    }

    generateSampleOpportunities() {
        return [
            {
                id: 1,
                title: 'Sound Technician',
                ministryId: 1,
                ministryName: 'Worship Team',
                description: 'Operate sound equipment during worship services',
                timeCommitment: 'weekly',
                volunteersNeeded: 2,
                skillsRequired: 'Basic audio equipment knowledge',
                backgroundCheckRequired: false,
                isActive: true
            },
            {
                id: 2,
                title: 'Sunday School Teacher',
                ministryId: 2,
                ministryName: 'Children\'s Ministry',
                description: 'Teach Sunday school classes for children ages 6-10',
                timeCommitment: 'weekly',
                volunteersNeeded: 3,
                skillsRequired: 'Experience working with children',
                backgroundCheckRequired: true,
                isActive: true
            },
            {
                id: 3,
                title: 'Food Bank Volunteer',
                ministryId: 3,
                ministryName: 'Community Outreach',
                description: 'Help distribute food to families in need',
                timeCommitment: 'monthly',
                volunteersNeeded: 5,
                skillsRequired: 'None required',
                backgroundCheckRequired: false,
                isActive: true
            }
        ];
    }

    setupEventListeners() {
        // Header actions
        document.getElementById('addMinistryBtn').addEventListener('click', () => {
            this.showMinistryForm();
        });

        document.getElementById('manageVolunteersBtn').addEventListener('click', () => {
            this.showVolunteerManagement();
        });

        document.getElementById('ministryReportsBtn').addEventListener('click', () => {
            this.showMinistryReports();
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterMinistries(category);
            });
        });

        // Volunteer opportunities
        document.getElementById('addOpportunityBtn').addEventListener('click', () => {
            this.showOpportunityForm();
        });

        // Calendar controls
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Modal controls
        this.setupModalControls();

        // Form controls
        this.setupFormControls();
    }

    setupModalControls() {
        // Ministry modal
        document.getElementById('closeMinistryModal').addEventListener('click', () => {
            this.closeMinistryModal();
        });

        // Ministry form modal
        document.getElementById('closeMinistryFormModal').addEventListener('click', () => {
            this.closeMinistryFormModal();
        });

        document.getElementById('cancelMinistryForm').addEventListener('click', () => {
            this.closeMinistryFormModal();
        });

        // Volunteer modal
        document.getElementById('closeVolunteerModal').addEventListener('click', () => {
            this.closeVolunteerModal();
        });

        // Opportunity modal
        document.getElementById('closeOpportunityModal').addEventListener('click', () => {
            this.closeOpportunityModal();
        });

        document.getElementById('cancelOpportunityForm').addEventListener('click', () => {
            this.closeOpportunityModal();
        });
    }

    setupFormControls() {
        // Ministry form
        document.getElementById('ministryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMinistry();
        });

        // Opportunity form
        document.getElementById('opportunityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveOpportunity();
        });
    }

    renderPage() {
        this.updateOverviewCards();
        this.populateLeaderDropdowns();
        this.renderMinistries();
        this.renderVolunteerOpportunities();
        this.renderCalendar();
    }

    updateOverviewCards() {
        document.getElementById('totalMinistriesCount').textContent = this.ministries.filter(m => m.isActive).length;
        
        const totalVolunteers = this.ministries.reduce((sum, m) => sum + (m.volunteers || 0), 0);
        document.getElementById('totalVolunteersCount').textContent = totalVolunteers;
        
        const totalLeaders = this.ministries.reduce((sum, m) => {
            return sum + 1 + (m.assistantLeaders ? m.assistantLeaders.length : 0);
        }, 0);
        document.getElementById('totalLeadersCount').textContent = totalLeaders;
        
        // Get upcoming events from saved events data
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const events = data.events || [];
            const today = new Date();
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const upcomingEvents = events.filter(event => {
                const eventDate = new Date(event.startDate);
                return eventDate >= today && eventDate <= nextMonth;
            }).length;
            
            document.getElementById('upcomingEventsCount').textContent = upcomingEvents;
        }
    }

    populateLeaderDropdowns() {
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const members = data.members || [];
            
            const leaderSelect = document.getElementById('ministryLeader');
            const assistantSelect = document.getElementById('assistantLeaders');
            
            leaderSelect.innerHTML = '<option value="">Select Leader</option>';
            assistantSelect.innerHTML = '';
            
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = `${member.firstName} ${member.lastName}`;
                option.textContent = `${member.firstName} ${member.lastName}`;
                
                leaderSelect.appendChild(option.cloneNode(true));
                assistantSelect.appendChild(option);
            });
        }
    }

    filterMinistries(category) {
        this.currentFilter = category;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderMinistries();
    }

    renderMinistries() {
        const container = document.getElementById('ministriesGrid');
        
        let filteredMinistries = this.ministries;
        if (this.currentFilter !== 'all') {
            filteredMinistries = this.ministries.filter(m => m.category === this.currentFilter);
        }
        
        if (filteredMinistries.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-hands-helping"></i>
                    <h3>No Ministries Found</h3>
                    <p>No ministries match your current filter.</p>
                    <button class="btn btn-primary" onclick="ministriesManager.showMinistryForm()">
                        <i class="fas fa-plus"></i> Add First Ministry
                    </button>
                </div>
            `;
            return;
        }

        const ministriesHTML = filteredMinistries.map(ministry => `
            <div class="ministry-card" onclick="ministriesManager.viewMinistry(${ministry.id})">
                <div class="ministry-header">
                    <div class="ministry-title">
                        ${ministry.name}
                        <span class="ministry-category">${this.formatCategory(ministry.category)}</span>
                    </div>
                    <div class="ministry-description">${ministry.description}</div>
                </div>
                
                <div class="ministry-body">
                    <div class="ministry-info">
                        ${ministry.meetingDay ? `
                            <div class="ministry-info-item">
                                <i class="fas fa-calendar"></i>
                                <span>${this.formatMeetingSchedule(ministry)}</span>
                            </div>
                        ` : ''}
                        <div class="ministry-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${this.formatLocation(ministry.location)}</span>
                        </div>
                        <div class="ministry-info-item">
                            <i class="fas fa-user-tie"></i>
                            <span>${ministry.leader}</span>
                        </div>
                        ${ministry.contactEmail ? `
                            <div class="ministry-info-item">
                                <i class="fas fa-envelope"></i>
                                <span>${ministry.contactEmail}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="ministry-stats">
                        <div class="stat-item">
                            <div class="stat-number">${ministry.volunteers || 0}</div>
                            <div class="stat-label">Volunteers</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${ministry.events || 0}</div>
                            <div class="stat-label">Events</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">$${(ministry.annualBudget || 0).toLocaleString()}</div>
                            <div class="stat-label">Budget</div>
                        </div>
                    </div>
                    
                    <div class="ministry-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-sm btn-primary" onclick="ministriesManager.editMinistry(${ministry.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="ministriesManager.manageVolunteers(${ministry.id})" title="Manage Volunteers">
                            <i class="fas fa-users"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="ministriesManager.addEvent(${ministry.id})" title="Add Event">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="ministriesManager.deleteMinistry(${ministry.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = ministriesHTML;
    }

    renderVolunteerOpportunities() {
        const container = document.getElementById('opportunitiesList');
        
        if (this.volunteerOpportunities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-hand-paper"></i>
                    <h3>No Volunteer Opportunities</h3>
                    <p>Create volunteer opportunities to engage your members.</p>
                    <button class="btn btn-primary" onclick="ministriesManager.showOpportunityForm()">
                        <i class="fas fa-plus"></i> Add First Opportunity
                    </button>
                </div>
            `;
            return;
        }

        const opportunitiesHTML = this.volunteerOpportunities.map(opportunity => `
            <div class="opportunity-item">
                <div class="opportunity-info">
                    <div class="opportunity-title">${opportunity.title}</div>
                    <div class="opportunity-details">
                        <div class="opportunity-detail">
                            <i class="fas fa-church"></i>
                            <span>${opportunity.ministryName}</span>
                        </div>
                        <div class="opportunity-detail">
                            <i class="fas fa-clock"></i>
                            <span>${this.formatTimeCommitment(opportunity.timeCommitment)}</span>
                        </div>
                        <div class="opportunity-detail">
                            <i class="fas fa-users"></i>
                            <span>${opportunity.volunteersNeeded} needed</span>
                        </div>
                        ${opportunity.skillsRequired ? `
                            <div class="opportunity-detail">
                                <i class="fas fa-tools"></i>
                                <span>${opportunity.skillsRequired}</span>
                            </div>
                        ` : ''}
                        ${opportunity.backgroundCheckRequired ? `
                            <div class="opportunity-detail">
                                <i class="fas fa-shield-alt"></i>
                                <span>Background check required</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="opportunity-actions">
                    <button class="btn btn-sm btn-success" onclick="ministriesManager.applyForOpportunity(${opportunity.id})" title="Apply">
                        <i class="fas fa-hand-paper"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="ministriesManager.editOpportunity(${opportunity.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="ministriesManager.deleteOpportunity(${opportunity.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = opportunitiesHTML;
    }

    renderCalendar() {
        const container = document.getElementById('calendarGrid');
        const monthName = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('currentMonth').textContent = monthName;

        // Create calendar grid
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Calendar days
        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = currentDate.getMonth() === this.currentMonth.getMonth();
            const isToday = currentDate.toDateString() === new Date().toDateString();
            
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';

            calendarHTML += `
                <div class="${dayClass}">
                    <div class="calendar-day-number">${currentDate.getDate()}</div>
                    ${this.getEventsForDate(currentDate)}
                </div>
            `;
            
            currentDate.setDate(currentDate.getDate() + 1);
        }

        container.innerHTML = calendarHTML;
    }

    getEventsForDate(date) {
        // This would integrate with the events system
        // For now, return empty string
        return '';
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.renderCalendar();
    }

    // Ministry management methods
    showMinistryForm(ministry = null) {
        this.editingMinistry = ministry;
        const modal = document.getElementById('ministryFormModal');
        const title = document.getElementById('ministryFormTitle');
        
        title.textContent = ministry ? 'Edit Ministry' : 'Add New Ministry';
        
        if (ministry) {
            this.populateMinistryForm(ministry);
        } else {
            this.clearMinistryForm();
        }
        
        modal.classList.add('active');
    }

    populateMinistryForm(ministry) {
        Object.keys(ministry).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = ministry[key];
                } else if (field.tagName === 'SELECT' && field.multiple) {
                    // Handle multiple select for assistant leaders
                    Array.from(field.options).forEach(option => {
                        option.selected = ministry[key] && ministry[key].includes(option.value);
                    });
                } else {
                    field.value = ministry[key] || '';
                }
            }
        });
    }

    clearMinistryForm() {
        document.getElementById('ministryForm').reset();
        document.getElementById('isActive').checked = true;
    }

    saveMinistry() {
        const formData = this.collectMinistryFormData();
        
        if (this.editingMinistry) {
            // Update existing ministry
            const index = this.ministries.findIndex(m => m.id === this.editingMinistry.id);
            if (index !== -1) {
                this.ministries[index] = { ...this.editingMinistry, ...formData };
            }
        } else {
            // Add new ministry
            formData.id = Date.now();
            formData.volunteers = 0;
            formData.events = 0;
            this.ministries.push(formData);
        }

        this.saveData();
        this.closeMinistryFormModal();
        this.renderPage();
        
        const message = this.editingMinistry ? 'Ministry updated successfully' : 'Ministry created successfully';
        this.showNotification(message, 'success');
    }

    collectMinistryFormData() {
        const assistantLeadersSelect = document.getElementById('assistantLeaders');
        const assistantLeaders = Array.from(assistantLeadersSelect.selectedOptions).map(option => option.value);
        
        return {
            name: document.getElementById('ministryName').value,
            category: document.getElementById('ministryCategory').value,
            description: document.getElementById('ministryDescription').value,
            meetingDay: document.getElementById('meetingDay').value,
            meetingTime: document.getElementById('meetingTime').value,
            location: document.getElementById('meetingLocation').value,
            leader: document.getElementById('ministryLeader').value,
            assistantLeaders: assistantLeaders,
            isActive: document.getElementById('isActive').checked,
            acceptsVolunteers: document.getElementById('acceptsVolunteers').checked,
            requiresTraining: document.getElementById('requiresTraining').checked,
            contactEmail: document.getElementById('contactEmail').value,
            annualBudget: parseFloat(document.getElementById('annualBudget').value) || 0
        };
    }

    viewMinistry(ministryId) {
        const ministry = this.ministries.find(m => m.id === ministryId);
        if (!ministry) return;

        const modalBody = document.getElementById('ministryModalBody');
        modalBody.innerHTML = this.generateMinistryDetails(ministry);
        
        document.getElementById('ministryModalTitle').textContent = ministry.name;
        document.getElementById('ministryModal').classList.add('active');
    }

    generateMinistryDetails(ministry) {
        return `
            <div class="ministry-details-view">
                <div class="ministry-header-large">
                    <h2>${ministry.name}</h2>
                    <span class="ministry-category">${this.formatCategory(ministry.category)}</span>
                </div>
                
                <div class="ministry-description-large">
                    <p>${ministry.description}</p>
                </div>
                
                <div class="ministry-details-grid">
                    <div class="detail-section">
                        <h4><i class="fas fa-calendar"></i> Schedule</h4>
                        ${ministry.meetingDay ? `
                            <p><strong>Meeting:</strong> ${this.formatMeetingSchedule(ministry)}</p>
                            <p><strong>Location:</strong> ${this.formatLocation(ministry.location)}</p>
                        ` : '<p>No regular meeting schedule</p>'}
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-user-tie"></i> Leadership</h4>
                        <p><strong>Leader:</strong> ${ministry.leader}</p>
                        ${ministry.assistantLeaders && ministry.assistantLeaders.length > 0 ? `
                            <p><strong>Assistant Leaders:</strong> ${ministry.assistantLeaders.join(', ')}</p>
                        ` : ''}
                        ${ministry.contactEmail ? `
                            <p><strong>Contact:</strong> ${ministry.contactEmail}</p>
                        ` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                        <p><strong>Volunteers:</strong> ${ministry.volunteers || 0}</p>
                        <p><strong>Events:</strong> ${ministry.events || 0}</p>
                        <p><strong>Annual Budget:</strong> $${(ministry.annualBudget || 0).toLocaleString()}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-cog"></i> Settings</h4>
                        <p><strong>Status:</strong> ${ministry.isActive ? 'Active' : 'Inactive'}</p>
                        <p><strong>Accepting Volunteers:</strong> ${ministry.acceptsVolunteers ? 'Yes' : 'No'}</p>
                        <p><strong>Training Required:</strong> ${ministry.requiresTraining ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                
                <div class="ministry-actions-large">
                    <button class="btn btn-primary" onclick="ministriesManager.editMinistry(${ministry.id}); ministriesManager.closeMinistryModal();">
                        <i class="fas fa-edit"></i> Edit Ministry
                    </button>
                    <button class="btn btn-info" onclick="ministriesManager.manageVolunteers(${ministry.id})">
                        <i class="fas fa-users"></i> Manage Volunteers
                    </button>
                    <button class="btn btn-success" onclick="ministriesManager.addEvent(${ministry.id})">
                        <i class="fas fa-calendar-plus"></i> Add Event
                    </button>
                    <button class="btn btn-secondary" onclick="ministriesManager.closeMinistryModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
    }

    editMinistry(ministryId) {
        const ministry = this.ministries.find(m => m.id === ministryId);
        if (ministry) {
            this.showMinistryForm(ministry);
        }
    }

    deleteMinistry(ministryId) {
        const ministry = this.ministries.find(m => m.id === ministryId);
        if (!ministry) return;

        if (confirm(`Are you sure you want to delete the ${ministry.name} ministry?`)) {
            this.ministries = this.ministries.filter(m => m.id !== ministryId);
            this.saveData();
            this.renderPage();
            this.showNotification('Ministry deleted successfully', 'success');
        }
    }

    // Volunteer opportunity methods
    showOpportunityForm(opportunity = null) {
        this.editingOpportunity = opportunity;
        const modal = document.getElementById('opportunityModal');
        const title = document.getElementById('opportunityModalTitle');
        
        title.textContent = opportunity ? 'Edit Volunteer Opportunity' : 'Add Volunteer Opportunity';
        
        // Populate ministry dropdown
        const ministrySelect = document.getElementById('opportunityMinistry');
        ministrySelect.innerHTML = '<option value="">Select Ministry</option>';
        this.ministries.forEach(ministry => {
            const option = document.createElement('option');
            option.value = ministry.id;
            option.textContent = ministry.name;
            ministrySelect.appendChild(option);
        });
        
        if (opportunity) {
            this.populateOpportunityForm(opportunity);
        } else {
            this.clearOpportunityForm();
        }
        
        modal.classList.add('active');
    }

    populateOpportunityForm(opportunity) {
        Object.keys(opportunity).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = opportunity[key];
                } else {
                    field.value = opportunity[key] || '';
                }
            }
        });
    }

    clearOpportunityForm() {
        document.getElementById('opportunityForm').reset();
    }

    saveOpportunity() {
        const formData = this.collectOpportunityFormData();
        
        if (this.editingOpportunity) {
            // Update existing opportunity
            const index = this.volunteerOpportunities.findIndex(o => o.id === this.editingOpportunity.id);
            if (index !== -1) {
                this.volunteerOpportunities[index] = { ...this.editingOpportunity, ...formData };
            }
        } else {
            // Add new opportunity
            formData.id = Date.now();
            formData.isActive = true;
            this.volunteerOpportunities.push(formData);
        }

        this.saveData();
        this.closeOpportunityModal();
        this.renderVolunteerOpportunities();
        
        const message = this.editingOpportunity ? 'Opportunity updated successfully' : 'Opportunity created successfully';
        this.showNotification(message, 'success');
    }

    collectOpportunityFormData() {
        const ministryId = parseInt(document.getElementById('opportunityMinistry').value);
        const ministry = this.ministries.find(m => m.id === ministryId);
        
        return {
            title: document.getElementById('opportunityTitle').value,
            ministryId: ministryId,
            ministryName: ministry ? ministry.name : '',
            description: document.getElementById('opportunityDescription').value,
            timeCommitment: document.getElementById('timeCommitment').value,
            volunteersNeeded: parseInt(document.getElementById('volunteersNeeded').value),
            skillsRequired: document.getElementById('skillsRequired').value,
            backgroundCheckRequired: document.getElementById('backgroundCheckRequired').checked
        };
    }

    editOpportunity(opportunityId) {
        const opportunity = this.volunteerOpportunities.find(o => o.id === opportunityId);
        if (opportunity) {
            this.showOpportunityForm(opportunity);
        }
    }

    deleteOpportunity(opportunityId) {
        if (confirm('Are you sure you want to delete this volunteer opportunity?')) {
            this.volunteerOpportunities = this.volunteerOpportunities.filter(o => o.id !== opportunityId);
            this.saveData();
            this.renderVolunteerOpportunities();
            this.showNotification('Opportunity deleted successfully', 'success');
        }
    }

    applyForOpportunity(opportunityId) {
        this.showNotification('Volunteer application functionality would be implemented here', 'info');
    }

    // Other methods
    manageVolunteers(ministryId) {
        this.showNotification('Volunteer management functionality would be implemented here', 'info');
    }

    addEvent(ministryId) {
        this.showNotification('Event creation functionality would be implemented here', 'info');
    }

    showVolunteerManagement() {
        this.showNotification('Comprehensive volunteer management would be implemented here', 'info');
    }

    showMinistryReports() {
        this.showNotification('Ministry reports functionality would be implemented here', 'info');
    }

    // Utility methods
    formatCategory(category) {
        const categories = {
            worship: 'Worship',
            education: 'Education',
            outreach: 'Outreach',
            fellowship: 'Fellowship',
            support: 'Support',
            youth: 'Youth',
            children: 'Children',
            seniors: 'Seniors'
        };
        return categories[category] || category;
    }

    formatLocation(location) {
        const locations = {
            'main-sanctuary': 'Main Sanctuary',
            'fellowship-hall': 'Fellowship Hall',
            'youth-room': 'Youth Room',
            'children-room': 'Children\'s Room',
            'conference-room': 'Conference Room',
            'off-site': 'Off-site Location'
        };
        return locations[location] || location;
    }

    formatMeetingSchedule(ministry) {
        const days = {
            sunday: 'Sunday',
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday'
        };
        
        const day = days[ministry.meetingDay] || ministry.meetingDay;
        const time = ministry.meetingTime ? new Date(`2000-01-01T${ministry.meetingTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }) : '';
        
        return `${day} ${time}`.trim();
    }

    formatTimeCommitment(commitment) {
        const commitments = {
            'one-time': 'One-time',
            weekly: 'Weekly',
            monthly: 'Monthly',
            seasonal: 'Seasonal',
            ongoing: 'Ongoing'
        };
        return commitments[commitment] || commitment;
    }

    // Modal control methods
    closeMinistryModal() {
        document.getElementById('ministryModal').classList.remove('active');
    }

    closeMinistryFormModal() {
        document.getElementById('ministryFormModal').classList.remove('active');
        this.editingMinistry = null;
    }

    closeVolunteerModal() {
        document.getElementById('volunteerModal').classList.remove('active');
    }

    closeOpportunityModal() {
        document.getElementById('opportunityModal').classList.remove('active');
        this.editingOpportunity = null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the enhanced ministries manager
const ministriesManager = new EnhancedMinistriesManager();
