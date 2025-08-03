// Enhanced Donations Management System
class EnhancedDonationsManager {
    constructor() {
        this.donations = [];
        this.pledges = [];
        this.recurringDonations = [];
        this.filteredDonations = [];
        this.currentView = 'list';
        this.filters = {
            search: '',
            type: 'all',
            method: 'all',
            dateRange: 'all',
            startDate: '',
            endDate: ''
        };
        this.editingDonation = null;
        this.goals = {
            monthly: 10000,
            annual: 120000,
            buildingFund: 50000
        };
        
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
            this.donations = data.donations || [];
            this.pledges = data.pledges || [];
            this.recurringDonations = data.recurringDonations || [];
        } else {
            this.donations = this.generateSampleDonations();
            this.pledges = [];
            this.recurringDonations = [];
            this.saveData();
        }
        this.filteredDonations = [...this.donations];
    }

    saveData() {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        data.donations = this.donations;
        data.pledges = this.pledges;
        data.recurringDonations = this.recurringDonations;
        localStorage.setItem('accordChurchData', JSON.stringify(data));
    }

    generateSampleDonations() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
        
        return [
            {
                id: 1,
                donorId: 1,
                donorName: 'John Smith',
                amount: 500.00,
                date: this.formatDate(thisMonth),
                type: 'tithe',
                method: 'bank-transfer',
                fund: 'general-fund',
                purpose: 'Monthly tithe',
                notes: 'Regular monthly contribution',
                taxDeductible: true,
                anonymous: false,
                receiptSent: true,
                checkNumber: '',
                transactionId: 'TXN001',
                recurring: false
            },
            {
                id: 2,
                donorId: 2,
                donorName: 'Mary Johnson',
                amount: 150.00,
                date: this.formatDate(thisMonth),
                type: 'offering',
                method: 'cash',
                fund: 'general-fund',
                purpose: 'Sunday offering',
                notes: '',
                taxDeductible: true,
                anonymous: false,
                receiptSent: false,
                checkNumber: '',
                transactionId: '',
                recurring: false
            },
            {
                id: 3,
                donorId: 3,
                donorName: 'David Wilson',
                amount: 1000.00,
                date: this.formatDate(lastMonth),
                type: 'building',
                method: 'check',
                fund: 'building-fund',
                purpose: 'Building fund contribution',
                notes: 'For new sanctuary construction',
                taxDeductible: true,
                anonymous: false,
                receiptSent: true,
                checkNumber: '1234',
                transactionId: '',
                recurring: false
            },
            {
                id: 4,
                donorId: 4,
                donorName: 'Sarah Brown',
                amount: 75.00,
                date: this.formatDate(thisMonth),
                type: 'special',
                method: 'credit-card',
                fund: 'mission-fund',
                purpose: 'Mission trip support',
                notes: 'For youth mission trip',
                taxDeductible: true,
                anonymous: false,
                receiptSent: true,
                checkNumber: '',
                transactionId: 'CC789',
                recurring: false
            },
            {
                id: 5,
                donorId: 5,
                donorName: 'Michael Davis',
                amount: 250.00,
                date: this.formatDate(thisMonth),
                type: 'tithe',
                method: 'online',
                fund: 'general-fund',
                purpose: 'Weekly tithe',
                notes: 'Online giving platform',
                taxDeductible: true,
                anonymous: false,
                receiptSent: true,
                checkNumber: '',
                transactionId: 'ON456',
                recurring: true
            }
        ];
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Search and filters
        document.getElementById('donationSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('methodFilter').addEventListener('change', (e) => {
            this.filters.method = e.target.value;
            this.applyFilters();
        });

        document.getElementById('dateRangeFilter').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            const customRange = document.getElementById('customDateRange');
            customRange.style.display = e.target.value === 'custom' ? 'flex' : 'none';
            this.applyFilters();
        });

        document.getElementById('startDate').addEventListener('change', (e) => {
            this.filters.startDate = e.target.value;
            this.applyFilters();
        });

        document.getElementById('endDate').addEventListener('change', (e) => {
            this.filters.endDate = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Action buttons
        document.getElementById('addDonationBtn').addEventListener('click', () => {
            this.showDonationForm();
        });

        document.getElementById('pledgeTrackingBtn').addEventListener('click', () => {
            this.showPledgeModal();
        });

        document.getElementById('recurringDonationsBtn').addEventListener('click', () => {
            this.showRecurringDonations();
        });

        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.showReportsModal();
        });

        document.getElementById('exportDonationsBtn').addEventListener('click', () => {
            this.exportDonations();
        });

        // Modal controls
        this.setupModalControls();

        // Form controls
        this.setupFormControls();
    }

    setupModalControls() {
        // Donation modal
        document.getElementById('closeDonationModal').addEventListener('click', () => {
            this.closeDonationModal();
        });

        // Donation form modal
        document.getElementById('closeDonationFormModal').addEventListener('click', () => {
            this.closeDonationFormModal();
        });

        document.getElementById('cancelDonationForm').addEventListener('click', () => {
            this.closeDonationFormModal();
        });

        // Pledge modal
        document.getElementById('closePledgeModal').addEventListener('click', () => {
            this.closePledgeModal();
        });

        // Reports modal
        document.getElementById('closeReportsModal').addEventListener('click', () => {
            this.closeReportsModal();
        });

        // Form submission
        document.getElementById('donationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDonation();
        });

        document.getElementById('saveAndReceiptBtn').addEventListener('click', () => {
            this.saveDonationAndReceipt();
        });
    }

    setupFormControls() {
        // Anonymous donation toggle
        document.getElementById('anonymousDonation').addEventListener('change', (e) => {
            const donorSelect = document.getElementById('donorSelect');
            const guestSection = document.getElementById('guestDonorSection');
            
            if (e.target.checked) {
                donorSelect.value = '';
                donorSelect.disabled = true;
                guestSection.style.display = 'block';
            } else {
                donorSelect.disabled = false;
                guestSection.style.display = 'none';
            }
        });

        // Payment method change
        document.getElementById('paymentMethod').addEventListener('change', (e) => {
            this.updatePaymentDetails(e.target.value);
        });

        // Recurring donation toggle
        document.getElementById('recurringDonation').addEventListener('change', (e) => {
            const recurringOptions = document.getElementById('recurringOptions');
            recurringOptions.style.display = e.target.checked ? 'block' : 'none';
        });

        // Donor selection
        document.getElementById('donorSelect').addEventListener('change', (e) => {
            if (e.target.value === 'guest') {
                document.getElementById('guestDonorSection').style.display = 'block';
            } else {
                document.getElementById('guestDonorSection').style.display = 'none';
            }
        });
    }

    renderPage() {
        this.updateFinancialOverview();
        this.updateGoalsProgress();
        this.populateDonors();
        this.applyFilters();
    }

    updateFinancialOverview() {
        const totalDonations = this.donations.reduce((sum, d) => sum + d.amount, 0);
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        
        const monthlyDonations = this.donations.filter(d => {
            const donationDate = new Date(d.date);
            return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
        }).reduce((sum, d) => sum + d.amount, 0);

        const averageDonation = this.donations.length > 0 ? totalDonations / this.donations.length : 0;
        const uniqueDonors = new Set(this.donations.map(d => d.donorId)).size;

        document.getElementById('totalDonationsAmount').textContent = this.formatCurrency(totalDonations);
        document.getElementById('monthlyDonationsAmount').textContent = this.formatCurrency(monthlyDonations);
        document.getElementById('averageDonation').textContent = this.formatCurrency(averageDonation);
        document.getElementById('uniqueDonors').textContent = uniqueDonors;
    }

    updateGoalsProgress() {
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        
        // Monthly goal progress
        const monthlyDonations = this.donations.filter(d => {
            const donationDate = new Date(d.date);
            return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
        }).reduce((sum, d) => sum + d.amount, 0);
        
        const monthlyProgress = (monthlyDonations / this.goals.monthly) * 100;
        document.getElementById('monthlyGoalProgress').style.width = `${Math.min(monthlyProgress, 100)}%`;
        document.getElementById('monthlyGoalCurrent').textContent = this.formatCurrency(monthlyDonations);
        document.getElementById('monthlyGoalTarget').textContent = this.formatCurrency(this.goals.monthly);

        // Annual goal progress
        const annualDonations = this.donations.filter(d => {
            const donationDate = new Date(d.date);
            return donationDate.getFullYear() === thisYear;
        }).reduce((sum, d) => sum + d.amount, 0);
        
        const annualProgress = (annualDonations / this.goals.annual) * 100;
        document.getElementById('annualGoalProgress').style.width = `${Math.min(annualProgress, 100)}%`;
        document.getElementById('annualGoalCurrent').textContent = this.formatCurrency(annualDonations);
        document.getElementById('annualGoalTarget').textContent = this.formatCurrency(this.goals.annual);

        // Building fund progress
        const buildingFundDonations = this.donations.filter(d => d.type === 'building').reduce((sum, d) => sum + d.amount, 0);
        const buildingProgress = (buildingFundDonations / this.goals.buildingFund) * 100;
        document.getElementById('buildingFundProgress').style.width = `${Math.min(buildingProgress, 100)}%`;
        document.getElementById('buildingFundCurrent').textContent = this.formatCurrency(buildingFundDonations);
        document.getElementById('buildingFundTarget').textContent = this.formatCurrency(this.goals.buildingFund);
    }

    populateDonors() {
        // Load members for donor dropdown
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const members = data.members || [];
            
            const donorSelect = document.getElementById('donorSelect');
            donorSelect.innerHTML = '<option value="">Select a donor</option>';
            donorSelect.innerHTML += '<option value="guest">Guest/Visitor</option>';
            
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = `${member.firstName} ${member.lastName}`;
                option.setAttribute('data-name', `${member.firstName} ${member.lastName}`);
                donorSelect.appendChild(option);
            });
        }
    }

    applyFilters() {
        let filtered = [...this.donations];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(donation => 
                donation.donorName.toLowerCase().includes(this.filters.search) ||
                donation.amount.toString().includes(this.filters.search) ||
                donation.purpose.toLowerCase().includes(this.filters.search) ||
                (donation.notes && donation.notes.toLowerCase().includes(this.filters.search))
            );
        }

        // Type filter
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(donation => donation.type === this.filters.type);
        }

        // Method filter
        if (this.filters.method !== 'all') {
            filtered = filtered.filter(donation => donation.method === this.filters.method);
        }

        // Date range filter
        if (this.filters.dateRange !== 'all') {
            const today = new Date();
            let startDate, endDate;

            switch (this.filters.dateRange) {
                case 'today':
                    startDate = new Date(today);
                    endDate = new Date(today);
                    break;
                case 'week':
                    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    endDate = today;
                    break;
                case 'month':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    endDate = today;
                    break;
                case 'quarter':
                    const quarter = Math.floor(today.getMonth() / 3);
                    startDate = new Date(today.getFullYear(), quarter * 3, 1);
                    endDate = today;
                    break;
                case 'year':
                    startDate = new Date(today.getFullYear(), 0, 1);
                    endDate = today;
                    break;
                case 'custom':
                    if (this.filters.startDate && this.filters.endDate) {
                        startDate = new Date(this.filters.startDate);
                        endDate = new Date(this.filters.endDate);
                    }
                    break;
            }

            if (startDate && endDate) {
                filtered = filtered.filter(donation => {
                    const donationDate = new Date(donation.date);
                    return donationDate >= startDate && donationDate <= endDate;
                });
            }
        }

        // Sort by date (most recent first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.filteredDonations = filtered;
        this.renderDonations();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide view containers
        document.getElementById('donationsList').style.display = view === 'list' ? 'block' : 'none';
        document.getElementById('donationsChart').style.display = view === 'chart' ? 'block' : 'none';
        document.getElementById('donationsSummary').style.display = view === 'summary' ? 'block' : 'none';
        
        this.renderDonations();
    }

    renderDonations() {
        switch (this.currentView) {
            case 'list':
                this.renderListView();
                break;
            case 'chart':
                this.renderChartView();
                break;
            case 'summary':
                this.renderSummaryView();
                break;
        }
    }

    renderListView() {
        const container = document.getElementById('donationsList');
        
        if (this.filteredDonations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-hand-holding-usd"></i>
                    <h3>No Donations Found</h3>
                    <p>No donations match your current filters.</p>
                    <button class="btn btn-primary" onclick="donationsManager.showDonationForm()">
                        <i class="fas fa-plus"></i> Record First Donation
                    </button>
                </div>
            `;
            return;
        }

        const donationsHTML = this.filteredDonations.map(donation => `
            <div class="donation-item" onclick="donationsManager.viewDonation(${donation.id})">
                <div class="donation-amount-badge">
                    <div class="amount">${this.formatCurrency(donation.amount, false)}</div>
                    <div class="currency">USD</div>
                </div>
                
                <div class="donation-info">
                    <div class="donation-header">
                        <h4 class="donor-name">${donation.anonymous ? 'Anonymous' : donation.donorName}</h4>
                        <span class="donation-type-badge ${donation.type}">${this.formatDonationType(donation.type)}</span>
                        ${donation.recurring ? '<i class="fas fa-sync-alt" title="Recurring donation"></i>' : ''}
                    </div>
                    
                    <div class="donation-details">
                        <div class="donation-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(donation.date).toLocaleDateString()}</span>
                        </div>
                        <div class="donation-detail">
                            <i class="fas fa-credit-card"></i>
                            <span>${this.formatPaymentMethod(donation.method)}</span>
                        </div>
                        <div class="donation-detail">
                            <i class="fas fa-tag"></i>
                            <span>${donation.purpose}</span>
                        </div>
                        ${donation.fund !== 'general-fund' ? `
                            <div class="donation-detail">
                                <i class="fas fa-folder"></i>
                                <span>${this.formatFund(donation.fund)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="donation-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-sm btn-secondary" onclick="donationsManager.viewDonation(${donation.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="donationsManager.editDonation(${donation.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="donationsManager.printReceipt(${donation.id})" title="Print Receipt">
                        <i class="fas fa-receipt"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="donationsManager.deleteDonation(${donation.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = donationsHTML;
    }

    renderChartView() {
        // This would integrate with a charting library like Chart.js
        const container = document.getElementById('donationsChart');
        const chartContainer = container.querySelector('.chart-container');
        
        chartContainer.innerHTML = `
            <div class="chart-placeholder">
                <i class="fas fa-chart-bar" style="font-size: 4rem; color: var(--gray-400);"></i>
                <h3>Chart View</h3>
                <p>Chart visualization would be implemented here using Chart.js or similar library</p>
            </div>
        `;
    }

    renderSummaryView() {
        // Category summary
        const categoryBreakdown = {};
        this.filteredDonations.forEach(donation => {
            const type = this.formatDonationType(donation.type);
            categoryBreakdown[type] = (categoryBreakdown[type] || 0) + donation.amount;
        });

        const categorySummaryHTML = Object.entries(categoryBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([type, amount]) => `
                <div class="summary-item">
                    <span class="summary-item-label">${type}</span>
                    <span class="summary-item-value">${this.formatCurrency(amount)}</span>
                </div>
            `).join('');

        document.getElementById('categorySummary').innerHTML = categorySummaryHTML;

        // Method summary
        const methodBreakdown = {};
        this.filteredDonations.forEach(donation => {
            const method = this.formatPaymentMethod(donation.method);
            methodBreakdown[method] = (methodBreakdown[method] || 0) + donation.amount;
        });

        const methodSummaryHTML = Object.entries(methodBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([method, amount]) => `
                <div class="summary-item">
                    <span class="summary-item-label">${method}</span>
                    <span class="summary-item-value">${this.formatCurrency(amount)}</span>
                </div>
            `).join('');

        document.getElementById('methodSummary').innerHTML = methodSummaryHTML;

        // Top donors
        const donorTotals = {};
        this.filteredDonations.forEach(donation => {
            if (!donation.anonymous) {
                donorTotals[donation.donorName] = (donorTotals[donation.donorName] || 0) + donation.amount;
            }
        });

        const topDonorsHTML = Object.entries(donorTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([donor, amount]) => `
                <div class="summary-item">
                    <span class="summary-item-label">${donor}</span>
                    <span class="summary-item-value">${this.formatCurrency(amount)}</span>
                </div>
            `).join('');

        document.getElementById('topDonorsSummary').innerHTML = topDonorsHTML;

        // Recent activity
        const recentDonations = [...this.filteredDonations]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        const recentActivityHTML = recentDonations.map(donation => `
            <div class="summary-item">
                <span class="summary-item-label">
                    ${donation.anonymous ? 'Anonymous' : donation.donorName} - ${new Date(donation.date).toLocaleDateString()}
                </span>
                <span class="summary-item-value">${this.formatCurrency(donation.amount)}</span>
            </div>
        `).join('');

        document.getElementById('recentActivitySummary').innerHTML = recentActivityHTML;
    }

    formatCurrency(amount, includeSymbol = true) {
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
        
        return includeSymbol ? `$${formatted}` : formatted;
    }

    formatDonationType(type) {
        const types = {
            tithe: 'Tithe',
            offering: 'Offering',
            special: 'Special Offering',
            building: 'Building Fund',
            mission: 'Mission',
            pledge: 'Pledge Payment',
            memorial: 'Memorial Gift',
            thanksgiving: 'Thanksgiving'
        };
        return types[type] || type;
    }

    formatPaymentMethod(method) {
        const methods = {
            cash: 'Cash',
            check: 'Check',
            'credit-card': 'Credit Card',
            'debit-card': 'Debit Card',
            'bank-transfer': 'Bank Transfer',
            online: 'Online Payment',
            'mobile-app': 'Mobile App'
        };
        return methods[method] || method;
    }

    formatFund(fund) {
        const funds = {
            'general-fund': 'General Fund',
            'building-fund': 'Building Fund',
            'mission-fund': 'Mission Fund',
            'youth-ministry': 'Youth Ministry',
            'children-ministry': 'Children\'s Ministry',
            'music-ministry': 'Music Ministry',
            outreach: 'Community Outreach'
        };
        return funds[fund] || fund;
    }

    updatePaymentDetails(method) {
        const paymentDetails = document.getElementById('paymentDetails');
        let detailsHTML = '';

        switch (method) {
            case 'check':
                detailsHTML = `
                    <div class="form-group">
                        <label class="form-label">Check Number</label>
                        <input type="text" class="form-control" id="checkNumber" placeholder="Check number">
                    </div>
                `;
                break;
            case 'credit-card':
            case 'debit-card':
                detailsHTML = `
                    <div class="form-group">
                        <label class="form-label">Transaction ID</label>
                        <input type="text" class="form-control" id="transactionId" placeholder="Transaction ID">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last 4 Digits</label>
                        <input type="text" class="form-control" id="cardLast4" placeholder="****" maxlength="4">
                    </div>
                `;
                break;
            case 'bank-transfer':
            case 'online':
                detailsHTML = `
                    <div class="form-group">
                        <label class="form-label">Transaction ID</label>
                        <input type="text" class="form-control" id="transactionId" placeholder="Transaction ID">
                    </div>
                `;
                break;
        }

        paymentDetails.innerHTML = detailsHTML;
    }

    showDonationForm(donation = null) {
        this.editingDonation = donation;
        const modal = document.getElementById('donationFormModal');
        const title = document.getElementById('donationFormTitle');
        
        title.textContent = donation ? 'Edit Donation' : 'Record New Donation';
        
        if (donation) {
            this.populateDonationForm(donation);
        } else {
            this.clearDonationForm();
            // Set default date to today
            document.getElementById('donationDate').value = this.formatDate(new Date());
        }
        
        modal.classList.add('active');
    }

    populateDonationForm(donation) {
        // Populate form fields with donation data
        Object.keys(donation).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = donation[key];
                } else {
                    field.value = donation[key] || '';
                }
            }
        });

        // Handle special fields
        document.getElementById('donorSelect').value = donation.donorId;
        document.getElementById('donationAmount').value = donation.amount;
        document.getElementById('donationDate').value = donation.date;
        document.getElementById('donationType').value = donation.type;
        document.getElementById('paymentMethod').value = donation.method;
        document.getElementById('donationFund').value = donation.fund;
        document.getElementById('donationPurpose').value = donation.purpose;
        document.getElementById('donationNotes').value = donation.notes;
        document.getElementById('taxDeductible').checked = donation.taxDeductible;
        document.getElementById('anonymousDonation').checked = donation.anonymous;
        document.getElementById('recurringDonation').checked = donation.recurring;

        // Update payment details
        this.updatePaymentDetails(donation.method);
        
        // Show/hide conditional sections
        document.getElementById('recurringOptions').style.display = donation.recurring ? 'block' : 'none';
    }

    clearDonationForm() {
        document.getElementById('donationForm').reset();
        document.getElementById('paymentDetails').innerHTML = '';
        document.getElementById('recurringOptions').style.display = 'none';
        document.getElementById('guestDonorSection').style.display = 'none';
        document.getElementById('donorSelect').disabled = false;
        
        // Set defaults
        document.getElementById('taxDeductible').checked = true;
        document.getElementById('sendReceipt').checked = true;
    }

    saveDonation() {
        const formData = this.collectDonationFormData();
        
        if (this.editingDonation) {
            // Update existing donation
            const index = this.donations.findIndex(d => d.id === this.editingDonation.id);
            if (index !== -1) {
                this.donations[index] = { ...this.editingDonation, ...formData };
            }
        } else {
            // Add new donation
            formData.id = Date.now();
            this.donations.push(formData);
        }

        this.saveData();
        this.closeDonationFormModal();
        this.renderPage();
        
        const message = this.editingDonation ? 'Donation updated successfully' : 'Donation recorded successfully';
        this.showNotification(message, 'success');
    }

    saveDonationAndReceipt() {
        this.saveDonation();
        // Generate and print receipt
        const lastDonation = this.donations[this.donations.length - 1];
        this.printReceipt(lastDonation.id);
    }

    collectDonationFormData() {
        const donorSelect = document.getElementById('donorSelect');
        const selectedOption = donorSelect.options[donorSelect.selectedIndex];
        
        const formData = {
            donorId: donorSelect.value === 'guest' ? null : parseInt(donorSelect.value),
            donorName: donorSelect.value === 'guest' ? 
                document.getElementById('guestDonorName').value : 
                selectedOption.getAttribute('data-name'),
            amount: parseFloat(document.getElementById('donationAmount').value),
            date: document.getElementById('donationDate').value,
            type: document.getElementById('donationType').value,
            method: document.getElementById('paymentMethod').value,
            fund: document.getElementById('donationFund').value || 'general-fund',
            purpose: document.getElementById('donationPurpose').value,
            notes: document.getElementById('donationNotes').value,
            taxDeductible: document.getElementById('taxDeductible').checked,
            anonymous: document.getElementById('anonymousDonation').checked,
            receiptSent: document.getElementById('sendReceipt').checked,
            recurring: document.getElementById('recurringDonation').checked,
            checkNumber: document.getElementById('checkNumber')?.value || '',
            transactionId: document.getElementById('transactionId')?.value || ''
        };

        // Handle guest donor information
        if (donorSelect.value === 'guest') {
            formData.guestDonor = {
                name: document.getElementById('guestDonorName').value,
                email: document.getElementById('guestDonorEmail').value,
                phone: document.getElementById('guestDonorPhone').value,
                address: document.getElementById('guestDonorAddress').value
            };
        }

        return formData;
    }

    viewDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        const modalBody = document.getElementById('donationModalBody');
        modalBody.innerHTML = this.generateDonationDetails(donation);
        
        document.getElementById('donationModalTitle').textContent = 'Donation Details';
        document.getElementById('donationModal').classList.add('active');
    }

    generateDonationDetails(donation) {
        return `
            <div class="donation-details-view">
                <div class="donation-header-large">
                    <div class="donation-amount-large">
                        ${this.formatCurrency(donation.amount)}
                    </div>
                    <div class="donation-info-large">
                        <h2>${donation.anonymous ? 'Anonymous Donation' : donation.donorName}</h2>
                        <span class="donation-type-badge ${donation.type}">${this.formatDonationType(donation.type)}</span>
                        <p class="donation-date-large">${new Date(donation.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                    </div>
                </div>
                
                <div class="donation-details-grid">
                    <div class="detail-section">
                        <h4><i class="fas fa-credit-card"></i> Payment Information</h4>
                        <p><strong>Method:</strong> ${this.formatPaymentMethod(donation.method)}</p>
                        ${donation.checkNumber ? `<p><strong>Check Number:</strong> ${donation.checkNumber}</p>` : ''}
                        ${donation.transactionId ? `<p><strong>Transaction ID:</strong> ${donation.transactionId}</p>` : ''}
                        <p><strong>Tax Deductible:</strong> ${donation.taxDeductible ? 'Yes' : 'No'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-folder"></i> Fund Information</h4>
                        <p><strong>Fund:</strong> ${this.formatFund(donation.fund)}</p>
                        <p><strong>Purpose:</strong> ${donation.purpose}</p>
                        ${donation.recurring ? '<p><strong>Recurring:</strong> Yes</p>' : ''}
                    </div>
                    
                    ${donation.notes ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                            <p>${donation.notes}</p>
                        </div>
                    ` : ''}
                    
                    ${donation.guestDonor ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-user"></i> Guest Donor Information</h4>
                            <p><strong>Name:</strong> ${donation.guestDonor.name}</p>
                            ${donation.guestDonor.email ? `<p><strong>Email:</strong> ${donation.guestDonor.email}</p>` : ''}
                            ${donation.guestDonor.phone ? `<p><strong>Phone:</strong> ${donation.guestDonor.phone}</p>` : ''}
                            ${donation.guestDonor.address ? `<p><strong>Address:</strong> ${donation.guestDonor.address}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
                
                <div class="donation-actions-large">
                    <button class="btn btn-primary" onclick="donationsManager.editDonation(${donation.id}); donationsManager.closeDonationModal();">
                        <i class="fas fa-edit"></i> Edit Donation
                    </button>
                    <button class="btn btn-info" onclick="donationsManager.printReceipt(${donation.id})">
                        <i class="fas fa-receipt"></i> Print Receipt
                    </button>
                    <button class="btn btn-success" onclick="donationsManager.sendThankYou(${donation.id})">
                        <i class="fas fa-envelope"></i> Send Thank You
                    </button>
                    <button class="btn btn-danger" onclick="donationsManager.deleteDonation(${donation.id}); donationsManager.closeDonationModal();">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-secondary" onclick="donationsManager.closeDonationModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
    }

    editDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (donation) {
            this.showDonationForm(donation);
        }
    }

    deleteDonation(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        if (confirm(`Are you sure you want to delete this ${this.formatCurrency(donation.amount)} donation from ${donation.donorName}?`)) {
            this.donations = this.donations.filter(d => d.id !== donationId);
            this.saveData();
            this.renderPage();
            this.showNotification('Donation deleted successfully', 'success');
        }
    }

    printReceipt(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (!donation) return;

        // Generate receipt HTML
        const receiptHTML = this.generateReceiptHTML(donation);
        
        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.print();
        
        this.showNotification('Receipt printed successfully', 'success');
    }

    generateReceiptHTML(donation) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Donation Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .amount { font-size: 2rem; font-weight: bold; color: #27ae60; text-align: center; margin: 20px 0; }
                    .details { margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
                    .footer { margin-top: 40px; text-align: center; font-size: 0.9rem; color: #666; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Accord Church</h1>
                    <p>Donation Receipt</p>
                    <p>Receipt #: ${donation.id}</p>
                </div>
                
                <div class="amount">${this.formatCurrency(donation.amount)}</div>
                
                <div class="details">
                    <div class="detail-row">
                        <span><strong>Donor:</strong></span>
                        <span>${donation.anonymous ? 'Anonymous' : donation.donorName}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Date:</strong></span>
                        <span>${new Date(donation.date).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Type:</strong></span>
                        <span>${this.formatDonationType(donation.type)}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Method:</strong></span>
                        <span>${this.formatPaymentMethod(donation.method)}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Fund:</strong></span>
                        <span>${this.formatFund(donation.fund)}</span>
                    </div>
                    ${donation.purpose ? `
                        <div class="detail-row">
                            <span><strong>Purpose:</strong></span>
                            <span>${donation.purpose}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <p>Thank you for your generous contribution!</p>
                    <p>This receipt serves as acknowledgment of your tax-deductible donation.</p>
                    <p>Accord Church - 123 Church Street, Springfield, IL 62701</p>
                    <p>Phone: (555) 123-CHURCH | Email: info@accordchurch.org</p>
                </div>
            </body>
            </html>
        `;
    }

    // Quick action methods
    recordTithe() {
        this.showDonationForm();
        setTimeout(() => {
            document.getElementById('donationType').value = 'tithe';
            document.getElementById('donationPurpose').value = 'Monthly tithe';
        }, 100);
    }

    recordOffering() {
        this.showDonationForm();
        setTimeout(() => {
            document.getElementById('donationType').value = 'offering';
            document.getElementById('donationPurpose').value = 'Sunday offering';
        }, 100);
    }

    showPledgeModal() {
        const pledgeContent = `
            <div class="pledge-management">
                <h4>Pledge Management</h4>
                <p>Pledge tracking functionality would be implemented here.</p>
                <div class="pledge-actions">
                    <button class="btn btn-primary">Create New Pledge</button>
                    <button class="btn btn-secondary">View Active Pledges</button>
                    <button class="btn btn-info">Pledge Reports</button>
                </div>
            </div>
        `;

        document.getElementById('pledgeModalTitle').textContent = 'Pledge Management';
        document.getElementById('pledgeModalBody').innerHTML = pledgeContent;
        document.getElementById('pledgeModal').classList.add('active');
    }

    setupRecurring() {
        this.showDonationForm();
        setTimeout(() => {
            document.getElementById('recurringDonation').checked = true;
            document.getElementById('recurringOptions').style.display = 'block';
        }, 100);
    }

    generateTaxReport() {
        this.showNotification('Tax report generation feature would be implemented here', 'info');
    }

    sendThankYou(donationId = null) {
        if (donationId) {
            this.showNotification('Thank you note sent successfully', 'success');
        } else {
            this.showNotification('Bulk thank you notes feature would be implemented here', 'info');
        }
    }

    showRecurringDonations() {
        this.showNotification('Recurring donations management would be implemented here', 'info');
    }

    showReportsModal() {
        const reportsContent = `
            <div class="financial-reports">
                <h4>Financial Reports</h4>
                <div class="reports-grid">
                    <div class="report-option">
                        <h5>Annual Giving Statement</h5>
                        <p>Generate annual giving statements for tax purposes</p>
                        <button class="btn btn-primary">Generate</button>
                    </div>
                    <div class="report-option">
                        <h5>Monthly Financial Summary</h5>
                        <p>Monthly breakdown of donations by category</p>
                        <button class="btn btn-primary">Generate</button>
                    </div>
                    <div class="report-option">
                        <h5>Donor Analysis</h5>
                        <p>Analyze donor patterns and trends</p>
                        <button class="btn btn-primary">Generate</button>
                    </div>
                    <div class="report-option">
                        <h5>Fund Performance</h5>
                        <p>Track performance of different funds</p>
                        <button class="btn btn-primary">Generate</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('reportsModalTitle').textContent = 'Financial Reports';
        document.getElementById('reportsModalBody').innerHTML = reportsContent;
        document.getElementById('reportsModal').classList.add('active');
    }

    exportDonations() {
        const csvData = this.generateDonationsCSV();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-donations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Donations exported successfully', 'success');
    }

    generateDonationsCSV() {
        const headers = [
            'Date', 'Donor Name', 'Amount', 'Type', 'Method', 'Fund', 'Purpose', 
            'Check Number', 'Transaction ID', 'Tax Deductible', 'Anonymous', 'Notes'
        ];

        const rows = this.donations.map(donation => [
            donation.date,
            donation.anonymous ? 'Anonymous' : donation.donorName,
            donation.amount,
            this.formatDonationType(donation.type),
            this.formatPaymentMethod(donation.method),
            this.formatFund(donation.fund),
            donation.purpose,
            donation.checkNumber || '',
            donation.transactionId || '',
            donation.taxDeductible ? 'Yes' : 'No',
            donation.anonymous ? 'Yes' : 'No',
            donation.notes || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

    // Modal control methods
    closeDonationModal() {
        document.getElementById('donationModal').classList.remove('active');
    }

    closeDonationFormModal() {
        document.getElementById('donationFormModal').classList.remove('active');
        this.editingDonation = null;
    }

    closePledgeModal() {
        document.getElementById('pledgeModal').classList.remove('active');
    }

    closeReportsModal() {
        document.getElementById('reportsModal').classList.remove('active');
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

// Initialize the enhanced donations manager
const donationsManager = new EnhancedDonationsManager();
