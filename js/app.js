// Main Application JavaScript
class AccordChurchApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.data = {
            members: [],
            events: [],
            donations: [],
            settings: {}
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupNavigation();
        this.checkAuthentication();
        this.initializeCurrentPage();
    }

    // Data Management
    loadData() {
        // Load data from localStorage
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        } else {
            // Initialize with sample data
            this.initializeSampleData();
        }
    }

    saveData() {
        localStorage.setItem('accordChurchData', JSON.stringify(this.data));
    }

    initializeSampleData() {
        // Sample members
        this.data.members = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@email.com',
                phone: '(555) 123-4567',
                address: '123 Main St, City, State 12345',
                dateJoined: '2023-01-15',
                membershipStatus: 'Active',
                birthDate: '1985-06-20',
                maritalStatus: 'Married',
                occupation: 'Teacher',
                emergencyContact: 'Jane Smith - (555) 123-4568'
            },
            {
                id: 2,
                firstName: 'Mary',
                lastName: 'Johnson',
                email: 'mary.johnson@email.com',
                phone: '(555) 234-5678',
                address: '456 Oak Ave, City, State 12345',
                dateJoined: '2023-02-20',
                membershipStatus: 'Active',
                birthDate: '1990-03-15',
                maritalStatus: 'Single',
                occupation: 'Nurse',
                emergencyContact: 'Robert Johnson - (555) 234-5679'
            }
        ];

        // Sample events
        this.data.events = [
            {
                id: 1,
                title: 'Sunday Service',
                description: 'Weekly Sunday worship service',
                date: '2024-01-07',
                time: '10:00',
                location: 'Main Sanctuary',
                type: 'Service',
                recurring: true,
                attendees: []
            },
            {
                id: 2,
                title: 'Bible Study',
                description: 'Weekly Bible study and discussion',
                date: '2024-01-10',
                time: '19:00',
                location: 'Fellowship Hall',
                type: 'Study',
                recurring: true,
                attendees: []
            }
        ];

        // Sample donations
        this.data.donations = [
            {
                id: 1,
                memberId: 1,
                memberName: 'John Smith',
                amount: 100.00,
                date: '2024-01-01',
                type: 'Tithe',
                method: 'Cash',
                notes: 'Regular tithe'
            },
            {
                id: 2,
                memberId: 2,
                memberName: 'Mary Johnson',
                amount: 50.00,
                date: '2024-01-01',
                type: 'Offering',
                method: 'Check',
                notes: 'Special offering'
            }
        ];

        this.saveData();
    }

    // Authentication
    checkAuthentication() {
        const savedAuth = localStorage.getItem('accordChurchAuth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            this.isAuthenticated = authData.isAuthenticated;
            this.currentUser = authData.user;
        }

        if (!this.isAuthenticated) {
            this.showLoginModal();
        }
    }

    login(username, password) {
        // Simple authentication (in real app, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            this.isAuthenticated = true;
            this.currentUser = {
                username: 'admin',
                role: 'Administrator',
                name: 'Admin User'
            };
            
            localStorage.setItem('accordChurchAuth', JSON.stringify({
                isAuthenticated: true,
                user: this.currentUser
            }));
            
            this.hideModal();
            this.showNotification('Login successful!', 'success');
            return true;
        }
        return false;
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('accordChurchAuth');
        this.showLoginModal();
        this.showNotification('Logged out successfully', 'info');
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }
    }

    navigateToPage(page) {
        // Hide all page contents
        const pageContents = document.querySelectorAll('.page-content');
        pageContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Show selected page content
        const targetContent = document.getElementById(`${page}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Add active class to selected nav item
        const targetNavItem = document.querySelector(`[data-page="${page}"]`).parentElement;
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(page);
        }

        this.currentPage = page;
        this.loadPageContent(page);

        // Close mobile menu if open
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-open');
    }

    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            members: 'Members',
            events: 'Events',
            donations: 'Donations',
            reports: 'Reports',
            settings: 'Settings'
        };
        return titles[page] || 'Dashboard';
    }

    loadPageContent(page) {
        switch (page) {
            case 'dashboard':
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
                }
                break;
            case 'members':
                if (window.membersManager) {
                    window.membersManager.loadMembers();
                }
                break;
            case 'events':
                if (window.eventsManager) {
                    window.eventsManager.loadEvents();
                }
                break;
            case 'donations':
                if (window.donationsManager) {
                    window.donationsManager.loadDonations();
                }
                break;
            case 'reports':
                if (window.reportsManager) {
                    window.reportsManager.loadReports();
                }
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    initializeCurrentPage() {
        this.loadPageContent(this.currentPage);
    }

    // Event Listeners
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.quick-action-btn') || e.target.closest('.quick-action-btn')) {
                const btn = e.target.matches('.quick-action-btn') ? e.target : e.target.closest('.quick-action-btn');
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            }
        });

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.hideModal();
                }
            });
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'add-member':
                this.navigateToPage('members');
                setTimeout(() => {
                    if (window.membersManager) {
                        window.membersManager.showAddMemberModal();
                    }
                }, 100);
                break;
            case 'add-event':
                this.navigateToPage('events');
                setTimeout(() => {
                    if (window.eventsManager) {
                        window.eventsManager.showAddEventModal();
                    }
                }, 100);
                break;
            case 'record-donation':
                this.navigateToPage('donations');
                setTimeout(() => {
                    if (window.donationsManager) {
                        window.donationsManager.showAddDonationModal();
                    }
                }, 100);
                break;
            case 'generate-report':
                this.navigateToPage('reports');
                break;
        }
    }

    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // Simple global search implementation
        console.log('Searching for:', query);
        // In a real app, this would search across all data
    }

    // Modal Management
    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modalOverlay) modalOverlay.classList.add('active');
    }

    hideModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    showLoginModal() {
        const loginForm = `
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" id="loginUsername" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="loginPassword" required>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                </div>
                <div class="form-group">
                    <small class="text-muted">Default credentials: admin / admin123</small>
                </div>
            </form>
        `;

        this.showModal('Login to Accord Church', loginForm);

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;
                
                if (this.login(username, password)) {
                    // Login successful
                } else {
                    this.showNotification('Invalid credentials', 'error');
                }
            });
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Loading Spinner
    showLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.classList.add('active');
        }
    }

    hideLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.classList.remove('active');
        }
    }

    // Settings
    loadSettings() {
        const settingsContent = document.getElementById('settings-content');
        if (settingsContent) {
            settingsContent.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3>Church Settings</h3>
                    </div>
                    <div class="card-content">
                        <form id="settingsForm">
                            <div class="form-group">
                                <label class="form-label">Church Name</label>
                                <input type="text" class="form-control" value="Accord Church" id="churchName">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" id="churchAddress" rows="3">123 Church Street, City, State 12345</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" value="(555) 123-CHURCH" id="churchPhone">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="info@accordchurch.org" id="churchEmail">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Save Settings</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AccordChurchApp();
});
