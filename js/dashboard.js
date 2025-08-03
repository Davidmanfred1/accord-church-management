// Dashboard Management
class DashboardManager {
    constructor() {
        this.stats = {
            totalMembers: 0,
            upcomingEvents: 0,
            monthlyDonations: 0,
            activeMembers: 0
        };
        this.recentActivities = [];
        this.upcomingEvents = [];
    }

    loadDashboard() {
        this.calculateStats();
        this.loadRecentActivities();
        this.loadUpcomingEvents();
        this.updateStatsDisplay();
        this.updateActivitiesDisplay();
        this.updateEventsDisplay();
        this.animateStats();
    }

    calculateStats() {
        if (!window.app || !window.app.data) return;

        const { members, events, donations } = window.app.data;

        // Total members
        this.stats.totalMembers = members.length;

        // Active members (members with status 'Active')
        this.stats.activeMembers = members.filter(member => 
            member.membershipStatus === 'Active'
        ).length;

        // Upcoming events (events in the next 30 days)
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        this.stats.upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= thirtyDaysFromNow;
        }).length;

        // Monthly donations (current month)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        this.stats.monthlyDonations = donations
            .filter(donation => {
                const donationDate = new Date(donation.date);
                return donationDate.getMonth() === currentMonth && 
                       donationDate.getFullYear() === currentYear;
            })
            .reduce((total, donation) => total + donation.amount, 0);
    }

    loadRecentActivities() {
        if (!window.app || !window.app.data) return;

        const { members, events, donations } = window.app.data;
        this.recentActivities = [];

        // Add recent member additions
        members.slice(-5).forEach(member => {
            this.recentActivities.push({
                type: 'member',
                icon: 'fas fa-user-plus',
                title: `New member: ${member.firstName} ${member.lastName}`,
                time: this.getRelativeTime(member.dateJoined),
                timestamp: new Date(member.dateJoined)
            });
        });

        // Add recent events
        events.slice(-3).forEach(event => {
            this.recentActivities.push({
                type: 'event',
                icon: 'fas fa-calendar-plus',
                title: `Event scheduled: ${event.title}`,
                time: this.getRelativeTime(event.date),
                timestamp: new Date(event.date)
            });
        });

        // Add recent donations
        donations.slice(-5).forEach(donation => {
            this.recentActivities.push({
                type: 'donation',
                icon: 'fas fa-hand-holding-usd',
                title: `Donation received: $${donation.amount.toFixed(2)} from ${donation.memberName}`,
                time: this.getRelativeTime(donation.date),
                timestamp: new Date(donation.date)
            });
        });

        // Sort by timestamp (most recent first)
        this.recentActivities.sort((a, b) => b.timestamp - a.timestamp);
        this.recentActivities = this.recentActivities.slice(0, 10);
    }

    loadUpcomingEvents() {
        if (!window.app || !window.app.data) return;

        const { events } = window.app.data;
        const today = new Date();
        
        this.upcomingEvents = events
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
    }

    updateStatsDisplay() {
        const totalMembersEl = document.getElementById('totalMembers');
        const upcomingEventsEl = document.getElementById('upcomingEvents');
        const monthlyDonationsEl = document.getElementById('monthlyDonations');
        const activeMembersEl = document.getElementById('activeMembers');

        if (totalMembersEl) {
            totalMembersEl.textContent = this.stats.totalMembers;
        }
        if (upcomingEventsEl) {
            upcomingEventsEl.textContent = this.stats.upcomingEvents;
        }
        if (monthlyDonationsEl) {
            monthlyDonationsEl.textContent = `$${this.stats.monthlyDonations.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
        if (activeMembersEl) {
            activeMembersEl.textContent = this.stats.activeMembers;
        }
    }

    updateActivitiesDisplay() {
        const activitiesContainer = document.getElementById('recentActivities');
        if (!activitiesContainer) return;

        if (this.recentActivities.length === 0) {
            activitiesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No Recent Activities</h3>
                    <p>Activities will appear here as you use the system.</p>
                </div>
            `;
            return;
        }

        const activitiesHTML = this.recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');

        activitiesContainer.innerHTML = activitiesHTML;
    }

    updateEventsDisplay() {
        const eventsContainer = document.getElementById('upcomingEventsList');
        if (!eventsContainer) return;

        if (this.upcomingEvents.length === 0) {
            eventsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Upcoming Events</h3>
                    <p>Schedule events to see them here.</p>
                    <button class="btn btn-primary" onclick="window.app.navigateToPage('events')">
                        <i class="fas fa-plus"></i> Add Event
                    </button>
                </div>
            `;
            return;
        }

        const eventsHTML = this.upcomingEvents.map(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
            
            return `
                <div class="event-item">
                    <div class="event-date">
                        <div class="day">${day}</div>
                        <div class="month">${month}</div>
                    </div>
                    <div class="event-info">
                        <div class="event-title">${event.title}</div>
                        <div class="event-details">
                            <span><i class="fas fa-clock"></i> ${event.time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        eventsContainer.innerHTML = eventsHTML;
    }

    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }

    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Refresh dashboard data
    refresh() {
        this.loadDashboard();
        window.app.showNotification('Dashboard refreshed', 'success');
    }

    // Export dashboard data
    exportData() {
        const data = {
            stats: this.stats,
            recentActivities: this.recentActivities,
            upcomingEvents: this.upcomingEvents,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.app.showNotification('Dashboard data exported', 'success');
    }

    // Generate quick report
    generateQuickReport() {
        const report = `
            <div class="quick-report">
                <h4>Quick Dashboard Report</h4>
                <div class="report-stats">
                    <div class="report-stat">
                        <strong>Total Members:</strong> ${this.stats.totalMembers}
                    </div>
                    <div class="report-stat">
                        <strong>Active Members:</strong> ${this.stats.activeMembers}
                    </div>
                    <div class="report-stat">
                        <strong>Upcoming Events:</strong> ${this.stats.upcomingEvents}
                    </div>
                    <div class="report-stat">
                        <strong>Monthly Donations:</strong> $${this.stats.monthlyDonations.toFixed(2)}
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.dashboardManager.exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Dashboard Report', report);
    }
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
