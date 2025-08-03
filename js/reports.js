// Reports Management
class ReportsManager {
    constructor() {
        this.reportTypes = [
            { id: 'members', name: 'Members Report', icon: 'fas fa-users' },
            { id: 'donations', name: 'Financial Report', icon: 'fas fa-dollar-sign' },
            { id: 'events', name: 'Events Report', icon: 'fas fa-calendar' },
            { id: 'attendance', name: 'Attendance Report', icon: 'fas fa-user-check' },
            { id: 'growth', name: 'Growth Analysis', icon: 'fas fa-chart-line' }
        ];
    }

    loadReports() {
        this.renderReportsPage();
    }

    renderReportsPage() {
        const reportsContent = document.getElementById('reports-content');
        if (!reportsContent) return;

        reportsContent.innerHTML = `
            <div class="reports-header">
                <h2>Reports & Analytics</h2>
                <p>Generate comprehensive reports and analyze church data</p>
            </div>

            <div class="reports-grid">
                ${this.reportTypes.map(report => `
                    <div class="report-card" onclick="window.reportsManager.generateReport('${report.id}')">
                        <div class="report-icon">
                            <i class="${report.icon}"></i>
                        </div>
                        <div class="report-info">
                            <h4>${report.name}</h4>
                            <p>Click to generate</p>
                        </div>
                        <div class="report-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="quick-stats">
                <h3>Quick Statistics</h3>
                <div class="stats-grid" id="quickStatsGrid">
                    <!-- Quick stats will be populated here -->
                </div>
            </div>

            <div class="recent-reports">
                <h3>Recent Reports</h3>
                <div class="recent-reports-list" id="recentReportsList">
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <p>No reports generated yet. Click on a report type above to get started.</p>
                    </div>
                </div>
            </div>
        `;

        this.loadQuickStats();
    }

    loadQuickStats() {
        if (!window.app || !window.app.data) return;

        const { members, events, donations } = window.app.data;
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        // Calculate quick stats
        const stats = {
            totalMembers: members.length,
            activeMembers: members.filter(m => m.membershipStatus === 'Active').length,
            newMembersThisMonth: members.filter(m => {
                const joinDate = new Date(m.dateJoined);
                return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
            }).length,
            upcomingEvents: events.filter(e => new Date(e.date) >= today).length,
            totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
            monthlyDonations: donations.filter(d => {
                const donationDate = new Date(d.date);
                return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
            }).reduce((sum, d) => sum + d.amount, 0)
        };

        const quickStatsGrid = document.getElementById('quickStatsGrid');
        if (quickStatsGrid) {
            quickStatsGrid.innerHTML = `
                <div class="quick-stat">
                    <div class="stat-number">${stats.totalMembers}</div>
                    <div class="stat-label">Total Members</div>
                </div>
                <div class="quick-stat">
                    <div class="stat-number">${stats.activeMembers}</div>
                    <div class="stat-label">Active Members</div>
                </div>
                <div class="quick-stat">
                    <div class="stat-number">${stats.newMembersThisMonth}</div>
                    <div class="stat-label">New This Month</div>
                </div>
                <div class="quick-stat">
                    <div class="stat-number">${stats.upcomingEvents}</div>
                    <div class="stat-label">Upcoming Events</div>
                </div>
                <div class="quick-stat">
                    <div class="stat-number">$${stats.totalDonations.toLocaleString()}</div>
                    <div class="stat-label">Total Donations</div>
                </div>
                <div class="quick-stat">
                    <div class="stat-number">$${stats.monthlyDonations.toLocaleString()}</div>
                    <div class="stat-label">This Month</div>
                </div>
            `;
        }
    }

    generateReport(reportType) {
        switch (reportType) {
            case 'members':
                this.generateMembersReport();
                break;
            case 'donations':
                this.generateFinancialReport();
                break;
            case 'events':
                this.generateEventsReport();
                break;
            case 'attendance':
                this.generateAttendanceReport();
                break;
            case 'growth':
                this.generateGrowthReport();
                break;
        }
    }

    generateMembersReport() {
        if (!window.app || !window.app.data) return;

        const { members } = window.app.data;
        const today = new Date();

        // Calculate member statistics
        const stats = {
            total: members.length,
            active: members.filter(m => m.membershipStatus === 'Active').length,
            inactive: members.filter(m => m.membershipStatus === 'Inactive').length,
            visitors: members.filter(m => m.membershipStatus === 'Visitor').length,
            married: members.filter(m => m.maritalStatus === 'Married').length,
            single: members.filter(m => m.maritalStatus === 'Single').length,
            newThisYear: members.filter(m => {
                const joinDate = new Date(m.dateJoined);
                return joinDate.getFullYear() === today.getFullYear();
            }).length
        };

        // Age distribution (approximate)
        const ageGroups = { '18-30': 0, '31-50': 0, '51-70': 0, '70+': 0 };
        members.forEach(member => {
            if (member.birthDate) {
                const age = today.getFullYear() - new Date(member.birthDate).getFullYear();
                if (age <= 30) ageGroups['18-30']++;
                else if (age <= 50) ageGroups['31-50']++;
                else if (age <= 70) ageGroups['51-70']++;
                else ageGroups['70+']++;
            }
        });

        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3><i class="fas fa-users"></i> Members Report</h3>
                    <div class="report-date">Generated on ${today.toLocaleDateString()}</div>
                </div>

                <div class="report-summary">
                    <div class="summary-card">
                        <h4>Total Members</h4>
                        <div class="summary-number">${stats.total}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Active Members</h4>
                        <div class="summary-number">${stats.active}</div>
                        <div class="summary-percentage">${((stats.active / stats.total) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="summary-card">
                        <h4>New This Year</h4>
                        <div class="summary-number">${stats.newThisYear}</div>
                    </div>
                </div>

                <div class="report-sections">
                    <div class="report-section">
                        <h4>Membership Status</h4>
                        <div class="chart-placeholder">
                            <div class="stat-bar">
                                <span>Active: ${stats.active}</span>
                                <div class="bar" style="width: ${(stats.active / stats.total) * 100}%"></div>
                            </div>
                            <div class="stat-bar">
                                <span>Inactive: ${stats.inactive}</span>
                                <div class="bar" style="width: ${(stats.inactive / stats.total) * 100}%"></div>
                            </div>
                            <div class="stat-bar">
                                <span>Visitors: ${stats.visitors}</span>
                                <div class="bar" style="width: ${(stats.visitors / stats.total) * 100}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="report-section">
                        <h4>Marital Status</h4>
                        <div class="chart-placeholder">
                            <div class="stat-bar">
                                <span>Married: ${stats.married}</span>
                                <div class="bar" style="width: ${(stats.married / stats.total) * 100}%"></div>
                            </div>
                            <div class="stat-bar">
                                <span>Single: ${stats.single}</span>
                                <div class="bar" style="width: ${(stats.single / stats.total) * 100}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="report-section">
                        <h4>Age Distribution</h4>
                        <div class="chart-placeholder">
                            ${Object.entries(ageGroups).map(([group, count]) => `
                                <div class="stat-bar">
                                    <span>${group}: ${count}</span>
                                    <div class="bar" style="width: ${stats.total > 0 ? (count / stats.total) * 100 : 0}%"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.reportsManager.exportReport('members')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Members Report', reportHTML);
    }

    generateFinancialReport() {
        if (!window.app || !window.app.data) return;

        const { donations } = window.app.data;
        const today = new Date();
        const currentYear = today.getFullYear();

        // Calculate financial statistics
        const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
        const yearlyDonations = donations.filter(d => 
            new Date(d.date).getFullYear() === currentYear
        ).reduce((sum, d) => sum + d.amount, 0);

        const monthlyDonations = donations.filter(d => {
            const donationDate = new Date(d.date);
            return donationDate.getMonth() === today.getMonth() && 
                   donationDate.getFullYear() === currentYear;
        }).reduce((sum, d) => sum + d.amount, 0);

        // Donations by type
        const byType = {};
        donations.forEach(donation => {
            byType[donation.type] = (byType[donation.type] || 0) + donation.amount;
        });

        // Monthly breakdown for current year
        const monthlyBreakdown = Array(12).fill(0);
        donations.forEach(donation => {
            const donationDate = new Date(donation.date);
            if (donationDate.getFullYear() === currentYear) {
                monthlyBreakdown[donationDate.getMonth()] += donation.amount;
            }
        });

        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3><i class="fas fa-dollar-sign"></i> Financial Report</h3>
                    <div class="report-date">Generated on ${today.toLocaleDateString()}</div>
                </div>

                <div class="report-summary">
                    <div class="summary-card">
                        <h4>Total Donations</h4>
                        <div class="summary-number">$${totalDonations.toLocaleString()}</div>
                    </div>
                    <div class="summary-card">
                        <h4>This Year</h4>
                        <div class="summary-number">$${yearlyDonations.toLocaleString()}</div>
                    </div>
                    <div class="summary-card">
                        <h4>This Month</h4>
                        <div class="summary-number">$${monthlyDonations.toLocaleString()}</div>
                    </div>
                </div>

                <div class="report-sections">
                    <div class="report-section">
                        <h4>Donations by Type</h4>
                        <div class="chart-placeholder">
                            ${Object.entries(byType).map(([type, amount]) => `
                                <div class="stat-bar">
                                    <span>${type}: $${amount.toLocaleString()}</span>
                                    <div class="bar" style="width: ${(amount / totalDonations) * 100}%"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="report-section">
                        <h4>Monthly Breakdown (${currentYear})</h4>
                        <div class="chart-placeholder">
                            ${monthlyBreakdown.map((amount, index) => {
                                const monthName = new Date(currentYear, index, 1).toLocaleDateString('en-US', { month: 'short' });
                                const maxAmount = Math.max(...monthlyBreakdown);
                                return `
                                    <div class="stat-bar">
                                        <span>${monthName}: $${amount.toLocaleString()}</span>
                                        <div class="bar" style="width: ${maxAmount > 0 ? (amount / maxAmount) * 100 : 0}%"></div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.reportsManager.exportReport('financial')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Financial Report', reportHTML);
    }

    generateEventsReport() {
        if (!window.app || !window.app.data) return;

        const { events } = window.app.data;
        const today = new Date();
        const currentYear = today.getFullYear();

        // Calculate event statistics
        const totalEvents = events.length;
        const upcomingEvents = events.filter(e => new Date(e.date) >= today).length;
        const pastEvents = totalEvents - upcomingEvents;
        const yearlyEvents = events.filter(e => 
            new Date(e.date).getFullYear() === currentYear
        ).length;

        // Events by type
        const byType = {};
        events.forEach(event => {
            byType[event.type] = (byType[event.type] || 0) + 1;
        });

        // Average attendance
        const totalAttendance = events.reduce((sum, e) => 
            sum + (e.attendees ? e.attendees.length : 0), 0
        );
        const averageAttendance = totalEvents > 0 ? totalAttendance / totalEvents : 0;

        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3><i class="fas fa-calendar"></i> Events Report</h3>
                    <div class="report-date">Generated on ${today.toLocaleDateString()}</div>
                </div>

                <div class="report-summary">
                    <div class="summary-card">
                        <h4>Total Events</h4>
                        <div class="summary-number">${totalEvents}</div>
                    </div>
                    <div class="summary-card">
                        <h4>This Year</h4>
                        <div class="summary-number">${yearlyEvents}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Upcoming</h4>
                        <div class="summary-number">${upcomingEvents}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg. Attendance</h4>
                        <div class="summary-number">${Math.round(averageAttendance)}</div>
                    </div>
                </div>

                <div class="report-sections">
                    <div class="report-section">
                        <h4>Events by Type</h4>
                        <div class="chart-placeholder">
                            ${Object.entries(byType).map(([type, count]) => `
                                <div class="stat-bar">
                                    <span>${type}: ${count}</span>
                                    <div class="bar" style="width: ${(count / totalEvents) * 100}%"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="report-section">
                        <h4>Event Status</h4>
                        <div class="chart-placeholder">
                            <div class="stat-bar">
                                <span>Past Events: ${pastEvents}</span>
                                <div class="bar" style="width: ${(pastEvents / totalEvents) * 100}%"></div>
                            </div>
                            <div class="stat-bar">
                                <span>Upcoming Events: ${upcomingEvents}</span>
                                <div class="bar" style="width: ${(upcomingEvents / totalEvents) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.reportsManager.exportReport('events')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Events Report', reportHTML);
    }

    generateAttendanceReport() {
        if (!window.app || !window.app.data) return;

        const { events, members } = window.app.data;
        
        // Calculate attendance statistics
        const eventsWithAttendance = events.filter(e => e.attendees && e.attendees.length > 0);
        const totalAttendance = eventsWithAttendance.reduce((sum, e) => sum + e.attendees.length, 0);
        const averageAttendance = eventsWithAttendance.length > 0 ? totalAttendance / eventsWithAttendance.length : 0;

        // Member attendance frequency
        const memberAttendance = {};
        members.forEach(member => {
            memberAttendance[member.id] = {
                name: `${member.firstName} ${member.lastName}`,
                count: 0
            };
        });

        events.forEach(event => {
            if (event.attendees) {
                event.attendees.forEach(memberId => {
                    if (memberAttendance[memberId]) {
                        memberAttendance[memberId].count++;
                    }
                });
            }
        });

        const topAttendees = Object.values(memberAttendance)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3><i class="fas fa-user-check"></i> Attendance Report</h3>
                    <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
                </div>

                <div class="report-summary">
                    <div class="summary-card">
                        <h4>Total Attendance</h4>
                        <div class="summary-number">${totalAttendance}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Events Tracked</h4>
                        <div class="summary-number">${eventsWithAttendance.length}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Average Attendance</h4>
                        <div class="summary-number">${Math.round(averageAttendance)}</div>
                    </div>
                </div>

                <div class="report-sections">
                    <div class="report-section">
                        <h4>Top Attendees</h4>
                        <div class="attendee-list">
                            ${topAttendees.map((attendee, index) => `
                                <div class="attendee-item">
                                    <span class="rank">${index + 1}.</span>
                                    <span class="name">${attendee.name}</span>
                                    <span class="count">${attendee.count} events</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.reportsManager.exportReport('attendance')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Attendance Report', reportHTML);
    }

    generateGrowthReport() {
        if (!window.app || !window.app.data) return;

        const { members, donations } = window.app.data;
        const currentYear = new Date().getFullYear();

        // Member growth by year
        const membersByYear = {};
        members.forEach(member => {
            const year = new Date(member.dateJoined).getFullYear();
            membersByYear[year] = (membersByYear[year] || 0) + 1;
        });

        // Donation growth by year
        const donationsByYear = {};
        donations.forEach(donation => {
            const year = new Date(donation.date).getFullYear();
            donationsByYear[year] = (donationsByYear[year] || 0) + donation.amount;
        });

        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3><i class="fas fa-chart-line"></i> Growth Analysis</h3>
                    <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
                </div>

                <div class="report-sections">
                    <div class="report-section">
                        <h4>Member Growth by Year</h4>
                        <div class="chart-placeholder">
                            ${Object.entries(membersByYear).map(([year, count]) => `
                                <div class="stat-bar">
                                    <span>${year}: ${count} new members</span>
                                    <div class="bar" style="width: ${(count / Math.max(...Object.values(membersByYear))) * 100}%"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="report-section">
                        <h4>Donation Growth by Year</h4>
                        <div class="chart-placeholder">
                            ${Object.entries(donationsByYear).map(([year, amount]) => `
                                <div class="stat-bar">
                                    <span>${year}: $${amount.toLocaleString()}</span>
                                    <div class="bar" style="width: ${(amount / Math.max(...Object.values(donationsByYear))) * 100}%"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.reportsManager.exportReport('growth')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Growth Analysis', reportHTML);
    }

    exportReport(reportType) {
        // This would generate and download a PDF or Excel file
        // For now, we'll just show a notification
        window.app.showNotification(`${reportType} report exported successfully`, 'success');
    }
}

// Initialize reports manager
document.addEventListener('DOMContentLoaded', () => {
    window.reportsManager = new ReportsManager();
});
