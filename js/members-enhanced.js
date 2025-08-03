// Enhanced Members Management System
class EnhancedMembersManager {
    constructor() {
        this.members = [];
        this.filteredMembers = [];
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filters = {
            search: '',
            status: 'all',
            ageGroup: 'all',
            ministry: 'all'
        };
        this.editingMember = null;
        
        this.init();
    }

    init() {
        this.loadMembers();
        this.setupEventListeners();
        this.renderPage();
    }

    loadMembers() {
        const savedData = localStorage.getItem('accordChurchData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.members = data.members || [];
        } else {
            this.members = this.generateSampleMembers();
            this.saveMembers();
        }
        this.filteredMembers = [...this.members];
    }

    saveMembers() {
        const savedData = localStorage.getItem('accordChurchData');
        const data = savedData ? JSON.parse(savedData) : {};
        data.members = this.members;
        localStorage.setItem('accordChurchData', JSON.stringify(data));
    }

    generateSampleMembers() {
        return [
            {
                id: 1,
                title: 'Mr.',
                firstName: 'John',
                middleName: 'David',
                lastName: 'Smith',
                suffix: '',
                email: 'john.smith@email.com',
                phone: '(555) 123-4567',
                mobilePhone: '(555) 123-4568',
                workPhone: '(555) 123-4569',
                address: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701',
                country: 'United States',
                birthDate: '1985-06-20',
                gender: 'Male',
                maritalStatus: 'Married',
                anniversaryDate: '2010-08-15',
                membershipStatus: 'Active',
                dateJoined: '2023-01-15',
                baptismDate: '2023-02-01',
                confirmationDate: '2023-03-01',
                ministries: ['worship', 'administration'],
                skillsTalents: 'Guitar, Leadership, Public Speaking',
                familyName: 'The Smith Family',
                relationshipStatus: 'Head of Household',
                emergencyContact: 'Jane Smith - (555) 123-4570',
                occupation: 'Teacher',
                employer: 'Springfield Elementary',
                specialNeeds: '',
                memberNotes: 'Active in worship ministry',
                photo: null
            },
            {
                id: 2,
                title: 'Mrs.',
                firstName: 'Mary',
                middleName: 'Elizabeth',
                lastName: 'Johnson',
                suffix: '',
                email: 'mary.johnson@email.com',
                phone: '(555) 234-5678',
                mobilePhone: '(555) 234-5679',
                workPhone: '',
                address: '456 Oak Ave',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62702',
                country: 'United States',
                birthDate: '1990-03-15',
                gender: 'Female',
                maritalStatus: 'Single',
                anniversaryDate: '',
                membershipStatus: 'Active',
                dateJoined: '2023-02-20',
                baptismDate: '2023-03-15',
                confirmationDate: '',
                ministries: ['youth', 'children'],
                skillsTalents: 'Teaching, Childcare, Organization',
                familyName: '',
                relationshipStatus: '',
                emergencyContact: 'Robert Johnson - (555) 234-5680',
                occupation: 'Nurse',
                employer: 'Springfield Hospital',
                specialNeeds: '',
                memberNotes: 'Great with children',
                photo: null
            },
            {
                id: 3,
                title: 'Dr.',
                firstName: 'David',
                middleName: 'Michael',
                lastName: 'Wilson',
                suffix: '',
                email: 'david.wilson@email.com',
                phone: '(555) 345-6789',
                mobilePhone: '(555) 345-6790',
                workPhone: '(555) 345-6791',
                address: '789 Pine St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62703',
                country: 'United States',
                birthDate: '1978-11-08',
                gender: 'Male',
                maritalStatus: 'Married',
                anniversaryDate: '2005-06-12',
                membershipStatus: 'Active',
                dateJoined: '2023-03-10',
                baptismDate: '2023-04-01',
                confirmationDate: '2023-05-01',
                ministries: ['outreach', 'administration'],
                skillsTalents: 'Medical expertise, Leadership, Community outreach',
                familyName: 'The Wilson Family',
                relationshipStatus: 'Head of Household',
                emergencyContact: 'Sarah Wilson - (555) 345-6792',
                occupation: 'Doctor',
                employer: 'Springfield Medical Center',
                specialNeeds: '',
                memberNotes: 'Leads medical mission trips',
                photo: null
            },
            {
                id: 4,
                title: 'Ms.',
                firstName: 'Sarah',
                middleName: 'Anne',
                lastName: 'Brown',
                suffix: '',
                email: 'sarah.brown@email.com',
                phone: '(555) 456-7890',
                mobilePhone: '(555) 456-7891',
                workPhone: '',
                address: '321 Elm St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62704',
                country: 'United States',
                birthDate: '1992-07-22',
                gender: 'Female',
                maritalStatus: 'Single',
                anniversaryDate: '',
                membershipStatus: 'Active',
                dateJoined: '2023-04-05',
                baptismDate: '2023-05-15',
                confirmationDate: '',
                ministries: ['children', 'hospitality'],
                skillsTalents: 'Accounting, Event planning, Children\'s activities',
                familyName: '',
                relationshipStatus: '',
                emergencyContact: 'Michael Brown - (555) 456-7892',
                occupation: 'Accountant',
                employer: 'Brown & Associates',
                specialNeeds: '',
                memberNotes: 'Excellent with event coordination',
                photo: null
            },
            {
                id: 5,
                title: 'Mr.',
                firstName: 'Michael',
                middleName: 'James',
                lastName: 'Davis',
                suffix: 'Jr.',
                email: 'michael.davis@email.com',
                phone: '(555) 567-8901',
                mobilePhone: '(555) 567-8902',
                workPhone: '(555) 567-8903',
                address: '654 Maple Ave',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62705',
                country: 'United States',
                birthDate: '1980-12-03',
                gender: 'Male',
                maritalStatus: 'Married',
                anniversaryDate: '2008-09-20',
                membershipStatus: 'Active',
                dateJoined: '2023-05-12',
                baptismDate: '2023-06-01',
                confirmationDate: '2023-07-01',
                ministries: ['worship', 'youth'],
                skillsTalents: 'Music, Youth mentoring, Business management',
                familyName: 'The Davis Family',
                relationshipStatus: 'Head of Household',
                emergencyContact: 'Lisa Davis - (555) 567-8904',
                occupation: 'Business Manager',
                employer: 'Davis Enterprises',
                specialNeeds: '',
                memberNotes: 'Plays piano and leads youth worship',
                photo: null
            }
        ];
    }

    setupEventListeners() {
        // Search and filters
        document.getElementById('memberSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('ageGroupFilter').addEventListener('change', (e) => {
            this.filters.ageGroup = e.target.value;
            this.applyFilters();
        });

        document.getElementById('ministryFilter').addEventListener('change', (e) => {
            this.filters.ministry = e.target.value;
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
        document.getElementById('addMemberBtn').addEventListener('click', () => {
            this.showMemberForm();
        });

        document.getElementById('exportMembersBtn').addEventListener('click', () => {
            this.exportMembers();
        });

        // Modal controls
        document.getElementById('closeMemberModal').addEventListener('click', () => {
            this.closeMemberModal();
        });

        document.getElementById('closeMemberFormModal').addEventListener('click', () => {
            this.closeMemberFormModal();
        });

        document.getElementById('cancelMemberForm').addEventListener('click', () => {
            this.closeMemberFormModal();
        });

        // Form submission
        document.getElementById('memberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMember();
        });

        // Photo upload
        document.getElementById('memberPhoto').addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderMembers();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredMembers.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderMembers();
            }
        });
    }

    renderPage() {
        this.updateStatistics();
        this.applyFilters();
    }

    updateStatistics() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.membershipStatus === 'Active').length;
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        const newMembers = this.members.filter(m => {
            const joinDate = new Date(m.dateJoined);
            return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
        }).length;
        
        // Calculate families (simplified - count unique family names)
        const families = new Set(this.members.filter(m => m.familyName).map(m => m.familyName)).size;

        document.getElementById('totalMembersCount').textContent = totalMembers;
        document.getElementById('activeMembersCount').textContent = activeMembers;
        document.getElementById('newMembersCount').textContent = newMembers;
        document.getElementById('familiesCount').textContent = families;
    }

    applyFilters() {
        let filtered = [...this.members];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(member => 
                member.firstName.toLowerCase().includes(this.filters.search) ||
                member.lastName.toLowerCase().includes(this.filters.search) ||
                member.email.toLowerCase().includes(this.filters.search) ||
                member.phone.includes(this.filters.search)
            );
        }

        // Status filter
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(member => 
                member.membershipStatus.toLowerCase() === this.filters.status
            );
        }

        // Age group filter
        if (this.filters.ageGroup !== 'all') {
            filtered = filtered.filter(member => {
                if (!member.birthDate) return false;
                const age = this.calculateAge(member.birthDate);
                switch (this.filters.ageGroup) {
                    case 'children': return age <= 12;
                    case 'youth': return age >= 13 && age <= 17;
                    case 'young-adult': return age >= 18 && age <= 30;
                    case 'adult': return age >= 31 && age <= 64;
                    case 'senior': return age >= 65;
                    default: return true;
                }
            });
        }

        // Ministry filter
        if (this.filters.ministry !== 'all') {
            filtered = filtered.filter(member => 
                member.ministries && member.ministries.includes(this.filters.ministry)
            );
        }

        this.filteredMembers = filtered;
        this.currentPage = 1;
        this.renderMembers();
    }

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

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide view containers
        document.getElementById('membersGrid').style.display = view === 'grid' ? 'grid' : 'none';
        document.getElementById('membersList').style.display = view === 'list' ? 'block' : 'none';
        document.getElementById('membersTable').style.display = view === 'table' ? 'block' : 'none';
        
        this.renderMembers();
    }

    renderMembers() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMembers = this.filteredMembers.slice(startIndex, endIndex);

        switch (this.currentView) {
            case 'grid':
                this.renderGridView(pageMembers);
                break;
            case 'list':
                this.renderListView(pageMembers);
                break;
            case 'table':
                this.renderTableView(pageMembers);
                break;
        }

        this.updatePagination();
    }

    renderGridView(members) {
        const container = document.getElementById('membersGrid');
        
        if (members.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Members Found</h3>
                    <p>No members match your current filters.</p>
                    <button class="btn btn-primary" onclick="membersManager.showMemberForm()">
                        <i class="fas fa-user-plus"></i> Add First Member
                    </button>
                </div>
            `;
            return;
        }

        const membersHTML = members.map(member => `
            <div class="member-card">
                <div class="member-card-header">
                    <div class="member-photo">
                        ${member.photo ? 
                            `<img src="${member.photo}" alt="${member.firstName} ${member.lastName}">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="member-status-badge ${member.membershipStatus.toLowerCase()}">
                        ${member.membershipStatus}
                    </div>
                </div>
                <div class="member-card-body">
                    <h3 class="member-name">
                        ${member.title ? member.title + ' ' : ''}${member.firstName} ${member.lastName}
                    </h3>
                    <div class="member-details">
                        <div class="member-detail">
                            <i class="fas fa-envelope"></i>
                            <span>${member.email}</span>
                        </div>
                        <div class="member-detail">
                            <i class="fas fa-phone"></i>
                            <span>${member.phone}</span>
                        </div>
                        ${member.birthDate ? `
                            <div class="member-detail">
                                <i class="fas fa-birthday-cake"></i>
                                <span>Age ${this.calculateAge(member.birthDate)}</span>
                            </div>
                        ` : ''}
                        <div class="member-detail">
                            <i class="fas fa-calendar"></i>
                            <span>Joined ${new Date(member.dateJoined).toLocaleDateString()}</span>
                        </div>
                    </div>
                    ${member.ministries && member.ministries.length > 0 ? `
                        <div class="member-ministries">
                            ${member.ministries.map(ministry => `
                                <span class="ministry-tag">${this.formatMinistry(ministry)}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="member-actions">
                        <button class="btn btn-sm btn-secondary" onclick="membersManager.viewMember(${member.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="membersManager.editMember(${member.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="membersManager.deleteMember(${member.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = membersHTML;
    }

    renderListView(members) {
        const container = document.getElementById('membersList');
        
        if (members.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Members Found</h3>
                    <p>No members match your current filters.</p>
                </div>
            `;
            return;
        }

        const membersHTML = members.map(member => `
            <div class="member-list-item">
                <div class="member-list-photo">
                    ${member.photo ? 
                        `<img src="${member.photo}" alt="${member.firstName} ${member.lastName}">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div class="member-list-info">
                    <h4 class="member-list-name">
                        ${member.title ? member.title + ' ' : ''}${member.firstName} ${member.lastName}
                    </h4>
                    <div class="member-list-details">
                        <span><i class="fas fa-envelope"></i> ${member.email}</span>
                        <span><i class="fas fa-phone"></i> ${member.phone}</span>
                        <span><i class="fas fa-tag"></i> ${member.membershipStatus}</span>
                        ${member.birthDate ? `<span><i class="fas fa-birthday-cake"></i> Age ${this.calculateAge(member.birthDate)}</span>` : ''}
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn btn-sm btn-secondary" onclick="membersManager.viewMember(${member.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="membersManager.editMember(${member.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="membersManager.deleteMember(${member.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = membersHTML;
    }

    renderTableView(members) {
        const tbody = document.getElementById('membersTableBody');
        
        if (members.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>No Members Found</h3>
                            <p>No members match your current filters.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const membersHTML = members.map(member => `
            <tr>
                <td>
                    <div class="table-photo">
                        ${member.photo ? 
                            `<img src="${member.photo}" alt="${member.firstName} ${member.lastName}">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                </td>
                <td>
                    <strong>${member.title ? member.title + ' ' : ''}${member.firstName} ${member.lastName}</strong>
                </td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>
                    <span class="status-badge ${member.membershipStatus.toLowerCase()}">
                        ${member.membershipStatus}
                    </span>
                </td>
                <td>${new Date(member.dateJoined).toLocaleDateString()}</td>
                <td>
                    ${member.ministries && member.ministries.length > 0 ? 
                        member.ministries.map(m => this.formatMinistry(m)).join(', ') : 
                        'None'
                    }
                </td>
                <td>
                    <div class="member-actions">
                        <button class="btn btn-sm btn-secondary" onclick="membersManager.viewMember(${member.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="membersManager.editMember(${member.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="membersManager.deleteMember(${member.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = membersHTML;
    }

    updatePagination() {
        const totalItems = this.filteredMembers.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        // Update pagination info
        document.getElementById('paginationInfo').textContent = 
            `Showing ${startItem}-${endItem} of ${totalItems} members`;

        // Update pagination controls
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;

        // Update page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        let pagesHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagesHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="membersManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagesHTML += '<span class="page-ellipsis">...</span>';
            }
        }
        
        pageNumbers.innerHTML = pagesHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderMembers();
    }

    formatMinistry(ministry) {
        const ministryNames = {
            worship: 'Worship',
            youth: 'Youth',
            children: 'Children',
            outreach: 'Outreach',
            administration: 'Admin',
            hospitality: 'Hospitality'
        };
        return ministryNames[ministry] || ministry;
    }

    showMemberForm(member = null) {
        this.editingMember = member;
        const modal = document.getElementById('memberFormModal');
        const title = document.getElementById('memberFormTitle');
        
        title.textContent = member ? 'Edit Member' : 'Add New Member';
        
        if (member) {
            this.populateForm(member);
        } else {
            this.clearForm();
        }
        
        modal.classList.add('active');
    }

    populateForm(member) {
        // Populate all form fields with member data
        Object.keys(member).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = member[key];
                } else {
                    field.value = member[key] || '';
                }
            }
        });

        // Handle ministries checkboxes
        if (member.ministries) {
            document.querySelectorAll('input[name="ministries"]').forEach(checkbox => {
                checkbox.checked = member.ministries.includes(checkbox.value);
            });
        }

        // Handle photo preview
        if (member.photo) {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${member.photo}" alt="Member Photo">`;
        }
    }

    clearForm() {
        document.getElementById('memberForm').reset();
        document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user-circle"></i>';
        document.querySelectorAll('input[name="ministries"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('photoPreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Member Photo">`;
            };
            reader.readAsDataURL(file);
        }
    }

    saveMember() {
        const formData = new FormData(document.getElementById('memberForm'));
        const memberData = {};

        // Get all form fields
        for (let [key, value] of formData.entries()) {
            if (key === 'ministries') {
                if (!memberData.ministries) memberData.ministries = [];
                memberData.ministries.push(value);
            } else {
                memberData[key] = value;
            }
        }

        // Get additional fields not in FormData
        const additionalFields = [
            'memberTitle', 'firstName', 'middleName', 'lastName', 'memberSuffix',
            'birthDate', 'gender', 'maritalStatus', 'anniversaryDate', 'email',
            'phone', 'mobilePhone', 'workPhone', 'address', 'city', 'state',
            'zipCode', 'country', 'membershipStatus', 'dateJoined', 'baptismDate',
            'confirmationDate', 'skillsTalents', 'familyName', 'relationshipStatus',
            'emergencyContact', 'occupation', 'employer', 'specialNeeds', 'memberNotes'
        ];

        additionalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                memberData[field.replace('member', '').toLowerCase()] = element.value;
            }
        });

        // Handle photo
        const photoPreview = document.getElementById('photoPreview').querySelector('img');
        if (photoPreview) {
            memberData.photo = photoPreview.src;
        }

        // Handle ministries
        const ministryCheckboxes = document.querySelectorAll('input[name="ministries"]:checked');
        memberData.ministries = Array.from(ministryCheckboxes).map(cb => cb.value);

        if (this.editingMember) {
            // Update existing member
            const index = this.members.findIndex(m => m.id === this.editingMember.id);
            if (index !== -1) {
                this.members[index] = { ...this.editingMember, ...memberData };
            }
        } else {
            // Add new member
            memberData.id = Date.now();
            memberData.dateJoined = memberData.dateJoined || new Date().toISOString().split('T')[0];
            this.members.push(memberData);
        }

        this.saveMembers();
        this.closeMemberFormModal();
        this.renderPage();
        
        const message = this.editingMember ? 'Member updated successfully' : 'Member added successfully';
        this.showNotification(message, 'success');
    }

    viewMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const modalBody = document.getElementById('memberModalBody');
        modalBody.innerHTML = this.generateMemberProfile(member);
        
        document.getElementById('memberModal').classList.add('active');
    }

    generateMemberProfile(member) {
        return `
            <div class="member-profile">
                <div class="profile-header">
                    <div class="profile-photo">
                        ${member.photo ? 
                            `<img src="${member.photo}" alt="${member.firstName} ${member.lastName}">` :
                            `<i class="fas fa-user-circle"></i>`
                        }
                    </div>
                    <div class="profile-info">
                        <h2>${member.title ? member.title + ' ' : ''}${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}${member.suffix ? ' ' + member.suffix : ''}</h2>
                        <span class="status-badge ${member.membershipStatus.toLowerCase()}">${member.membershipStatus}</span>
                        ${member.familyName ? `<p class="family-name"><i class="fas fa-home"></i> ${member.familyName}</p>` : ''}
                    </div>
                </div>
                
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3><i class="fas fa-address-book"></i> Contact Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a>
                            </div>
                            <div class="info-item">
                                <strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a>
                            </div>
                            ${member.mobilePhone ? `<div class="info-item"><strong>Mobile:</strong> <a href="tel:${member.mobilePhone}">${member.mobilePhone}</a></div>` : ''}
                            ${member.workPhone ? `<div class="info-item"><strong>Work:</strong> <a href="tel:${member.workPhone}">${member.workPhone}</a></div>` : ''}
                            <div class="info-item">
                                <strong>Address:</strong> ${member.address}${member.city ? ', ' + member.city : ''}${member.state ? ', ' + member.state : ''}${member.zipCode ? ' ' + member.zipCode : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3><i class="fas fa-user"></i> Personal Information</h3>
                        <div class="info-grid">
                            ${member.birthDate ? `<div class="info-item"><strong>Birth Date:</strong> ${new Date(member.birthDate).toLocaleDateString()} (Age ${this.calculateAge(member.birthDate)})</div>` : ''}
                            ${member.gender ? `<div class="info-item"><strong>Gender:</strong> ${member.gender}</div>` : ''}
                            ${member.maritalStatus ? `<div class="info-item"><strong>Marital Status:</strong> ${member.maritalStatus}</div>` : ''}
                            ${member.anniversaryDate ? `<div class="info-item"><strong>Anniversary:</strong> ${new Date(member.anniversaryDate).toLocaleDateString()}</div>` : ''}
                            ${member.occupation ? `<div class="info-item"><strong>Occupation:</strong> ${member.occupation}</div>` : ''}
                            ${member.employer ? `<div class="info-item"><strong>Employer:</strong> ${member.employer}</div>` : ''}
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3><i class="fas fa-church"></i> Church Information</h3>
                        <div class="info-grid">
                            <div class="info-item"><strong>Date Joined:</strong> ${new Date(member.dateJoined).toLocaleDateString()}</div>
                            ${member.baptismDate ? `<div class="info-item"><strong>Baptism Date:</strong> ${new Date(member.baptismDate).toLocaleDateString()}</div>` : ''}
                            ${member.confirmationDate ? `<div class="info-item"><strong>Confirmation Date:</strong> ${new Date(member.confirmationDate).toLocaleDateString()}</div>` : ''}
                            ${member.ministries && member.ministries.length > 0 ? `
                                <div class="info-item">
                                    <strong>Ministry Involvement:</strong>
                                    <div class="ministry-tags">
                                        ${member.ministries.map(ministry => `<span class="ministry-tag">${this.formatMinistry(ministry)}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${member.skillsTalents ? `<div class="info-item"><strong>Skills & Talents:</strong> ${member.skillsTalents}</div>` : ''}
                        </div>
                    </div>
                    
                    ${member.emergencyContact || member.specialNeeds || member.memberNotes ? `
                        <div class="profile-section">
                            <h3><i class="fas fa-info-circle"></i> Additional Information</h3>
                            <div class="info-grid">
                                ${member.emergencyContact ? `<div class="info-item"><strong>Emergency Contact:</strong> ${member.emergencyContact}</div>` : ''}
                                ${member.specialNeeds ? `<div class="info-item"><strong>Special Needs:</strong> ${member.specialNeeds}</div>` : ''}
                                ${member.memberNotes ? `<div class="info-item"><strong>Notes:</strong> ${member.memberNotes}</div>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="membersManager.editMember(${member.id}); membersManager.closeMemberModal();">
                        <i class="fas fa-edit"></i> Edit Member
                    </button>
                    <button class="btn btn-secondary" onclick="membersManager.closeMemberModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
    }

    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            this.showMemberForm(member);
        }
    }

    deleteMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
            this.members = this.members.filter(m => m.id !== memberId);
            this.saveMembers();
            this.renderPage();
            this.showNotification('Member deleted successfully', 'success');
        }
    }

    closeMemberModal() {
        document.getElementById('memberModal').classList.remove('active');
    }

    closeMemberFormModal() {
        document.getElementById('memberFormModal').classList.remove('active');
        this.editingMember = null;
    }

    exportMembers() {
        const csvData = this.generateCSV();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-members-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Members exported successfully', 'success');
    }

    generateCSV() {
        const headers = [
            'Title', 'First Name', 'Middle Name', 'Last Name', 'Suffix',
            'Email', 'Phone', 'Mobile Phone', 'Work Phone',
            'Address', 'City', 'State', 'ZIP Code', 'Country',
            'Birth Date', 'Gender', 'Marital Status', 'Anniversary Date',
            'Membership Status', 'Date Joined', 'Baptism Date', 'Confirmation Date',
            'Ministries', 'Skills & Talents', 'Family Name', 'Relationship Status',
            'Emergency Contact', 'Occupation', 'Employer', 'Special Needs', 'Notes'
        ];

        const rows = this.members.map(member => [
            member.title || '',
            member.firstName || '',
            member.middleName || '',
            member.lastName || '',
            member.suffix || '',
            member.email || '',
            member.phone || '',
            member.mobilePhone || '',
            member.workPhone || '',
            member.address || '',
            member.city || '',
            member.state || '',
            member.zipCode || '',
            member.country || '',
            member.birthDate || '',
            member.gender || '',
            member.maritalStatus || '',
            member.anniversaryDate || '',
            member.membershipStatus || '',
            member.dateJoined || '',
            member.baptismDate || '',
            member.confirmationDate || '',
            (member.ministries || []).join('; '),
            member.skillsTalents || '',
            member.familyName || '',
            member.relationshipStatus || '',
            member.emergencyContact || '',
            member.occupation || '',
            member.employer || '',
            member.specialNeeds || '',
            member.memberNotes || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
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

// Initialize the enhanced members manager
const membersManager = new EnhancedMembersManager();
