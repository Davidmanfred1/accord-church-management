// Events Management
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentView = 'list'; // 'list' or 'calendar'
        this.currentFilter = 'all';
        this.searchQuery = '';
    }

    loadEvents() {
        if (!window.app || !window.app.data) return;
        
        this.events = window.app.data.events || [];
        this.filteredEvents = [...this.events];
        this.renderEventsPage();
        this.applyFilters();
    }

    renderEventsPage() {
        const eventsContent = document.getElementById('events-content');
        if (!eventsContent) return;

        eventsContent.innerHTML = `
            <div class="events-header">
                <div class="events-actions">
                    <button class="btn btn-primary" onclick="window.eventsManager.showAddEventModal()">
                        <i class="fas fa-calendar-plus"></i> Add Event
                    </button>
                    <button class="btn btn-secondary" onclick="window.eventsManager.exportEvents()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
                
                <div class="events-controls">
                    <div class="view-toggle">
                        <button class="btn ${this.currentView === 'list' ? 'btn-primary' : 'btn-secondary'}" 
                                onclick="window.eventsManager.switchView('list')">
                            <i class="fas fa-list"></i> List
                        </button>
                        <button class="btn ${this.currentView === 'calendar' ? 'btn-primary' : 'btn-secondary'}" 
                                onclick="window.eventsManager.switchView('calendar')">
                            <i class="fas fa-calendar"></i> Calendar
                        </button>
                    </div>
                    
                    <div class="events-filters">
                        <input type="text" class="form-control" placeholder="Search events..." 
                               id="eventsSearch" style="width: 250px;">
                        <select class="form-control" id="eventsFilter">
                            <option value="all">All Events</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                            <option value="service">Services</option>
                            <option value="study">Bible Study</option>
                            <option value="meeting">Meetings</option>
                            <option value="social">Social</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="events-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Events:</span>
                    <span class="stat-value" id="totalEventsCount">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">This Month:</span>
                    <span class="stat-value" id="monthlyEventsCount">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Upcoming:</span>
                    <span class="stat-value" id="upcomingEventsCount">0</span>
                </div>
            </div>

            <div class="events-container">
                <div class="events-list" id="eventsList" style="display: ${this.currentView === 'list' ? 'block' : 'none'}">
                    <!-- Events list will be rendered here -->
                </div>
                <div class="events-calendar" id="eventsCalendar" style="display: ${this.currentView === 'calendar' ? 'block' : 'none'}">
                    <!-- Calendar will be rendered here -->
                </div>
            </div>
        `;

        this.setupEventsEventListeners();
        this.updateEventsStats();
    }

    setupEventsEventListeners() {
        const searchInput = document.getElementById('eventsSearch');
        const filterSelect = document.getElementById('eventsFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.applyFilters();
            });
        }
    }

    switchView(view) {
        this.currentView = view;
        this.renderEventsPage();
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.events];
        const today = new Date();

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(this.searchQuery) ||
                event.description.toLowerCase().includes(this.searchQuery) ||
                event.location.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                switch (this.currentFilter) {
                    case 'upcoming':
                        return eventDate >= today;
                    case 'past':
                        return eventDate < today;
                    case 'service':
                    case 'study':
                    case 'meeting':
                    case 'social':
                        return event.type.toLowerCase() === this.currentFilter;
                    default:
                        return true;
                }
            });
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.filteredEvents = filtered;
        
        if (this.currentView === 'list') {
            this.renderEventsList();
        } else {
            this.renderEventsCalendar();
        }
    }

    renderEventsList() {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;

        if (this.filteredEvents.length === 0) {
            eventsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Events Found</h3>
                    <p>No events match your current filters.</p>
                    <button class="btn btn-primary" onclick="window.eventsManager.showAddEventModal()">
                        <i class="fas fa-calendar-plus"></i> Add First Event
                    </button>
                </div>
            `;
            return;
        }

        const eventsHTML = this.filteredEvents.map(event => {
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate >= new Date();
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return `
                <div class="event-card ${isUpcoming ? 'upcoming' : 'past'}">
                    <div class="event-date-badge">
                        <div class="event-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div class="event-day">${eventDate.getDate()}</div>
                    </div>
                    
                    <div class="event-info">
                        <div class="event-header">
                            <h4 class="event-title">${event.title}</h4>
                            <span class="event-type-badge ${event.type.toLowerCase()}">${event.type}</span>
                        </div>
                        
                        <p class="event-description">${event.description}</p>
                        
                        <div class="event-details">
                            <span class="event-detail">
                                <i class="fas fa-calendar"></i> ${formattedDate}
                            </span>
                            <span class="event-detail">
                                <i class="fas fa-clock"></i> ${event.time}
                            </span>
                            <span class="event-detail">
                                <i class="fas fa-map-marker-alt"></i> ${event.location}
                            </span>
                            ${event.attendees ? `
                                <span class="event-detail">
                                    <i class="fas fa-users"></i> ${event.attendees.length} attendees
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.eventsManager.viewEvent(${event.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.eventsManager.editEvent(${event.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        ${isUpcoming ? `
                            <button class="btn btn-sm btn-success" onclick="window.eventsManager.manageAttendance(${event.id})">
                                <i class="fas fa-user-check"></i> Attendance
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-danger" onclick="window.eventsManager.deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        eventsList.innerHTML = eventsHTML;
    }

    renderEventsCalendar() {
        const eventsCalendar = document.getElementById('eventsCalendar');
        if (!eventsCalendar) return;

        // Simple calendar implementation
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        let calendarHTML = `
            <div class="calendar-header">
                <h3>${monthNames[currentMonth]} ${currentYear}</h3>
            </div>
            <div class="calendar-grid">
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
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            const dateString = currentDate.toISOString().split('T')[0];
            const dayEvents = this.filteredEvents.filter(event => event.date === dateString);
            
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}">
                    <div class="day-number">${day}</div>
                    ${dayEvents.length > 0 ? `
                        <div class="day-events">
                            ${dayEvents.slice(0, 2).map(event => `
                                <div class="day-event" onclick="window.eventsManager.viewEvent(${event.id})">
                                    ${event.title}
                                </div>
                            `).join('')}
                            ${dayEvents.length > 2 ? `<div class="more-events">+${dayEvents.length - 2} more</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        calendarHTML += '</div>';
        eventsCalendar.innerHTML = calendarHTML;
    }

    updateEventsStats() {
        const totalCount = document.getElementById('totalEventsCount');
        const monthlyCount = document.getElementById('monthlyEventsCount');
        const upcomingCount = document.getElementById('upcomingEventsCount');

        if (totalCount) totalCount.textContent = this.events.length;
        
        if (monthlyCount) {
            const thisMonth = new Date();
            const monthlyEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === thisMonth.getMonth() && 
                       eventDate.getFullYear() === thisMonth.getFullYear();
            }).length;
            monthlyCount.textContent = monthlyEvents;
        }

        if (upcomingCount) {
            const today = new Date();
            const upcoming = this.events.filter(event => new Date(event.date) >= today).length;
            upcomingCount.textContent = upcoming;
        }
    }

    showAddEventModal() {
        const eventForm = this.generateEventForm();
        window.app.showModal('Add New Event', eventForm);
        this.setupEventFormHandlers();
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const eventForm = this.generateEventForm(event);
        window.app.showModal('Edit Event', eventForm);
        this.setupEventFormHandlers(event);
    }

    viewEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const eventDetails = `
            <div class="event-profile">
                <div class="event-header">
                    <h3>${event.title}</h3>
                    <span class="event-type-badge ${event.type.toLowerCase()}">${event.type}</span>
                </div>
                
                <div class="event-description">
                    <p>${event.description}</p>
                </div>
                
                <div class="event-details-grid">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Date:</strong><br>
                            ${formattedDate}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Time:</strong><br>
                            ${event.time}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Location:</strong><br>
                            ${event.location}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <strong>Attendees:</strong><br>
                            ${event.attendees ? event.attendees.length : 0}
                        </div>
                    </div>
                </div>
                
                <div class="event-actions">
                    <button class="btn btn-primary" onclick="window.eventsManager.editEvent(${event.id}); window.app.hideModal();">
                        <i class="fas fa-edit"></i> Edit Event
                    </button>
                    <button class="btn btn-success" onclick="window.eventsManager.manageAttendance(${event.id}); window.app.hideModal();">
                        <i class="fas fa-user-check"></i> Manage Attendance
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Event Details', eventDetails);
    }

    deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
            window.app.data.events = window.app.data.events.filter(e => e.id !== eventId);
            window.app.saveData();
            this.loadEvents();
            window.app.showNotification('Event deleted successfully', 'success');
        }
    }

    generateEventForm(event = null) {
        const isEdit = event !== null;
        
        return `
            <form id="eventForm">
                <div class="form-group">
                    <label class="form-label">Event Title *</label>
                    <input type="text" class="form-control" id="eventTitle" value="${event?.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="eventDescription" rows="3">${event?.description || ''}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" class="form-control" id="eventDate" value="${event?.date || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Time *</label>
                        <input type="time" class="form-control" id="eventTime" value="${event?.time || ''}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Location *</label>
                        <input type="text" class="form-control" id="eventLocation" value="${event?.location || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Event Type</label>
                        <select class="form-control" id="eventType">
                            <option value="Service" ${event?.type === 'Service' ? 'selected' : ''}>Service</option>
                            <option value="Study" ${event?.type === 'Study' ? 'selected' : ''}>Bible Study</option>
                            <option value="Meeting" ${event?.type === 'Meeting' ? 'selected' : ''}>Meeting</option>
                            <option value="Social" ${event?.type === 'Social' ? 'selected' : ''}>Social</option>
                            <option value="Other" ${event?.type === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="eventRecurring" ${event?.recurring ? 'checked' : ''}> 
                        Recurring Event
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Event
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.app.hideModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    }

    setupEventFormHandlers(existingEvent = null) {
        const form = document.getElementById('eventForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('eventTitle').value,
                description: document.getElementById('eventDescription').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value,
                type: document.getElementById('eventType').value,
                recurring: document.getElementById('eventRecurring').checked,
                attendees: existingEvent?.attendees || []
            };

            if (existingEvent) {
                this.updateEvent(existingEvent.id, formData);
            } else {
                this.addEvent(formData);
            }
        });
    }

    addEvent(eventData) {
        const newEvent = {
            id: Date.now(),
            ...eventData
        };

        window.app.data.events.push(newEvent);
        window.app.saveData();
        this.loadEvents();
        window.app.hideModal();
        window.app.showNotification('Event added successfully', 'success');
    }

    updateEvent(eventId, eventData) {
        const eventIndex = window.app.data.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            window.app.data.events[eventIndex] = {
                ...window.app.data.events[eventIndex],
                ...eventData
            };
            window.app.saveData();
            this.loadEvents();
            window.app.hideModal();
            window.app.showNotification('Event updated successfully', 'success');
        }
    }

    manageAttendance(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const members = window.app.data.members || [];
        const attendees = event.attendees || [];

        const attendanceForm = `
            <div class="attendance-manager">
                <h4>Manage Attendance for "${event.title}"</h4>
                <div class="attendance-list">
                    ${members.map(member => `
                        <div class="attendance-item">
                            <label class="attendance-label">
                                <input type="checkbox" 
                                       ${attendees.includes(member.id) ? 'checked' : ''}
                                       data-member-id="${member.id}">
                                ${member.firstName} ${member.lastName}
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="attendance-actions">
                    <button class="btn btn-primary" onclick="window.eventsManager.saveAttendance(${eventId})">
                        <i class="fas fa-save"></i> Save Attendance
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Manage Attendance', attendanceForm);
    }

    saveAttendance(eventId) {
        const checkboxes = document.querySelectorAll('[data-member-id]');
        const attendees = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                attendees.push(parseInt(checkbox.getAttribute('data-member-id')));
            }
        });

        const eventIndex = window.app.data.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            window.app.data.events[eventIndex].attendees = attendees;
            window.app.saveData();
            this.loadEvents();
            window.app.hideModal();
            window.app.showNotification('Attendance saved successfully', 'success');
        }
    }

    exportEvents() {
        const csvContent = this.generateEventsCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-events-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.app.showNotification('Events exported successfully', 'success');
    }

    generateEventsCSV() {
        const headers = ['Title', 'Description', 'Date', 'Time', 'Location', 'Type', 'Recurring', 'Attendees Count'];
        const rows = this.events.map(event => [
            event.title,
            event.description,
            event.date,
            event.time,
            event.location,
            event.type,
            event.recurring ? 'Yes' : 'No',
            event.attendees ? event.attendees.length : 0
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field || ''}"`).join(',')
        ).join('\n');
    }
}

// Initialize events manager
document.addEventListener('DOMContentLoaded', () => {
    window.eventsManager = new EventsManager();
});
