// Enhanced Settings Management System
class EnhancedSettingsManager {
    constructor() {
        this.settings = {};
        this.defaultSettings = this.getDefaultSettings();
        this.currentSection = 'general';
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.populateForm();
        this.updateSystemInfo();
    }

    getDefaultSettings() {
        return {
            // General Settings
            churchName: 'Accord Church',
            denomination: '',
            churchAddress: '',
            churchCity: '',
            churchState: '',
            churchZip: '',
            churchPhone: '',
            churchEmail: '',
            churchWebsite: '',
            timeZone: 'America/New_York',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD',
            language: 'en',

            // Member Settings
            requireApproval: false,
            autoGenerateId: true,
            memberIdFormat: 'sequential',
            requireEmail: false,
            requirePhone: false,
            requireAddress: false,
            requireBirthDate: false,
            requireGender: false,
            requireMaritalStatus: false,
            allowPhotoSharing: true,
            allowContactSharing: true,
            showBirthdayAnniversary: true,

            // Event Settings
            defaultEventDuration: 60,
            defaultVenue: 'main-sanctuary',
            requireEventApproval: false,
            enableEventRegistration: true,
            sendEventReminders: true,
            defaultCalendarView: 'month',
            weekStartDay: 0,
            showPastEvents: false,

            // Donation Settings
            monthlyGoal: 10000,
            annualGoal: 120000,
            buildingFundGoal: 50000,
            autoSendReceipts: true,
            receiptTemplate: 'standard',
            taxStatementPeriod: 'calendar',
            enableCash: true,
            enableCheck: true,
            enableCreditCard: false,
            enableBankTransfer: false,
            enableOnlinePayment: false,
            enableMobileApp: false,

            // Communication Settings
            smtpServer: '',
            smtpPort: 587,
            emailUsername: '',
            emailPassword: '',
            fromName: 'Accord Church',
            emailNewMembers: true,
            emailNewDonations: true,
            emailEventReminders: true,
            emailBirthdayReminders: false,

            // Security Settings
            minPasswordLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
            sessionTimeout: 60,
            enableTwoFactor: false,
            logUserActivity: true,

            // Advanced Settings
            enableDebugMode: false,
            enableApiAccess: false,
            apiRateLimit: 100,
            customCSS: '',
            enableAutoBackup: true,
            backupFrequency: 'weekly',
            backupRetention: 30
        };
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('accordChurchSettings');
        if (savedSettings) {
            this.settings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
        } else {
            this.settings = { ...this.defaultSettings };
        }
    }

    saveSettings() {
        localStorage.setItem('accordChurchSettings', JSON.stringify(this.settings));
        this.showNotification('Settings saved successfully', 'success');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.settings-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Header actions
        document.getElementById('saveAllBtn').addEventListener('click', () => {
            this.saveAllSettings();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetToDefaults();
        });

        document.getElementById('exportSettingsBtn').addEventListener('click', () => {
            this.exportSettings();
        });

        // Form inputs
        this.setupFormInputListeners();

        // Special action buttons
        this.setupActionButtons();
    }

    setupFormInputListeners() {
        // Text inputs, selects, and checkboxes
        document.querySelectorAll('input, select, textarea').forEach(input => {
            const settingKey = input.id;
            if (settingKey && this.settings.hasOwnProperty(settingKey)) {
                if (input.type === 'checkbox') {
                    input.addEventListener('change', (e) => {
                        this.settings[settingKey] = e.target.checked;
                        this.markAsChanged(input);
                    });
                } else {
                    input.addEventListener('input', (e) => {
                        let value = e.target.value;
                        if (input.type === 'number') {
                            value = parseFloat(value) || 0;
                        }
                        this.settings[settingKey] = value;
                        this.markAsChanged(input);
                    });
                }
            }
        });
    }

    setupActionButtons() {
        // Test email button
        document.getElementById('testEmailBtn').addEventListener('click', () => {
            this.testEmailConfiguration();
        });

        // Backup buttons
        document.getElementById('createBackupBtn').addEventListener('click', () => {
            this.createBackup();
        });

        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importDataBtn').addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Integration buttons
        document.querySelectorAll('.integration-item button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const integration = e.target.closest('.integration-item').querySelector('h4').textContent;
                this.connectIntegration(integration);
            });
        });
    }

    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.settings-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).closest('.settings-item').classList.add('active');

        // Update content
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;
    }

    populateForm() {
        Object.keys(this.settings).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = this.settings[key];
                } else {
                    input.value = this.settings[key];
                }
            }
        });
    }

    markAsChanged(input) {
        input.classList.add('changed');
        // Add visual indicator that settings have changed
        const saveBtn = document.getElementById('saveAllBtn');
        saveBtn.classList.add('highlight');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes *';
    }

    saveAllSettings() {
        // Collect all form data
        document.querySelectorAll('input, select, textarea').forEach(input => {
            const settingKey = input.id;
            if (settingKey && this.settings.hasOwnProperty(settingKey)) {
                if (input.type === 'checkbox') {
                    this.settings[settingKey] = input.checked;
                } else {
                    let value = input.value;
                    if (input.type === 'number') {
                        value = parseFloat(value) || 0;
                    }
                    this.settings[settingKey] = value;
                }
            }
        });

        this.saveSettings();
        
        // Remove change indicators
        document.querySelectorAll('.changed').forEach(input => {
            input.classList.remove('changed');
        });
        
        const saveBtn = document.getElementById('saveAllBtn');
        saveBtn.classList.remove('highlight');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save All Changes';
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
            this.settings = { ...this.defaultSettings };
            this.populateForm();
            this.saveSettings();
            this.showNotification('Settings reset to defaults', 'success');
        }
    }

    exportSettings() {
        const settingsData = {
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Settings exported successfully', 'success');
    }

    testEmailConfiguration() {
        const testBtn = document.getElementById('testEmailBtn');
        const originalText = testBtn.innerHTML;
        
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        testBtn.disabled = true;

        // Simulate email test
        setTimeout(() => {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
            
            // Simulate success/failure
            const success = Math.random() > 0.3; // 70% success rate for demo
            if (success) {
                this.showNotification('Test email sent successfully', 'success');
            } else {
                this.showNotification('Failed to send test email. Please check your configuration.', 'error');
            }
        }, 2000);
    }

    createBackup() {
        const backupBtn = document.getElementById('createBackupBtn');
        const originalText = backupBtn.innerHTML;
        
        backupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        backupBtn.disabled = true;

        // Get all data
        const allData = {
            settings: this.settings,
            churchData: JSON.parse(localStorage.getItem('accordChurchData') || '{}'),
            backupDate: new Date().toISOString(),
            version: '1.0.0'
        };

        setTimeout(() => {
            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accord-church-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            backupBtn.innerHTML = originalText;
            backupBtn.disabled = false;
            this.showNotification('Backup created successfully', 'success');
        }, 1500);
    }

    exportData() {
        const churchData = JSON.parse(localStorage.getItem('accordChurchData') || '{}');
        const exportData = {
            ...churchData,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully', 'success');
    }

    importData() {
        const fileInput = document.getElementById('importDataFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showNotification('Please select a file to import', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (confirm('Are you sure you want to import this data? This will overwrite existing data.')) {
                    // Validate data structure
                    if (this.validateImportData(importData)) {
                        localStorage.setItem('accordChurchData', JSON.stringify(importData));
                        this.showNotification('Data imported successfully', 'success');
                        
                        // Refresh page to reflect changes
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        this.showNotification('Invalid data format', 'error');
                    }
                }
            } catch (error) {
                this.showNotification('Error reading file: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }

    validateImportData(data) {
        // Basic validation - check if it has expected structure
        const expectedKeys = ['members', 'events', 'donations'];
        return expectedKeys.some(key => data.hasOwnProperty(key));
    }

    clearAllData() {
        const confirmation = prompt('This will permanently delete ALL data. Type "DELETE ALL DATA" to confirm:');
        
        if (confirmation === 'DELETE ALL DATA') {
            localStorage.removeItem('accordChurchData');
            localStorage.removeItem('accordChurchSettings');
            
            this.showNotification('All data has been cleared', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            this.showNotification('Data clearing cancelled', 'info');
        }
    }

    connectIntegration(integrationName) {
        this.showNotification(`${integrationName} integration would be configured here`, 'info');
    }

    updateSystemInfo() {
        // Update system information
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
        
        // Calculate database size (approximate)
        const allData = localStorage.getItem('accordChurchData') || '{}';
        const sizeInBytes = new Blob([allData]).size;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        document.getElementById('databaseSize').textContent = `${sizeInMB} MB`;
        
        // Count total records
        try {
            const data = JSON.parse(allData);
            const totalRecords = (data.members?.length || 0) + 
                               (data.events?.length || 0) + 
                               (data.donations?.length || 0);
            document.getElementById('totalRecords').textContent = totalRecords;
        } catch (e) {
            document.getElementById('totalRecords').textContent = '0';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Utility methods for other parts of the application
    getSetting(key) {
        return this.settings[key];
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    getChurchInfo() {
        return {
            name: this.settings.churchName,
            address: `${this.settings.churchAddress}, ${this.settings.churchCity}, ${this.settings.churchState} ${this.settings.churchZip}`,
            phone: this.settings.churchPhone,
            email: this.settings.churchEmail,
            website: this.settings.churchWebsite
        };
    }

    formatCurrency(amount) {
        const currency = this.settings.currency || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date) {
        const format = this.settings.dateFormat || 'MM/DD/YYYY';
        const dateObj = new Date(date);
        
        switch (format) {
            case 'DD/MM/YYYY':
                return dateObj.toLocaleDateString('en-GB');
            case 'YYYY-MM-DD':
                return dateObj.toISOString().split('T')[0];
            default:
                return dateObj.toLocaleDateString('en-US');
        }
    }
}

// Initialize the settings manager
const settingsManager = new EnhancedSettingsManager();

// Make it globally available
window.settingsManager = settingsManager;
