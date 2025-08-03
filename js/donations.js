// Donations Management
class DonationsManager {
    constructor() {
        this.donations = [];
        this.filteredDonations = [];
        this.currentFilter = 'all';
        this.dateRange = 'all';
        this.searchQuery = '';
    }

    loadDonations() {
        if (!window.app || !window.app.data) return;
        
        this.donations = window.app.data.donations || [];
        this.filteredDonations = [...this.donations];
        this.renderDonationsPage();
        this.applyFilters();
    }

    renderDonationsPage() {
        const donationsContent = document.getElementById('donations-content');
        if (!donationsContent) return;

        donationsContent.innerHTML = `
            <div class="donations-header">
                <div class="donations-actions">
                    <button class="btn btn-primary" onclick="window.donationsManager.showAddDonationModal()">
                        <i class="fas fa-hand-holding-usd"></i> Record Donation
                    </button>
                    <button class="btn btn-secondary" onclick="window.donationsManager.exportDonations()">
                        <i class="fas fa-download"></i> Export
                    </button>
                    <button class="btn btn-info" onclick="window.donationsManager.generateReport()">
                        <i class="fas fa-chart-bar"></i> Generate Report
                    </button>
                </div>
                
                <div class="donations-filters">
                    <input type="text" class="form-control" placeholder="Search donations..." 
                           id="donationsSearch" style="width: 250px;">
                    <select class="form-control" id="donationsFilter">
                        <option value="all">All Types</option>
                        <option value="tithe">Tithe</option>
                        <option value="offering">Offering</option>
                        <option value="special">Special</option>
                        <option value="building">Building Fund</option>
                        <option value="mission">Mission</option>
                    </select>
                    <select class="form-control" id="dateRangeFilter">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            <div class="donations-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalDonationsAmount">$0</h3>
                        <p>Total Donations</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-month"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="monthlyDonationsAmount">$0</h3>
                        <p>This Month</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="averageDonation">$0</h3>
                        <p>Average Donation</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="uniqueDonors">0</h3>
                        <p>Unique Donors</p>
                    </div>
                </div>
            </div>

            <div class="donations-list" id="donationsList">
                <!-- Donations will be rendered here -->
            </div>
        `;

        this.setupDonationsEventListeners();
        this.updateDonationsStats();
    }

    setupDonationsEventListeners() {
        const searchInput = document.getElementById('donationsSearch');
        const filterSelect = document.getElementById('donationsFilter');
        const dateRangeSelect = document.getElementById('dateRangeFilter');

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

        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.dateRange = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.donations];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(donation => 
                donation.memberName.toLowerCase().includes(this.searchQuery) ||
                donation.type.toLowerCase().includes(this.searchQuery) ||
                donation.method.toLowerCase().includes(this.searchQuery) ||
                (donation.notes && donation.notes.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(donation => 
                donation.type.toLowerCase() === this.currentFilter
            );
        }

        // Apply date range filter
        if (this.dateRange !== 'all') {
            const today = new Date();
            const startDate = this.getDateRangeStart(today, this.dateRange);
            
            filtered = filtered.filter(donation => {
                const donationDate = new Date(donation.date);
                return donationDate >= startDate && donationDate <= today;
            });
        }

        // Sort by date (most recent first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.filteredDonations = filtered;
        this.renderDonationsList();
        this.updateDonationsStats();
    }

    getDateRangeStart(today, range) {
        const start = new Date(today);
        
        switch (range) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                break;
            case 'week':
                start.setDate(today.getDate() - today.getDay());
                start.setHours(0, 0, 0, 0);
                break;
            case 'month':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                start.setMonth(quarter * 3, 1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'year':
                start.setMonth(0, 1);
                start.setHours(0, 0, 0, 0);
                break;
        }
        
        return start;
    }

    renderDonationsList() {
        const donationsList = document.getElementById('donationsList');
        if (!donationsList) return;

        if (this.filteredDonations.length === 0) {
            donationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-hand-holding-heart"></i>
                    <h3>No Donations Found</h3>
                    <p>No donations match your current filters.</p>
                    <button class="btn btn-primary" onclick="window.donationsManager.showAddDonationModal()">
                        <i class="fas fa-hand-holding-usd"></i> Record First Donation
                    </button>
                </div>
            `;
            return;
        }

        const donationsHTML = this.filteredDonations.map(donation => `
            <div class="donation-card">
                <div class="donation-amount">
                    <span class="amount">$${donation.amount.toFixed(2)}</span>
                    <span class="type-badge ${donation.type.toLowerCase()}">${donation.type}</span>
                </div>
                
                <div class="donation-info">
                    <h4 class="donor-name">${donation.memberName}</h4>
                    <div class="donation-details">
                        <span class="donation-detail">
                            <i class="fas fa-calendar"></i> ${new Date(donation.date).toLocaleDateString()}
                        </span>
                        <span class="donation-detail">
                            <i class="fas fa-credit-card"></i> ${donation.method}
                        </span>
                        ${donation.notes ? `
                            <span class="donation-detail">
                                <i class="fas fa-sticky-note"></i> ${donation.notes}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="donation-actions">
                    <button class="btn btn-sm btn-secondary" onclick="window.donationsManager.viewDonation(${donation.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="window.donationsManager.editDonation(${donation.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.donationsManager.deleteDonation(${donation.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        donationsList.innerHTML = donationsHTML;
    }

    updateDonationsStats() {
        const totalAmount = document.getElementById('totalDonationsAmount');
        const monthlyAmount = document.getElementById('monthlyDonationsAmount');
        const averageAmount = document.getElementById('averageDonation');
        const uniqueDonorsCount = document.getElementById('uniqueDonors');

        // Calculate total donations
        const total = this.filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
        if (totalAmount) {
            totalAmount.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }

        // Calculate monthly donations
        const today = new Date();
        const monthlyDonations = this.donations.filter(donation => {
            const donationDate = new Date(donation.date);
            return donationDate.getMonth() === today.getMonth() && 
                   donationDate.getFullYear() === today.getFullYear();
        });
        const monthlyTotal = monthlyDonations.reduce((sum, donation) => sum + donation.amount, 0);
        if (monthlyAmount) {
            monthlyAmount.textContent = `$${monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }

        // Calculate average donation
        const average = this.filteredDonations.length > 0 ? total / this.filteredDonations.length : 0;
        if (averageAmount) {
            averageAmount.textContent = `$${average.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }

        // Calculate unique donors
        const uniqueDonors = new Set(this.filteredDonations.map(d => d.memberId)).size;
        if (uniqueDonorsCount) {
            uniqueDonorsCount.textContent = uniqueDonors;
        }
    }

    showAddDonationModal() {
        const donationForm = this.generateDonationForm();
        window.app.showModal('Record New Donation', donationForm);
        this.setupDonationFormHandlers();
    }

    editDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        const donationForm = this.generateDonationForm(donation);
        window.app.showModal('Edit Donation', donationForm);
        this.setupDonationFormHandlers(donation);
    }

    viewDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        const donationDetails = `
            <div class="donation-profile">
                <div class="donation-header">
                    <div class="donation-amount-large">$${donation.amount.toFixed(2)}</div>
                    <span class="type-badge ${donation.type.toLowerCase()}">${donation.type}</span>
                </div>
                
                <div class="donation-details-grid">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <div>
                            <strong>Donor:</strong><br>
                            ${donation.memberName}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Date:</strong><br>
                            ${new Date(donation.date).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-credit-card"></i>
                        <div>
                            <strong>Method:</strong><br>
                            ${donation.method}
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tag"></i>
                        <div>
                            <strong>Type:</strong><br>
                            ${donation.type}
                        </div>
                    </div>
                </div>
                
                ${donation.notes ? `
                    <div class="donation-notes">
                        <h4>Notes:</h4>
                        <p>${donation.notes}</p>
                    </div>
                ` : ''}
                
                <div class="donation-actions">
                    <button class="btn btn-primary" onclick="window.donationsManager.editDonation(${donation.id}); window.app.hideModal();">
                        <i class="fas fa-edit"></i> Edit Donation
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Donation Details', donationDetails);
    }

    deleteDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        if (confirm(`Are you sure you want to delete this $${donation.amount.toFixed(2)} donation from ${donation.memberName}?`)) {
            window.app.data.donations = window.app.data.donations.filter(d => d.id !== donationId);
            window.app.saveData();
            this.loadDonations();
            window.app.showNotification('Donation deleted successfully', 'success');
        }
    }

    generateDonationForm(donation = null) {
        const isEdit = donation !== null;
        const members = window.app.data.members || [];
        
        return `
            <form id="donationForm">
                <div class="form-group">
                    <label class="form-label">Member *</label>
                    <select class="form-control" id="donationMember" required>
                        <option value="">Select a member</option>
                        ${members.map(member => `
                            <option value="${member.id}" data-name="${member.firstName} ${member.lastName}"
                                    ${donation && donation.memberId === member.id ? 'selected' : ''}>
                                ${member.firstName} ${member.lastName}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Amount *</label>
                        <input type="number" class="form-control" id="donationAmount" 
                               step="0.01" min="0" value="${donation?.amount || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" class="form-control" id="donationDate" 
                               value="${donation?.date || new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Type *</label>
                        <select class="form-control" id="donationType" required>
                            <option value="Tithe" ${donation?.type === 'Tithe' ? 'selected' : ''}>Tithe</option>
                            <option value="Offering" ${donation?.type === 'Offering' ? 'selected' : ''}>Offering</option>
                            <option value="Special" ${donation?.type === 'Special' ? 'selected' : ''}>Special</option>
                            <option value="Building" ${donation?.type === 'Building' ? 'selected' : ''}>Building Fund</option>
                            <option value="Mission" ${donation?.type === 'Mission' ? 'selected' : ''}>Mission</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Method *</label>
                        <select class="form-control" id="donationMethod" required>
                            <option value="Cash" ${donation?.method === 'Cash' ? 'selected' : ''}>Cash</option>
                            <option value="Check" ${donation?.method === 'Check' ? 'selected' : ''}>Check</option>
                            <option value="Credit Card" ${donation?.method === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
                            <option value="Bank Transfer" ${donation?.method === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
                            <option value="Online" ${donation?.method === 'Online' ? 'selected' : ''}>Online</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="donationNotes" rows="3">${donation?.notes || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Record'} Donation
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.app.hideModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    }

    setupDonationFormHandlers(existingDonation = null) {
        const form = document.getElementById('donationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const memberSelect = document.getElementById('donationMember');
            const selectedOption = memberSelect.options[memberSelect.selectedIndex];
            
            const formData = {
                memberId: parseInt(memberSelect.value),
                memberName: selectedOption.getAttribute('data-name'),
                amount: parseFloat(document.getElementById('donationAmount').value),
                date: document.getElementById('donationDate').value,
                type: document.getElementById('donationType').value,
                method: document.getElementById('donationMethod').value,
                notes: document.getElementById('donationNotes').value
            };

            if (existingDonation) {
                this.updateDonation(existingDonation.id, formData);
            } else {
                this.addDonation(formData);
            }
        });
    }

    addDonation(donationData) {
        const newDonation = {
            id: Date.now(),
            ...donationData
        };

        window.app.data.donations.push(newDonation);
        window.app.saveData();
        this.loadDonations();
        window.app.hideModal();
        window.app.showNotification('Donation recorded successfully', 'success');
    }

    updateDonation(donationId, donationData) {
        const donationIndex = window.app.data.donations.findIndex(d => d.id === donationId);
        if (donationIndex !== -1) {
            window.app.data.donations[donationIndex] = {
                ...window.app.data.donations[donationIndex],
                ...donationData
            };
            window.app.saveData();
            this.loadDonations();
            window.app.hideModal();
            window.app.showNotification('Donation updated successfully', 'success');
        }
    }

    generateReport() {
        const reportData = this.generateReportData();
        const reportHTML = `
            <div class="donation-report">
                <h4>Donation Report</h4>
                <div class="report-summary">
                    <div class="summary-item">
                        <strong>Total Donations:</strong> $${reportData.total.toFixed(2)}
                    </div>
                    <div class="summary-item">
                        <strong>Number of Donations:</strong> ${reportData.count}
                    </div>
                    <div class="summary-item">
                        <strong>Average Donation:</strong> $${reportData.average.toFixed(2)}
                    </div>
                    <div class="summary-item">
                        <strong>Unique Donors:</strong> ${reportData.uniqueDonors}
                    </div>
                </div>
                
                <div class="report-breakdown">
                    <h5>By Type:</h5>
                    ${Object.entries(reportData.byType).map(([type, amount]) => `
                        <div class="breakdown-item">
                            <span>${type}:</span>
                            <span>$${amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.donationsManager.exportDonations()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Donation Report', reportHTML);
    }

    generateReportData() {
        const total = this.filteredDonations.reduce((sum, d) => sum + d.amount, 0);
        const count = this.filteredDonations.length;
        const average = count > 0 ? total / count : 0;
        const uniqueDonors = new Set(this.filteredDonations.map(d => d.memberId)).size;
        
        const byType = {};
        this.filteredDonations.forEach(donation => {
            byType[donation.type] = (byType[donation.type] || 0) + donation.amount;
        });

        return { total, count, average, uniqueDonors, byType };
    }

    exportDonations() {
        const csvContent = this.generateDonationsCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-donations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.app.showNotification('Donations exported successfully', 'success');
    }

    generateDonationsCSV() {
        const headers = ['Date', 'Member Name', 'Amount', 'Type', 'Method', 'Notes'];
        const rows = this.donations.map(donation => [
            donation.date,
            donation.memberName,
            donation.amount,
            donation.type,
            donation.method,
            donation.notes || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field || ''}"`).join(',')
        ).join('\n');
    }
}

// Initialize donations manager
document.addEventListener('DOMContentLoaded', () => {
    window.donationsManager = new DonationsManager();
});
