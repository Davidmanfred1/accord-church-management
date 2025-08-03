// Enhanced Reports Management System
class EnhancedReportsManager {
    constructor() {
        this.reportHistory = [];
        this.scheduledReports = [];
        this.customReports = [];
        this.currentReport = null;
        
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
            this.reportHistory = data.reportHistory || [];
            this.scheduledReports = data.scheduledReports || [];
            this.customReports = data.customReports || [];
        }
    }

    saveData() {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        data.reportHistory = this.reportHistory;
        data.scheduledReports = this.scheduledReports;
        data.customReports = this.customReports;
        localStorage.setItem('accordChurchData', JSON.stringify(data));
    }

    setupEventListeners() {
        // Header actions
        document.getElementById('customReportBtn').addEventListener('click', () => {
            this.showCustomReportBuilder();
        });

        document.getElementById('scheduleReportBtn').addEventListener('click', () => {
            this.showScheduleModal();
        });

        document.getElementById('dashboardBtn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        // Recent and scheduled reports
        document.getElementById('viewAllReportsBtn').addEventListener('click', () => {
            this.showAllReports();
        });

        document.getElementById('addScheduleBtn').addEventListener('click', () => {
            this.showScheduleModal();
        });

        // Modal controls
        this.setupModalControls();

        // Custom report form
        this.setupCustomReportForm();

        // Schedule form
        this.setupScheduleForm();
    }

    setupModalControls() {
        // Report modal
        document.getElementById('closeReportModal').addEventListener('click', () => {
            this.closeReportModal();
        });

        document.getElementById('printReportBtn').addEventListener('click', () => {
            this.printCurrentReport();
        });

        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportCurrentReport();
        });

        document.getElementById('emailReportBtn').addEventListener('click', () => {
            this.emailCurrentReport();
        });

        // Custom report modal
        document.getElementById('closeCustomReportModal').addEventListener('click', () => {
            this.closeCustomReportModal();
        });

        document.getElementById('cancelCustomReportBtn').addEventListener('click', () => {
            this.closeCustomReportModal();
        });

        // Schedule modal
        document.getElementById('closeScheduleModal').addEventListener('click', () => {
            this.closeScheduleModal();
        });

        document.getElementById('cancelScheduleBtn').addEventListener('click', () => {
            this.closeScheduleModal();
        });
    }

    setupCustomReportForm() {
        const form = document.getElementById('customReportForm');
        const dataSourceSelect = document.getElementById('dataSource');
        const addFilterBtn = document.getElementById('addFilterBtn');
        const saveTemplateBtn = document.getElementById('saveReportTemplateBtn');

        // Data source change
        dataSourceSelect.addEventListener('change', (e) => {
            this.updateFieldsSelection(e.target.value);
            this.updateSortOptions(e.target.value);
        });

        // Add filter
        addFilterBtn.addEventListener('click', () => {
            this.addFilterRow();
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateCustomReport();
        });

        // Save template
        saveTemplateBtn.addEventListener('click', () => {
            this.saveReportTemplate();
        });
    }

    setupScheduleForm() {
        const form = document.getElementById('scheduleForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.scheduleReport();
        });
    }

    renderPage() {
        this.updateQuickStats();
        this.renderRecentReports();
        this.renderScheduledReports();
    }

    updateQuickStats() {
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Members count
            const members = data.members || [];
            document.getElementById('totalMembersCount').textContent = members.length;
            
            // Donations total
            const donations = data.donations || [];
            const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
            document.getElementById('totalDonationsAmount').textContent = this.formatCurrency(totalDonations);
            
            // Events this month
            const events = data.events || [];
            const today = new Date();
            const thisMonth = events.filter(e => {
                const eventDate = new Date(e.startDate);
                return eventDate.getMonth() === today.getMonth() && 
                       eventDate.getFullYear() === today.getFullYear();
            }).length;
            document.getElementById('totalEventsCount').textContent = thisMonth;
            
            // Average attendance
            const eventsWithAttendance = events.filter(e => e.attendees && e.attendees.length > 0);
            const totalAttendance = eventsWithAttendance.reduce((sum, e) => sum + e.attendees.length, 0);
            const averageAttendance = eventsWithAttendance.length > 0 ? 
                Math.round(totalAttendance / eventsWithAttendance.length) : 0;
            document.getElementById('averageAttendance').textContent = averageAttendance;
        }
    }

    renderRecentReports() {
        const container = document.getElementById('recentReportsList');
        
        if (this.reportHistory.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <h4>No Recent Reports</h4>
                    <p>Generate your first report to see it here</p>
                </div>
            `;
            return;
        }

        const recentReports = [...this.reportHistory]
            .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
            .slice(0, 5);

        const reportsHTML = recentReports.map(report => `
            <div class="report-history-item">
                <div class="report-info">
                    <div class="report-name">${report.name}</div>
                    <div class="report-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(report.generatedAt).toLocaleTimeString()}</span>
                        <span><i class="fas fa-user"></i> ${report.generatedBy || 'System'}</span>
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn btn-sm btn-secondary" onclick="reportsManager.viewReport('${report.id}')" title="View Report">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="reportsManager.downloadReport('${report.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="reportsManager.deleteReport('${report.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = reportsHTML;
    }

    renderScheduledReports() {
        const container = document.getElementById('scheduledReportsList');
        
        if (this.scheduledReports.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <h4>No Scheduled Reports</h4>
                    <p>Schedule reports to run automatically</p>
                </div>
            `;
            return;
        }

        const scheduledHTML = this.scheduledReports.map(schedule => `
            <div class="scheduled-report-item">
                <div class="report-info">
                    <div class="report-name">${schedule.reportName}</div>
                    <div class="report-meta">
                        <span><i class="fas fa-sync-alt"></i> ${this.formatFrequency(schedule.frequency)}</span>
                        <span><i class="fas fa-envelope"></i> ${schedule.recipients.split(',').length} recipients</span>
                        <span><i class="fas fa-calendar"></i> Next: ${new Date(schedule.nextRun).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn btn-sm btn-success" onclick="reportsManager.runScheduledReport('${schedule.id}')" title="Run Now">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="reportsManager.editSchedule('${schedule.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="reportsManager.deleteSchedule('${schedule.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = scheduledHTML;
    }

    generateReport(reportType) {
        this.showLoadingState();
        
        // Simulate report generation delay
        setTimeout(() => {
            const reportData = this.getReportData(reportType);
            const reportHTML = this.generateReportHTML(reportType, reportData);
            
            // Save to history
            const report = {
                id: Date.now().toString(),
                name: this.getReportName(reportType),
                type: reportType,
                generatedAt: new Date().toISOString(),
                generatedBy: 'Admin User',
                data: reportData
            };
            
            this.reportHistory.push(report);
            this.saveData();
            this.currentReport = report;
            
            // Show report
            document.getElementById('reportModalTitle').textContent = report.name;
            document.getElementById('reportModalBody').innerHTML = reportHTML;
            document.getElementById('reportModal').classList.add('active');
            
            this.renderRecentReports();
        }, 1500);
    }

    getReportData(reportType) {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        
        switch (reportType) {
            case 'member-directory':
                return this.generateMemberDirectoryData(data.members || []);
            case 'member-demographics':
                return this.generateDemographicsData(data.members || []);
            case 'membership-growth':
                return this.generateGrowthData(data.members || []);
            case 'giving-summary':
                return this.generateGivingSummaryData(data.donations || []);
            case 'donor-analysis':
                return this.generateDonorAnalysisData(data.donations || []);
            case 'attendance-summary':
                return this.generateAttendanceSummaryData(data.events || []);
            case 'event-calendar':
                return this.generateEventCalendarData(data.events || []);
            default:
                return { message: 'Report data not available' };
        }
    }

    generateMemberDirectoryData(members) {
        return {
            totalMembers: members.length,
            activeMembers: members.filter(m => m.membershipStatus === 'Active').length,
            members: members.map(member => ({
                name: `${member.firstName} ${member.lastName}`,
                email: member.email,
                phone: member.phone,
                address: `${member.address}, ${member.city}, ${member.state} ${member.zipCode}`,
                status: member.membershipStatus,
                joinDate: member.dateJoined,
                ministries: member.ministries ? member.ministries.join(', ') : 'None'
            }))
        };
    }

    generateDemographicsData(members) {
        const ageGroups = { 'Under 18': 0, '18-30': 0, '31-50': 0, '51-65': 0, 'Over 65': 0 };
        const genderBreakdown = { Male: 0, Female: 0, 'Not Specified': 0 };
        const maritalStatus = { Single: 0, Married: 0, Divorced: 0, Widowed: 0, 'Not Specified': 0 };
        
        members.forEach(member => {
            // Age groups
            if (member.birthDate) {
                const age = this.calculateAge(member.birthDate);
                if (age < 18) ageGroups['Under 18']++;
                else if (age <= 30) ageGroups['18-30']++;
                else if (age <= 50) ageGroups['31-50']++;
                else if (age <= 65) ageGroups['51-65']++;
                else ageGroups['Over 65']++;
            }
            
            // Gender
            genderBreakdown[member.gender || 'Not Specified']++;
            
            // Marital status
            maritalStatus[member.maritalStatus || 'Not Specified']++;
        });
        
        return {
            totalMembers: members.length,
            ageGroups,
            genderBreakdown,
            maritalStatus
        };
    }

    generateGrowthData(members) {
        const monthlyGrowth = {};
        const currentYear = new Date().getFullYear();
        
        // Initialize months
        for (let i = 0; i < 12; i++) {
            const month = new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'long' });
            monthlyGrowth[month] = 0;
        }
        
        // Count new members by month
        members.forEach(member => {
            if (member.dateJoined) {
                const joinDate = new Date(member.dateJoined);
                if (joinDate.getFullYear() === currentYear) {
                    const month = joinDate.toLocaleDateString('en-US', { month: 'long' });
                    if (monthlyGrowth[month] !== undefined) {
                        monthlyGrowth[month]++;
                    }
                }
            }
        });
        
        return {
            currentYear,
            monthlyGrowth,
            totalNewMembers: Object.values(monthlyGrowth).reduce((sum, count) => sum + count, 0),
            averageMonthlyGrowth: Object.values(monthlyGrowth).reduce((sum, count) => sum + count, 0) / 12
        };
    }

    generateGivingSummaryData(donations) {
        const totalGiving = donations.reduce((sum, d) => sum + d.amount, 0);
        const typeBreakdown = {};
        const methodBreakdown = {};
        const monthlyGiving = {};
        
        donations.forEach(donation => {
            // Type breakdown
            typeBreakdown[donation.type] = (typeBreakdown[donation.type] || 0) + donation.amount;
            
            // Method breakdown
            methodBreakdown[donation.method] = (methodBreakdown[donation.method] || 0) + donation.amount;
            
            // Monthly breakdown
            const month = new Date(donation.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            monthlyGiving[month] = (monthlyGiving[month] || 0) + donation.amount;
        });
        
        return {
            totalGiving,
            totalDonations: donations.length,
            averageDonation: donations.length > 0 ? totalGiving / donations.length : 0,
            typeBreakdown,
            methodBreakdown,
            monthlyGiving
        };
    }

    generateDonorAnalysisData(donations) {
        const donorTotals = {};
        const donorCounts = {};
        
        donations.forEach(donation => {
            if (!donation.anonymous) {
                donorTotals[donation.donorName] = (donorTotals[donation.donorName] || 0) + donation.amount;
                donorCounts[donation.donorName] = (donorCounts[donation.donorName] || 0) + 1;
            }
        });
        
        const topDonors = Object.entries(donorTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([name, amount]) => ({ name, amount, count: donorCounts[name] }));
        
        return {
            uniqueDonors: Object.keys(donorTotals).length,
            topDonors,
            averagePerDonor: Object.values(donorTotals).reduce((sum, amount) => sum + amount, 0) / Object.keys(donorTotals).length
        };
    }

    generateAttendanceSummaryData(events) {
        const totalEvents = events.length;
        const eventsWithAttendance = events.filter(e => e.attendees && e.attendees.length > 0);
        const totalAttendance = eventsWithAttendance.reduce((sum, e) => sum + e.attendees.length, 0);
        const averageAttendance = eventsWithAttendance.length > 0 ? totalAttendance / eventsWithAttendance.length : 0;
        
        const eventTypeAttendance = {};
        events.forEach(event => {
            if (event.attendees && event.attendees.length > 0) {
                eventTypeAttendance[event.type] = (eventTypeAttendance[event.type] || []).concat(event.attendees.length);
            }
        });
        
        // Calculate averages by type
        Object.keys(eventTypeAttendance).forEach(type => {
            const attendances = eventTypeAttendance[type];
            eventTypeAttendance[type] = {
                total: attendances.reduce((sum, a) => sum + a, 0),
                average: attendances.reduce((sum, a) => sum + a, 0) / attendances.length,
                events: attendances.length
            };
        });
        
        return {
            totalEvents,
            eventsWithAttendance: eventsWithAttendance.length,
            totalAttendance,
            averageAttendance,
            eventTypeAttendance
        };
    }

    generateEventCalendarData(events) {
        const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date())
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 20);
        
        const eventsByMonth = {};
        events.forEach(event => {
            const month = new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!eventsByMonth[month]) eventsByMonth[month] = [];
            eventsByMonth[month].push(event);
        });
        
        return {
            totalEvents: events.length,
            upcomingEvents,
            eventsByMonth
        };
    }

    generateReportHTML(reportType, data) {
        const reportName = this.getReportName(reportType);
        const currentDate = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let contentHTML = '';
        
        switch (reportType) {
            case 'member-directory':
                contentHTML = this.generateMemberDirectoryHTML(data);
                break;
            case 'member-demographics':
                contentHTML = this.generateDemographicsHTML(data);
                break;
            case 'membership-growth':
                contentHTML = this.generateGrowthHTML(data);
                break;
            case 'giving-summary':
                contentHTML = this.generateGivingSummaryHTML(data);
                break;
            case 'donor-analysis':
                contentHTML = this.generateDonorAnalysisHTML(data);
                break;
            case 'attendance-summary':
                contentHTML = this.generateAttendanceSummaryHTML(data);
                break;
            case 'event-calendar':
                contentHTML = this.generateEventCalendarHTML(data);
                break;
            default:
                contentHTML = '<p>Report content not available</p>';
        }
        
        return `
            <div class="report-content">
                <div class="report-header">
                    <h1 class="report-title">${reportName}</h1>
                    <div class="report-date">Generated on ${currentDate}</div>
                </div>
                ${contentHTML}
            </div>
        `;
    }

    generateMemberDirectoryHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Total Members</h4>
                    <div class="summary-number">${data.totalMembers}</div>
                </div>
                <div class="summary-card">
                    <h4>Active Members</h4>
                    <div class="summary-number">${data.activeMembers}</div>
                    <div class="summary-percentage">
                        ${data.totalMembers > 0 ? Math.round((data.activeMembers / data.totalMembers) * 100) : 0}%
                    </div>
                </div>
            </div>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Join Date</th>
                        <th>Ministries</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.members.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.email}</td>
                            <td>${member.phone}</td>
                            <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
                            <td>${new Date(member.joinDate).toLocaleDateString()}</td>
                            <td>${member.ministries}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateDemographicsHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Total Members</h4>
                    <div class="summary-number">${data.totalMembers}</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3>Age Groups</h3>
                    <table class="report-table">
                        <thead>
                            <tr><th>Age Group</th><th>Count</th><th>Percentage</th></tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.ageGroups).map(([group, count]) => `
                                <tr>
                                    <td>${group}</td>
                                    <td>${count}</td>
                                    <td>${data.totalMembers > 0 ? Math.round((count / data.totalMembers) * 100) : 0}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h3>Gender Breakdown</h3>
                    <table class="report-table">
                        <thead>
                            <tr><th>Gender</th><th>Count</th><th>Percentage</th></tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.genderBreakdown).map(([gender, count]) => `
                                <tr>
                                    <td>${gender}</td>
                                    <td>${count}</td>
                                    <td>${data.totalMembers > 0 ? Math.round((count / data.totalMembers) * 100) : 0}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h3>Marital Status</h3>
                    <table class="report-table">
                        <thead>
                            <tr><th>Status</th><th>Count</th><th>Percentage</th></tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.maritalStatus).map(([status, count]) => `
                                <tr>
                                    <td>${status}</td>
                                    <td>${count}</td>
                                    <td>${data.totalMembers > 0 ? Math.round((count / data.totalMembers) * 100) : 0}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    generateGrowthHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>New Members (${data.currentYear})</h4>
                    <div class="summary-number">${data.totalNewMembers}</div>
                </div>
                <div class="summary-card">
                    <h4>Monthly Average</h4>
                    <div class="summary-number">${Math.round(data.averageMonthlyGrowth)}</div>
                </div>
            </div>
            
            <h3>Monthly Growth - ${data.currentYear}</h3>
            <table class="report-table">
                <thead>
                    <tr><th>Month</th><th>New Members</th></tr>
                </thead>
                <tbody>
                    ${Object.entries(data.monthlyGrowth).map(([month, count]) => `
                        <tr>
                            <td>${month}</td>
                            <td>${count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateGivingSummaryHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Total Giving</h4>
                    <div class="summary-number">${this.formatCurrency(data.totalGiving)}</div>
                </div>
                <div class="summary-card">
                    <h4>Total Donations</h4>
                    <div class="summary-number">${data.totalDonations}</div>
                </div>
                <div class="summary-card">
                    <h4>Average Donation</h4>
                    <div class="summary-number">${this.formatCurrency(data.averageDonation)}</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div>
                    <h3>By Donation Type</h3>
                    <table class="report-table">
                        <thead>
                            <tr><th>Type</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.typeBreakdown).map(([type, amount]) => `
                                <tr>
                                    <td>${this.formatDonationType(type)}</td>
                                    <td>${this.formatCurrency(amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h3>By Payment Method</h3>
                    <table class="report-table">
                        <thead>
                            <tr><th>Method</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.methodBreakdown).map(([method, amount]) => `
                                <tr>
                                    <td>${this.formatPaymentMethod(method)}</td>
                                    <td>${this.formatCurrency(amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    generateDonorAnalysisHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Unique Donors</h4>
                    <div class="summary-number">${data.uniqueDonors}</div>
                </div>
                <div class="summary-card">
                    <h4>Average per Donor</h4>
                    <div class="summary-number">${this.formatCurrency(data.averagePerDonor)}</div>
                </div>
            </div>
            
            <h3>Top Donors</h3>
            <table class="report-table">
                <thead>
                    <tr><th>Donor</th><th>Total Amount</th><th>Number of Donations</th><th>Average Donation</th></tr>
                </thead>
                <tbody>
                    ${data.topDonors.map(donor => `
                        <tr>
                            <td>${donor.name}</td>
                            <td>${this.formatCurrency(donor.amount)}</td>
                            <td>${donor.count}</td>
                            <td>${this.formatCurrency(donor.amount / donor.count)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateAttendanceSummaryHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Total Events</h4>
                    <div class="summary-number">${data.totalEvents}</div>
                </div>
                <div class="summary-card">
                    <h4>Events with Attendance</h4>
                    <div class="summary-number">${data.eventsWithAttendance}</div>
                </div>
                <div class="summary-card">
                    <h4>Total Attendance</h4>
                    <div class="summary-number">${data.totalAttendance}</div>
                </div>
                <div class="summary-card">
                    <h4>Average Attendance</h4>
                    <div class="summary-number">${Math.round(data.averageAttendance)}</div>
                </div>
            </div>
            
            <h3>Attendance by Event Type</h3>
            <table class="report-table">
                <thead>
                    <tr><th>Event Type</th><th>Total Events</th><th>Total Attendance</th><th>Average Attendance</th></tr>
                </thead>
                <tbody>
                    ${Object.entries(data.eventTypeAttendance).map(([type, stats]) => `
                        <tr>
                            <td>${this.formatEventType(type)}</td>
                            <td>${stats.events}</td>
                            <td>${stats.total}</td>
                            <td>${Math.round(stats.average)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateEventCalendarHTML(data) {
        return `
            <div class="report-summary">
                <div class="summary-card">
                    <h4>Total Events</h4>
                    <div class="summary-number">${data.totalEvents}</div>
                </div>
                <div class="summary-card">
                    <h4>Upcoming Events</h4>
                    <div class="summary-number">${data.upcomingEvents.length}</div>
                </div>
            </div>
            
            <h3>Upcoming Events</h3>
            <table class="report-table">
                <thead>
                    <tr><th>Event</th><th>Date</th><th>Time</th><th>Location</th><th>Type</th></tr>
                </thead>
                <tbody>
                    ${data.upcomingEvents.map(event => `
                        <tr>
                            <td>${event.title}</td>
                            <td>${new Date(event.startDate).toLocaleDateString()}</td>
                            <td>${event.startTime}</td>
                            <td>${this.formatVenue(event.venue)}</td>
                            <td>${this.formatEventType(event.type)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Utility methods
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDonationType(type) {
        const types = {
            tithe: 'Tithe',
            offering: 'Offering',
            special: 'Special Offering',
            building: 'Building Fund',
            mission: 'Mission',
            pledge: 'Pledge Payment'
        };
        return types[type] || type;
    }

    formatPaymentMethod(method) {
        const methods = {
            cash: 'Cash',
            check: 'Check',
            'credit-card': 'Credit Card',
            'bank-transfer': 'Bank Transfer',
            online: 'Online Payment'
        };
        return methods[method] || method;
    }

    formatEventType(type) {
        const types = {
            service: 'Service',
            study: 'Bible Study',
            meeting: 'Meeting',
            social: 'Social',
            outreach: 'Outreach',
            youth: 'Youth',
            children: 'Children'
        };
        return types[type] || type;
    }

    formatVenue(venue) {
        const venues = {
            'main-sanctuary': 'Main Sanctuary',
            'fellowship-hall': 'Fellowship Hall',
            'youth-room': 'Youth Room',
            'conference-room': 'Conference Room',
            'off-site': 'Off-site Location'
        };
        return venues[venue] || venue;
    }

    formatFrequency(frequency) {
        const frequencies = {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            annually: 'Annually'
        };
        return frequencies[frequency] || frequency;
    }

    getReportName(reportType) {
        const names = {
            'member-directory': 'Member Directory',
            'member-demographics': 'Member Demographics',
            'membership-growth': 'Membership Growth Analysis',
            'inactive-members': 'Inactive Members Report',
            'birthday-anniversary': 'Birthdays & Anniversaries',
            'giving-summary': 'Giving Summary Report',
            'donor-analysis': 'Donor Analysis',
            'fund-performance': 'Fund Performance Report',
            'tax-statements': 'Tax Statements',
            'pledge-tracking': 'Pledge Tracking Report',
            'attendance-summary': 'Attendance Summary',
            'event-calendar': 'Event Calendar',
            'popular-events': 'Popular Events Report',
            'ministry-participation': 'Ministry Participation',
            'event-feedback': 'Event Feedback Report'
        };
        return names[reportType] || 'Custom Report';
    }

    showLoadingState() {
        const loadingHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <h3>Generating Report...</h3>
                <p>Please wait while we compile your data</p>
            </div>
        `;
        
        document.getElementById('reportModalTitle').textContent = 'Generating Report';
        document.getElementById('reportModalBody').innerHTML = loadingHTML;
        document.getElementById('reportModal').classList.add('active');
    }

    // Custom report builder methods
    showCustomReportBuilder() {
        document.getElementById('customReportModal').classList.add('active');
    }

    updateFieldsSelection(dataSource) {
        const fieldsContainer = document.getElementById('fieldsSelection');
        let fields = [];
        
        switch (dataSource) {
            case 'members':
                fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'membershipStatus', 'dateJoined', 'birthDate', 'ministries'];
                break;
            case 'donations':
                fields = ['donorName', 'amount', 'date', 'type', 'method', 'fund', 'purpose'];
                break;
            case 'events':
                fields = ['title', 'date', 'time', 'venue', 'type', 'attendees'];
                break;
            case 'attendance':
                fields = ['eventTitle', 'eventDate', 'attendeeCount', 'eventType'];
                break;
        }
        
        const fieldsHTML = fields.map(field => `
            <label class="field-checkbox">
                <input type="checkbox" name="fields" value="${field}">
                <span>${this.formatFieldName(field)}</span>
            </label>
        `).join('');
        
        fieldsContainer.innerHTML = fieldsHTML;
    }

    updateSortOptions(dataSource) {
        const sortBySelect = document.getElementById('sortBy');
        const groupBySelect = document.getElementById('groupBy');
        
        let options = [];
        
        switch (dataSource) {
            case 'members':
                options = ['firstName', 'lastName', 'dateJoined', 'membershipStatus'];
                break;
            case 'donations':
                options = ['date', 'amount', 'donorName', 'type'];
                break;
            case 'events':
                options = ['startDate', 'title', 'type'];
                break;
        }
        
        const optionsHTML = options.map(option => 
            `<option value="${option}">${this.formatFieldName(option)}</option>`
        ).join('');
        
        sortBySelect.innerHTML = '<option value="">No Sorting</option>' + optionsHTML;
        groupBySelect.innerHTML = '<option value="">No Grouping</option>' + optionsHTML;
    }

    formatFieldName(field) {
        const names = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            membershipStatus: 'Membership Status',
            dateJoined: 'Date Joined',
            birthDate: 'Birth Date',
            ministries: 'Ministries',
            donorName: 'Donor Name',
            amount: 'Amount',
            date: 'Date',
            type: 'Type',
            method: 'Payment Method',
            fund: 'Fund',
            purpose: 'Purpose',
            title: 'Title',
            time: 'Time',
            venue: 'Venue',
            attendees: 'Attendees',
            eventTitle: 'Event Title',
            eventDate: 'Event Date',
            attendeeCount: 'Attendee Count',
            eventType: 'Event Type',
            startDate: 'Start Date'
        };
        return names[field] || field;
    }

    addFilterRow() {
        const filtersContainer = document.getElementById('filtersContainer');
        const filterRow = document.createElement('div');
        filterRow.className = 'filter-row';
        filterRow.innerHTML = `
            <select class="form-control filter-field">
                <option value="">Select Field</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="membershipStatus">Status</option>
                <option value="amount">Amount</option>
                <option value="type">Type</option>
            </select>
            <select class="form-control filter-operator">
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater">Greater Than</option>
                <option value="less">Less Than</option>
            </select>
            <input type="text" class="form-control filter-value" placeholder="Value">
            <button type="button" class="remove-filter-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        filtersContainer.appendChild(filterRow);
    }

    generateCustomReport() {
        const formData = new FormData(document.getElementById('customReportForm'));
        const reportConfig = {
            name: formData.get('reportName'),
            description: formData.get('reportDescription'),
            dataSource: formData.get('dataSource'),
            fields: formData.getAll('fields'),
            sortBy: formData.get('sortBy'),
            sortOrder: formData.get('sortOrder'),
            groupBy: formData.get('groupBy')
        };
        
        // Collect filters
        const filterRows = document.querySelectorAll('.filter-row');
        reportConfig.filters = Array.from(filterRows).map(row => ({
            field: row.querySelector('.filter-field').value,
            operator: row.querySelector('.filter-operator').value,
            value: row.querySelector('.filter-value').value
        })).filter(filter => filter.field && filter.operator && filter.value);
        
        this.closeCustomReportModal();
        this.showNotification('Custom report generated successfully', 'success');
        
        // Generate the actual report (simplified for demo)
        this.generateReport('member-directory');
    }

    saveReportTemplate() {
        this.showNotification('Report template saved successfully', 'success');
    }

    // Schedule methods
    showScheduleModal() {
        document.getElementById('scheduleModal').classList.add('active');
    }

    scheduleReport() {
        const formData = new FormData(document.getElementById('scheduleForm'));
        const schedule = {
            id: Date.now().toString(),
            reportType: formData.get('scheduleReportType'),
            reportName: this.getReportName(formData.get('scheduleReportType')),
            frequency: formData.get('scheduleFrequency'),
            recipients: formData.get('scheduleRecipients'),
            startDate: formData.get('scheduleStartDate'),
            nextRun: this.calculateNextRun(formData.get('scheduleFrequency'), formData.get('scheduleStartDate')),
            active: true
        };
        
        this.scheduledReports.push(schedule);
        this.saveData();
        this.closeScheduleModal();
        this.renderScheduledReports();
        this.showNotification('Report scheduled successfully', 'success');
    }

    calculateNextRun(frequency, startDate) {
        const start = new Date(startDate || Date.now());
        const next = new Date(start);
        
        switch (frequency) {
            case 'daily':
                next.setDate(next.getDate() + 1);
                break;
            case 'weekly':
                next.setDate(next.getDate() + 7);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                break;
            case 'quarterly':
                next.setMonth(next.getMonth() + 3);
                break;
            case 'annually':
                next.setFullYear(next.getFullYear() + 1);
                break;
        }
        
        return next.toISOString();
    }

    runScheduledReport(scheduleId) {
        const schedule = this.scheduledReports.find(s => s.id === scheduleId);
        if (schedule) {
            this.generateReport(schedule.reportType);
            this.showNotification(`Running ${schedule.reportName}...`, 'info');
        }
    }

    editSchedule(scheduleId) {
        this.showNotification('Edit schedule functionality would be implemented here', 'info');
    }

    deleteSchedule(scheduleId) {
        if (confirm('Are you sure you want to delete this scheduled report?')) {
            this.scheduledReports = this.scheduledReports.filter(s => s.id !== scheduleId);
            this.saveData();
            this.renderScheduledReports();
            this.showNotification('Scheduled report deleted successfully', 'success');
        }
    }

    // Report actions
    viewReport(reportId) {
        const report = this.reportHistory.find(r => r.id === reportId);
        if (report) {
            this.currentReport = report;
            const reportHTML = this.generateReportHTML(report.type, report.data);
            document.getElementById('reportModalTitle').textContent = report.name;
            document.getElementById('reportModalBody').innerHTML = reportHTML;
            document.getElementById('reportModal').classList.add('active');
        }
    }

    downloadReport(reportId) {
        this.showNotification('Report download functionality would be implemented here', 'info');
    }

    deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report?')) {
            this.reportHistory = this.reportHistory.filter(r => r.id !== reportId);
            this.saveData();
            this.renderRecentReports();
            this.showNotification('Report deleted successfully', 'success');
        }
    }

    printCurrentReport() {
        if (this.currentReport) {
            const printWindow = window.open('', '_blank');
            const reportHTML = document.getElementById('reportModalBody').innerHTML;
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${this.currentReport.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .report-summary { display: flex; gap: 20px; margin: 20px 0; }
                        .summary-card { border: 1px solid #ddd; padding: 15px; flex: 1; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>${reportHTML}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    exportCurrentReport() {
        if (this.currentReport) {
            this.showNotification('Report export functionality would be implemented here', 'info');
        }
    }

    emailCurrentReport() {
        if (this.currentReport) {
            this.showNotification('Report email functionality would be implemented here', 'info');
        }
    }

    showAllReports() {
        this.showNotification('View all reports functionality would be implemented here', 'info');
    }

    // Modal control methods
    closeReportModal() {
        document.getElementById('reportModal').classList.remove('active');
        this.currentReport = null;
    }

    closeCustomReportModal() {
        document.getElementById('customReportModal').classList.remove('active');
        document.getElementById('customReportForm').reset();
        document.getElementById('fieldsSelection').innerHTML = '';
        document.getElementById('filtersContainer').innerHTML = '<button type="button" class="btn btn-sm btn-secondary" id="addFilterBtn"><i class="fas fa-plus"></i> Add Filter</button>';
    }

    closeScheduleModal() {
        document.getElementById('scheduleModal').classList.remove('active');
        document.getElementById('scheduleForm').reset();
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

// Initialize the enhanced reports manager
const reportsManager = new EnhancedReportsManager();
