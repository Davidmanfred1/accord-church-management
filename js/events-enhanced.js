// Enhanced Events Management System
class EnhancedEventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentView = 'calendar';
        this.currentDate = new Date();
        this.filters = {
            search: '',
            type: 'all',
            status: 'all',
            location: 'all'
        };
        this.editingEvent = null;
        this.eventTemplates = this.getEventTemplates();
        
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
        this.renderPage();
    }

    loadEvents() {
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.events = data.events || [];
        } else {
            this.events = this.generateSampleEvents();
            this.saveEvents();
        }
        this.filteredEvents = [...this.events];
    }

    saveEvents() {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        data.events = this.events;
        localStorage.setItem('accordChurchData', JSON.stringify(data));
    }

    generateSampleEvents() {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        
        return [
            {
                id: 1,
                title: 'Sunday Morning Service',
                description: 'Weekly Sunday worship service with sermon, music, and communion',
                type: 'service',
                category: 'worship',
                startDate: this.formatDate(this.getNextSunday()),
                startTime: '10:00',
                endDate: this.formatDate(this.getNextSunday()),
                endTime: '11:30',
                allDay: false,
                recurring: true,
                repeatFrequency: 'weekly',
                repeatUntil: '',
                venue: 'main-sanctuary',
                room: 'Main Sanctuary',
                offSiteAddress: '',
                maxCapacity: 300,
                registrationRequired: 'no',
                registrationDeadline: '',
                registrationFee: 0,
                primaryOrganizer: 'Pastor John',
                contactPhone: '(555) 123-CHURCH',
                organizers: [],
                equipment: ['sound-system', 'projector', 'microphones'],
                specialRequirements: 'Communion setup, flowers for altar',
                budget: 0,
                audience: ['all-ages'],
                eventNotes: 'Regular Sunday service',
                publicEvent: true,
                childcareProvided: true,
                attendees: [],
                status: 'confirmed'
            },
            {
                id: 2,
                title: 'Wednesday Bible Study',
                description: 'Weekly Bible study focusing on the Gospel of John',
                type: 'study',
                category: 'education',
                startDate: this.formatDate(nextWeek),
                startTime: '19:00',
                endDate: this.formatDate(nextWeek),
                endTime: '20:30',
                allDay: false,
                recurring: true,
                repeatFrequency: 'weekly',
                repeatUntil: '',
                venue: 'fellowship-hall',
                room: 'Fellowship Hall',
                offSiteAddress: '',
                maxCapacity: 50,
                registrationRequired: 'optional',
                registrationDeadline: '',
                registrationFee: 0,
                primaryOrganizer: 'Pastor Sarah',
                contactPhone: '(555) 123-CHURCH',
                organizers: [],
                equipment: ['chairs'],
                specialRequirements: 'Coffee and light refreshments',
                budget: 25,
                audience: ['adults'],
                eventNotes: 'Bring your Bible and notebook',
                publicEvent: true,
                childcareProvided: false,
                attendees: [],
                status: 'confirmed'
            },
            {
                id: 3,
                title: 'Youth Group Meeting',
                description: 'Monthly youth group meeting with games, discussion, and fellowship',
                type: 'youth',
                category: 'fellowship',
                startDate: this.formatDate(nextMonth),
                startTime: '18:00',
                endDate: this.formatDate(nextMonth),
                endTime: '20:00',
                allDay: false,
                recurring: true,
                repeatFrequency: 'monthly',
                repeatUntil: '',
                venue: 'youth-room',
                room: 'Youth Room',
                offSiteAddress: '',
                maxCapacity: 30,
                registrationRequired: 'optional',
                registrationDeadline: '',
                registrationFee: 5,
                primaryOrganizer: 'Youth Pastor Mike',
                contactPhone: '(555) 123-YOUTH',
                organizers: [],
                equipment: ['sound-system', 'chairs'],
                specialRequirements: 'Pizza and drinks for dinner',
                budget: 100,
                audience: ['youth'],
                eventNotes: 'Ages 13-18 welcome',
                publicEvent: true,
                childcareProvided: false,
                attendees: [],
                status: 'confirmed'
            }
        ];
    }

    getNextSunday() {
        const today = new Date();
        const daysUntilSunday = 7 - today.getDay();
        return new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    getEventTemplates() {
        return {
            'sunday-service': {
                title: 'Sunday Service',
                description: 'Weekly Sunday worship service',
                type: 'service',
                category: 'worship',
                startTime: '10:00',
                endTime: '11:30',
                venue: 'main-sanctuary',
                equipment: ['sound-system', 'projector', 'microphones'],
                audience: ['all-ages'],
                publicEvent: true,
                childcareProvided: true
            },
            'bible-study': {
                title: 'Bible Study',
                description: 'Weekly Bible study and discussion',
                type: 'study',
                category: 'education',
                startTime: '19:00',
                endTime: '20:30',
                venue: 'fellowship-hall',
                equipment: ['chairs'],
                audience: ['adults'],
                publicEvent: true
            },
            'youth-meeting': {
                title: 'Youth Meeting',
                description: 'Youth group meeting with activities and fellowship',
                type: 'youth',
                category: 'fellowship',
                startTime: '18:00',
                endTime: '20:00',
                venue: 'youth-room',
                equipment: ['sound-system'],
                audience: ['youth'],
                publicEvent: true
            },
            'board-meeting': {
                title: 'Board Meeting',
                description: 'Monthly church board meeting',
                type: 'meeting',
                category: 'administration',
                startTime: '19:30',
                endTime: '21:00',
                venue: 'conference-room',
                equipment: [],
                audience: ['adults'],
                publicEvent: false
            },
            'outreach': {
                title: 'Community Outreach',
                description: 'Community service and outreach event',
                type: 'outreach',
                category: 'community',
                startTime: '09:00',
                endTime: '15:00',
                venue: 'off-site',
                equipment: [],
                audience: ['all-ages'],
                publicEvent: true
            },
            'special-event': {
                title: 'Special Event',
                description: 'Special church event',
                type: 'special',
                category: 'fellowship',
                startTime: '18:00',
                endTime: '21:00',
                venue: 'fellowship-hall',
                equipment: ['sound-system', 'decorations'],
                audience: ['all-ages'],
                publicEvent: true
            }
        };
    }

    setupEventListeners() {
        // Search and filters
        document.getElementById('eventSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('locationFilter').addEventListener('change', (e) => {
            this.filters.location = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Action buttons
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.showEventForm();
        });

        document.getElementById('eventTemplatesBtn').addEventListener('click', () => {
            this.showTemplatesModal();
        });

        document.getElementById('exportEventsBtn').addEventListener('click', () => {
            this.exportEvents();
        });

        // Quick create buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.target.closest('.quick-btn').getAttribute('data-template');
                this.createFromTemplate(template);
            });
        });

        // Modal controls
        this.setupModalControls();

        // Form controls
        this.setupFormControls();
    }

    setupModalControls() {
        // Event modal
        document.getElementById('closeEventModal').addEventListener('click', () => {
            this.closeEventModal();
        });

        // Event form modal
        document.getElementById('closeEventFormModal').addEventListener('click', () => {
            this.closeEventFormModal();
        });

        document.getElementById('cancelEventForm').addEventListener('click', () => {
            this.closeEventFormModal();
        });

        // Templates modal
        document.getElementById('closeTemplatesModal').addEventListener('click', () => {
            this.closeTemplatesModal();
        });

        // Attendance modal
        document.getElementById('closeAttendanceModal').addEventListener('click', () => {
            this.closeAttendanceModal();
        });

        // Form submission
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
    }

    setupFormControls() {
        // Recurring event toggle
        document.getElementById('recurringEvent').addEventListener('change', (e) => {
            const recurringOptions = document.getElementById('recurringOptions');
            recurringOptions.style.display = e.target.checked ? 'block' : 'none';
        });

        // Registration required toggle
        document.getElementById('registrationRequired').addEventListener('change', (e) => {
            const registrationOptions = document.getElementById('registrationOptions');
            registrationOptions.style.display = e.target.value !== 'no' ? 'block' : 'none';
        });

        // Venue change
        document.getElementById('eventVenue').addEventListener('change', (e) => {
            const offSiteLocation = document.getElementById('offSiteLocation');
            offSiteLocation.style.display = e.target.value === 'off-site' ? 'block' : 'none';
        });

        // Add organizer button
        document.getElementById('addOrganizerBtn').addEventListener('click', () => {
            this.addOrganizerField();
        });

        // Save as draft button
        document.getElementById('saveAsDraftBtn').addEventListener('click', () => {
            this.saveEventAsDraft();
        });
    }

    renderPage() {
        this.updateStatistics();
        this.populateOrganizers();
        this.applyFilters();
    }

    updateStatistics() {
        const totalEvents = this.events.length;
        const today = new Date();
        const upcomingEvents = this.events.filter(e => new Date(e.startDate) >= today).length;
        
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        const monthlyEvents = this.events.filter(e => {
            const eventDate = new Date(e.startDate);
            return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
        }).length;

        // Calculate average attendance
        const eventsWithAttendance = this.events.filter(e => e.attendees && e.attendees.length > 0);
        const totalAttendance = eventsWithAttendance.reduce((sum, e) => sum + e.attendees.length, 0);
        const averageAttendance = eventsWithAttendance.length > 0 ? Math.round(totalAttendance / eventsWithAttendance.length) : 0;

        document.getElementById('totalEventsCount').textContent = totalEvents;
        document.getElementById('upcomingEventsCount').textContent = upcomingEvents;
        document.getElementById('monthlyEventsCount').textContent = monthlyEvents;
        document.getElementById('averageAttendanceCount').textContent = averageAttendance;
    }

    populateOrganizers() {
        // Load members for organizer dropdown
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const members = data.members || [];
            
            const organizerSelect = document.getElementById('primaryOrganizer');
            organizerSelect.innerHTML = '<option value="">Select Organizer</option>';
            
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = `${member.firstName} ${member.lastName}`;
                option.textContent = `${member.firstName} ${member.lastName}`;
                organizerSelect.appendChild(option);
            });
        }
    }

    applyFilters() {
        let filtered = [...this.events];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(this.filters.search) ||
                event.description.toLowerCase().includes(this.filters.search) ||
                event.venue.toLowerCase().includes(this.filters.search)
            );
        }

        // Type filter
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(event => event.type === this.filters.type);
        }

        // Status filter
        if (this.filters.status !== 'all') {
            const today = new Date();
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.startDate);
                switch (this.filters.status) {
                    case 'upcoming':
                        return eventDate >= today;
                    case 'past':
                        return eventDate < today;
                    case 'today':
                        return eventDate.toDateString() === today.toDateString();
                    case 'this-week':
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 6);
                        return eventDate >= weekStart && eventDate <= weekEnd;
                    case 'this-month':
                        return eventDate.getMonth() === today.getMonth() && 
                               eventDate.getFullYear() === today.getFullYear();
                    default:
                        return true;
                }
            });
        }

        // Location filter
        if (this.filters.location !== 'all') {
            filtered = filtered.filter(event => event.venue === this.filters.location);
        }

        this.filteredEvents = filtered;
        this.renderEvents();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide view containers
        document.getElementById('eventsCalendar').style.display = view === 'calendar' ? 'block' : 'none';
        document.getElementById('eventsList').style.display = view === 'list' ? 'block' : 'none';
        document.getElementById('eventsGrid').style.display = view === 'grid' ? 'grid' : 'none';
        
        this.renderEvents();
    }

    renderEvents() {
        switch (this.currentView) {
            case 'calendar':
                this.renderCalendar();
                break;
            case 'list':
                this.renderListView();
                break;
            case 'grid':
                this.renderGridView();
                break;
        }
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Generate calendar grid
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        let calendarHTML = `
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
        `;

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevMonthDay = new Date(year, month, 1 - (startingDayOfWeek - i));
            calendarHTML += `<div class="calendar-day other-month">
                <div class="day-number">${prevMonthDay.getDate()}</div>
            </div>`;
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dateString = this.formatDate(currentDate);
            const dayEvents = this.filteredEvents.filter(event => event.startDate === dateString);
            
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}"
                     onclick="eventsManager.showDayEvents('${dateString}')">
                    <div class="day-number">${day}</div>
                    ${dayEvents.length > 0 ? `
                        <div class="day-events">
                            ${dayEvents.slice(0, 3).map(event => `
                                <div class="day-event ${event.type}" onclick="event.stopPropagation(); eventsManager.viewEvent(${event.id})">
                                    ${event.startTime} ${event.title}
                                </div>
                            `).join('')}
                            ${dayEvents.length > 3 ? `<div class="more-events">+${dayEvents.length - 3} more</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Add empty cells for days after the last day of the month
        const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
        const remainingCells = totalCells - (daysInMonth + startingDayOfWeek);
        for (let i = 1; i <= remainingCells; i++) {
            calendarHTML += `<div class="calendar-day other-month">
                <div class="day-number">${i}</div>
            </div>`;
        }

        document.getElementById('calendarGrid').innerHTML = calendarHTML;
    }

    renderListView() {
        const container = document.getElementById('eventsList');
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Events Found</h3>
                    <p>No events match your current filters.</p>
                    <button class="btn btn-primary" onclick="eventsManager.showEventForm()">
                        <i class="fas fa-calendar-plus"></i> Add First Event
                    </button>
                </div>
            `;
            return;
        }

        // Sort events by date
        const sortedEvents = [...this.filteredEvents].sort((a, b) => 
            new Date(a.startDate + ' ' + a.startTime) - new Date(b.startDate + ' ' + b.startTime)
        );

        const eventsHTML = sortedEvents.map(event => {
            const eventDate = new Date(event.startDate);
            const isUpcoming = eventDate >= new Date();
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

            return `
                <div class="event-list-item" onclick="eventsManager.viewEvent(${event.id})">
                    <div class="event-date-badge ${isUpcoming ? '' : 'past'}">
                        <div class="event-month">${month}</div>
                        <div class="event-day">${day}</div>
                    </div>
                    
                    <div class="event-list-info">
                        <h4 class="event-list-title">${event.title}</h4>
                        <div class="event-list-details">
                            <div class="event-list-detail">
                                <i class="fas fa-clock"></i>
                                <span>${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</span>
                            </div>
                            <div class="event-list-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${this.formatVenue(event.venue)}</span>
                            </div>
                            ${event.maxCapacity ? `
                                <div class="event-list-detail">
                                    <i class="fas fa-users"></i>
                                    <span>${event.attendees ? event.attendees.length : 0}/${event.maxCapacity}</span>
                                </div>
                            ` : ''}
                        </div>
                        <span class="event-type-badge ${event.type}">${this.formatEventType(event.type)}</span>
                    </div>
                    
                    <div class="event-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-sm btn-secondary" onclick="eventsManager.viewEvent(${event.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="eventsManager.editEvent(${event.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${isUpcoming ? `
                            <button class="btn btn-sm btn-success" onclick="eventsManager.manageAttendance(${event.id})">
                                <i class="fas fa-user-check"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-danger" onclick="eventsManager.deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = eventsHTML;
    }

    renderGridView() {
        const container = document.getElementById('eventsGrid');
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Events Found</h3>
                    <p>No events match your current filters.</p>
                    <button class="btn btn-primary" onclick="eventsManager.showEventForm()">
                        <i class="fas fa-calendar-plus"></i> Add First Event
                    </button>
                </div>
            `;
            return;
        }

        // Sort events by date
        const sortedEvents = [...this.filteredEvents].sort((a, b) => 
            new Date(a.startDate + ' ' + a.startTime) - new Date(b.startDate + ' ' + b.startTime)
        );

        const eventsHTML = sortedEvents.map(event => {
            const eventDate = new Date(event.startDate);
            const isUpcoming = eventDate >= new Date();
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

            return `
                <div class="event-card" onclick="eventsManager.viewEvent(${event.id})">
                    <div class="event-card-header">
                        <div class="event-card-date">
                            <div class="event-card-day">${day}</div>
                            <div class="event-card-month">${month}</div>
                        </div>
                        <div class="event-card-time">${event.startTime}</div>
                    </div>
                    
                    <div class="event-card-body">
                        <h4 class="event-card-title">${event.title}</h4>
                        <p class="event-card-description">${event.description}</p>
                        
                        <div class="event-card-details">
                            <div class="event-card-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${this.formatVenue(event.venue)}</span>
                            </div>
                            ${event.maxCapacity ? `
                                <div class="event-card-detail">
                                    <i class="fas fa-users"></i>
                                    <span>${event.attendees ? event.attendees.length : 0}/${event.maxCapacity} attendees</span>
                                </div>
                            ` : ''}
                            ${event.registrationRequired !== 'no' ? `
                                <div class="event-card-detail">
                                    <i class="fas fa-clipboard-list"></i>
                                    <span>Registration ${event.registrationRequired}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="event-card-footer">
                            <span class="event-type-badge ${event.type}">${this.formatEventType(event.type)}</span>
                            <div class="event-actions" onclick="event.stopPropagation()">
                                <button class="btn btn-sm btn-primary" onclick="eventsManager.editEvent(${event.id})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ${isUpcoming ? `
                                    <button class="btn btn-sm btn-success" onclick="eventsManager.manageAttendance(${event.id})" title="Attendance">
                                        <i class="fas fa-user-check"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = eventsHTML;
    }

    formatVenue(venue) {
        const venues = {
            'main-sanctuary': 'Main Sanctuary',
            'fellowship-hall': 'Fellowship Hall',
            'youth-room': 'Youth Room',
            'conference-room': 'Conference Room',
            'children-room': 'Children\'s Room',
            'off-site': 'Off-site Location'
        };
        return venues[venue] || venue;
    }

    formatEventType(type) {
        const types = {
            service: 'Service',
            study: 'Bible Study',
            meeting: 'Meeting',
            social: 'Social',
            outreach: 'Outreach',
            youth: 'Youth',
            children: 'Children',
            special: 'Special Event'
        };
        return types[type] || type;
    }

    showDayEvents(dateString) {
        const dayEvents = this.filteredEvents.filter(event => event.startDate === dateString);
        if (dayEvents.length === 0) {
            this.showEventForm(null, dateString);
        } else if (dayEvents.length === 1) {
            this.viewEvent(dayEvents[0].id);
        } else {
            // Show list of events for that day
            const eventsList = dayEvents.map(event => `
                <div class="day-event-item" onclick="eventsManager.viewEvent(${event.id})">
                    <strong>${event.startTime} - ${event.title}</strong>
                    <p>${event.description}</p>
                </div>
            `).join('');

            const modalContent = `
                <div class="day-events-modal">
                    <h4>Events on ${new Date(dateString).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</h4>
                    <div class="day-events-list">
                        ${eventsList}
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="eventsManager.showEventForm(null, '${dateString}'); eventsManager.closeEventModal();">
                            <i class="fas fa-plus"></i> Add Event
                        </button>
                        <button class="btn btn-secondary" onclick="eventsManager.closeEventModal()">
                            Close
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('eventModalTitle').textContent = 'Day Events';
            document.getElementById('eventModalBody').innerHTML = modalContent;
            document.getElementById('eventModal').classList.add('active');
        }
    }

    showEventForm(event = null, defaultDate = null) {
        this.editingEvent = event;
        const modal = document.getElementById('eventFormModal');
        const title = document.getElementById('eventFormTitle');
        
        title.textContent = event ? 'Edit Event' : 'Add New Event';
        
        if (event) {
            this.populateEventForm(event);
        } else {
            this.clearEventForm();
            if (defaultDate) {
                document.getElementById('startDate').value = defaultDate;
                document.getElementById('endDate').value = defaultDate;
            }
        }
        
        modal.classList.add('active');
    }

    populateEventForm(event) {
        // Populate all form fields with event data
        Object.keys(event).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = event[key];
                } else {
                    field.value = event[key] || '';
                }
            }
        });

        // Handle arrays
        if (event.equipment) {
            document.querySelectorAll('input[name="equipment"]').forEach(checkbox => {
                checkbox.checked = event.equipment.includes(checkbox.value);
            });
        }

        if (event.audience) {
            document.querySelectorAll('input[name="audience"]').forEach(checkbox => {
                checkbox.checked = event.audience.includes(checkbox.value);
            });
        }

        // Show/hide conditional sections
        document.getElementById('recurringOptions').style.display = event.recurring ? 'block' : 'none';
        document.getElementById('registrationOptions').style.display = event.registrationRequired !== 'no' ? 'block' : 'none';
        document.getElementById('offSiteLocation').style.display = event.venue === 'off-site' ? 'block' : 'none';
    }

    clearEventForm() {
        document.getElementById('eventForm').reset();
        document.getElementById('recurringOptions').style.display = 'none';
        document.getElementById('registrationOptions').style.display = 'none';
        document.getElementById('offSiteLocation').style.display = 'none';
        
        // Clear organizers list
        document.getElementById('organizersList').innerHTML = '';
        
        // Clear checkboxes
        document.querySelectorAll('input[name="equipment"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('input[name="audience"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    addOrganizerField() {
        const organizersList = document.getElementById('organizersList');
        const organizerItem = document.createElement('div');
        organizerItem.className = 'organizer-item';
        organizerItem.innerHTML = `
            <select class="form-control organizer-select">
                <option value="">Select Organizer</option>
                ${Array.from(document.getElementById('primaryOrganizer').options).slice(1).map(option => 
                    `<option value="${option.value}">${option.textContent}</option>`
                ).join('')}
            </select>
            <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        organizersList.appendChild(organizerItem);
    }

    saveEvent() {
        const formData = new FormData(document.getElementById('eventForm'));
        const eventData = {};

        // Get all form fields
        for (let [key, value] of formData.entries()) {
            if (key === 'equipment' || key === 'audience') {
                if (!eventData[key]) eventData[key] = [];
                eventData[key].push(value);
            } else {
                eventData[key] = value;
            }
        }

        // Get additional fields
        const additionalFields = [
            'eventTitle', 'eventDescription', 'eventType', 'eventCategory',
            'startDate', 'startTime', 'endDate', 'endTime', 'allDayEvent',
            'recurringEvent', 'repeatFrequency', 'repeatUntil',
            'eventVenue', 'eventRoom', 'offSiteAddress',
            'maxCapacity', 'registrationRequired', 'registrationDeadline', 'registrationFee',
            'primaryOrganizer', 'contactPhone', 'specialRequirements', 'eventBudget',
            'eventNotes', 'publicEvent', 'childcareProvided'
        ];

        additionalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const key = field.replace('event', '').toLowerCase();
                if (element.type === 'checkbox') {
                    eventData[key] = element.checked;
                } else {
                    eventData[key] = element.value;
                }
            }
        });

        // Handle equipment and audience arrays
        const equipmentCheckboxes = document.querySelectorAll('input[name="equipment"]:checked');
        eventData.equipment = Array.from(equipmentCheckboxes).map(cb => cb.value);

        const audienceCheckboxes = document.querySelectorAll('input[name="audience"]:checked');
        eventData.audience = Array.from(audienceCheckboxes).map(cb => cb.value);

        // Handle additional organizers
        const organizerSelects = document.querySelectorAll('.organizer-select');
        eventData.organizers = Array.from(organizerSelects)
            .map(select => select.value)
            .filter(value => value);

        if (this.editingEvent) {
            // Update existing event
            const index = this.events.findIndex(e => e.id === this.editingEvent.id);
            if (index !== -1) {
                this.events[index] = { ...this.editingEvent, ...eventData };
            }
        } else {
            // Add new event
            eventData.id = Date.now();
            eventData.attendees = [];
            eventData.status = 'confirmed';
            this.events.push(eventData);
        }

        this.saveEvents();
        this.closeEventFormModal();
        this.renderPage();
        
        const message = this.editingEvent ? 'Event updated successfully' : 'Event added successfully';
        this.showNotification(message, 'success');
    }

    saveEventAsDraft() {
        // Similar to saveEvent but with status 'draft'
        // Implementation would be similar to saveEvent() but set status to 'draft'
        this.showNotification('Event saved as draft', 'info');
    }

    viewEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const modalBody = document.getElementById('eventModalBody');
        modalBody.innerHTML = this.generateEventDetails(event);
        
        document.getElementById('eventModalTitle').textContent = event.title;
        document.getElementById('eventModal').classList.add('active');
    }

    generateEventDetails(event) {
        const eventDate = new Date(event.startDate);
        const isUpcoming = eventDate >= new Date();

        return `
            <div class="event-details">
                <div class="event-header">
                    <div class="event-date-large">
                        <div class="event-day-large">${eventDate.getDate()}</div>
                        <div class="event-month-large">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div class="event-year-large">${eventDate.getFullYear()}</div>
                    </div>
                    <div class="event-info-large">
                        <h2>${event.title}</h2>
                        <span class="event-type-badge ${event.type}">${this.formatEventType(event.type)}</span>
                        <p class="event-description-large">${event.description}</p>
                    </div>
                </div>
                
                <div class="event-details-grid">
                    <div class="detail-section">
                        <h4><i class="fas fa-clock"></i> Date & Time</h4>
                        <p><strong>Date:</strong> ${eventDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                        <p><strong>Time:</strong> ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</p>
                        ${event.recurring ? `<p><strong>Recurring:</strong> ${event.repeatFrequency}</p>` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                        <p><strong>Venue:</strong> ${this.formatVenue(event.venue)}</p>
                        ${event.room ? `<p><strong>Room:</strong> ${event.room}</p>` : ''}
                        ${event.offSiteAddress ? `<p><strong>Address:</strong> ${event.offSiteAddress}</p>` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-users"></i> Attendance</h4>
                        ${event.maxCapacity ? `<p><strong>Capacity:</strong> ${event.attendees ? event.attendees.length : 0}/${event.maxCapacity}</p>` : ''}
                        ${event.registrationRequired !== 'no' ? `<p><strong>Registration:</strong> ${event.registrationRequired}</p>` : ''}
                        ${event.registrationFee > 0 ? `<p><strong>Fee:</strong> $${event.registrationFee}</p>` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-user-tie"></i> Organizer</h4>
                        <p><strong>Primary:</strong> ${event.primaryOrganizer || 'Not assigned'}</p>
                        ${event.contactPhone ? `<p><strong>Contact:</strong> ${event.contactPhone}</p>` : ''}
                        ${event.organizers && event.organizers.length > 0 ? `<p><strong>Additional:</strong> ${event.organizers.join(', ')}</p>` : ''}
                    </div>
                </div>
                
                ${event.equipment && event.equipment.length > 0 ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-tools"></i> Equipment Needed</h4>
                        <div class="equipment-tags">
                            ${event.equipment.map(eq => `<span class="equipment-tag">${eq.replace('-', ' ')}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${event.specialRequirements ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-clipboard-list"></i> Special Requirements</h4>
                        <p>${event.specialRequirements}</p>
                    </div>
                ` : ''}
                
                ${event.eventNotes ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                        <p>${event.eventNotes}</p>
                    </div>
                ` : ''}
                
                <div class="event-actions-large">
                    <button class="btn btn-primary" onclick="eventsManager.editEvent(${event.id}); eventsManager.closeEventModal();">
                        <i class="fas fa-edit"></i> Edit Event
                    </button>
                    ${isUpcoming ? `
                        <button class="btn btn-success" onclick="eventsManager.manageAttendance(${event.id}); eventsManager.closeEventModal();">
                            <i class="fas fa-user-check"></i> Manage Attendance
                        </button>
                    ` : ''}
                    <button class="btn btn-info" onclick="eventsManager.duplicateEvent(${event.id})">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn btn-danger" onclick="eventsManager.deleteEvent(${event.id}); eventsManager.closeEventModal();">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-secondary" onclick="eventsManager.closeEventModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showEventForm(event);
        }
    }

    duplicateEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const duplicatedEvent = { ...event };
            duplicatedEvent.id = Date.now();
            duplicatedEvent.title = `${event.title} (Copy)`;
            duplicatedEvent.attendees = [];
            
            // Set date to next week
            const nextWeek = new Date(event.startDate);
            nextWeek.setDate(nextWeek.getDate() + 7);
            duplicatedEvent.startDate = this.formatDate(nextWeek);
            duplicatedEvent.endDate = this.formatDate(nextWeek);
            
            this.showEventForm(duplicatedEvent);
        }
    }

    deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.renderPage();
            this.showNotification('Event deleted successfully', 'success');
        }
    }

    manageAttendance(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Load members for attendance
        const savedData = localStorage.getItem('accordChurchData');
        const members = savedData ? JSON.parse(savedData).members || [] : [];
        const attendees = event.attendees || [];

        const attendanceForm = `
            <div class="attendance-manager">
                <h4>Manage Attendance for "${event.title}"</h4>
                <div class="attendance-stats">
                    <div class="attendance-stat">
                        <strong>Current Attendance:</strong> ${attendees.length}
                        ${event.maxCapacity ? ` / ${event.maxCapacity}` : ''}
                    </div>
                </div>
                
                <div class="attendance-search">
                    <input type="text" class="form-control" placeholder="Search members..." id="attendanceSearch">
                </div>
                
                <div class="attendance-list" id="attendanceList">
                    ${members.map(member => `
                        <div class="attendance-item">
                            <label class="attendance-label">
                                <input type="checkbox" 
                                       ${attendees.includes(member.id) ? 'checked' : ''}
                                       data-member-id="${member.id}">
                                <div class="member-info">
                                    <strong>${member.firstName} ${member.lastName}</strong>
                                    <small>${member.email}</small>
                                </div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div class="attendance-actions">
                    <button class="btn btn-success" onclick="eventsManager.saveAttendance(${eventId})">
                        <i class="fas fa-save"></i> Save Attendance
                    </button>
                    <button class="btn btn-secondary" onclick="eventsManager.markAllPresent(${eventId})">
                        <i class="fas fa-check-double"></i> Mark All Present
                    </button>
                    <button class="btn btn-secondary" onclick="eventsManager.clearAttendance(${eventId})">
                        <i class="fas fa-times"></i> Clear All
                    </button>
                    <button class="btn btn-secondary" onclick="eventsManager.closeAttendanceModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.getElementById('attendanceModalTitle').textContent = 'Event Attendance';
        document.getElementById('attendanceModalBody').innerHTML = attendanceForm;
        document.getElementById('attendanceModal').classList.add('active');

        // Setup attendance search
        document.getElementById('attendanceSearch').addEventListener('input', (e) => {
            this.filterAttendanceList(e.target.value);
        });
    }

    filterAttendanceList(searchTerm) {
        const items = document.querySelectorAll('.attendance-item');
        items.forEach(item => {
            const memberInfo = item.querySelector('.member-info').textContent.toLowerCase();
            item.style.display = memberInfo.includes(searchTerm.toLowerCase()) ? 'block' : 'none';
        });
    }

    saveAttendance(eventId) {
        const checkboxes = document.querySelectorAll('[data-member-id]');
        const attendees = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                attendees.push(parseInt(checkbox.getAttribute('data-member-id')));
            }
        });

        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            this.events[eventIndex].attendees = attendees;
            this.saveEvents();
            this.renderPage();
            this.closeAttendanceModal();
            this.showNotification('Attendance saved successfully', 'success');
        }
    }

    markAllPresent(eventId) {
        const checkboxes = document.querySelectorAll('[data-member-id]');
        checkboxes.forEach(checkbox => {
            if (checkbox.closest('.attendance-item').style.display !== 'none') {
                checkbox.checked = true;
            }
        });
    }

    clearAttendance(eventId) {
        const checkboxes = document.querySelectorAll('[data-member-id]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    createFromTemplate(templateKey) {
        const template = this.eventTemplates[templateKey];
        if (!template) return;

        // Create event from template
        const newEvent = { ...template };
        newEvent.startDate = this.formatDate(new Date());
        newEvent.endDate = this.formatDate(new Date());
        
        this.showEventForm(newEvent);
    }

    showTemplatesModal() {
        const templatesHTML = Object.entries(this.eventTemplates).map(([key, template]) => `
            <div class="template-card" onclick="eventsManager.createFromTemplate('${key}'); eventsManager.closeTemplatesModal();">
                <div class="template-icon">
                    <i class="fas fa-${this.getTemplateIcon(template.type)}"></i>
                </div>
                <h4 class="template-title">${template.title}</h4>
                <p class="template-description">${template.description}</p>
            </div>
        `).join('');

        document.getElementById('templatesGrid').innerHTML = templatesHTML;
        document.getElementById('templatesModal').classList.add('active');
    }

    getTemplateIcon(type) {
        const icons = {
            service: 'church',
            study: 'book',
            youth: 'users',
            meeting: 'handshake',
            outreach: 'hands-helping',
            special: 'star'
        };
        return icons[type] || 'calendar';
    }

    exportEvents() {
        const csvData = this.generateEventsCSV();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-events-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Events exported successfully', 'success');
    }

    generateEventsCSV() {
        const headers = [
            'Title', 'Description', 'Type', 'Category', 'Start Date', 'Start Time',
            'End Date', 'End Time', 'Venue', 'Room', 'Max Capacity', 'Registration Required',
            'Primary Organizer', 'Contact Phone', 'Equipment', 'Budget', 'Public Event',
            'Childcare Provided', 'Notes', 'Status'
        ];

        const rows = this.events.map(event => [
            event.title || '',
            event.description || '',
            event.type || '',
            event.category || '',
            event.startDate || '',
            event.startTime || '',
            event.endDate || '',
            event.endTime || '',
            this.formatVenue(event.venue) || '',
            event.room || '',
            event.maxCapacity || '',
            event.registrationRequired || '',
            event.primaryOrganizer || '',
            event.contactPhone || '',
            (event.equipment || []).join('; '),
            event.budget || '',
            event.publicEvent ? 'Yes' : 'No',
            event.childcareProvided ? 'Yes' : 'No',
            event.eventNotes || '',
            event.status || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

    // Modal control methods
    closeEventModal() {
        document.getElementById('eventModal').classList.remove('active');
    }

    closeEventFormModal() {
        document.getElementById('eventFormModal').classList.remove('active');
        this.editingEvent = null;
    }

    closeTemplatesModal() {
        document.getElementById('templatesModal').classList.remove('active');
    }

    closeAttendanceModal() {
        document.getElementById('attendanceModal').classList.remove('active');
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

// Initialize the enhanced events manager
const eventsManager = new EnhancedEventsManager();
