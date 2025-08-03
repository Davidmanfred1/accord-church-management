// Members Management
class MembersManager {
    constructor() {
        this.members = [];
        this.filteredMembers = [];
        this.currentFilter = 'all';
        this.currentSort = 'name';
        this.searchQuery = '';
    }

    loadMembers() {
        if (!window.app || !window.app.data) return;
        
        this.members = window.app.data.members || [];
        this.filteredMembers = [...this.members];
        this.renderMembersPage();
        this.applyFilters();
    }

    renderMembersPage() {
        const membersContent = document.getElementById('members-content');
        if (!membersContent) return;

        membersContent.innerHTML = `
            <div class="members-header">
                <div class="members-actions">
                    <button class="btn btn-primary" onclick="window.membersManager.showAddMemberModal()">
                        <i class="fas fa-user-plus"></i> Add Member
                    </button>
                    <button class="btn btn-secondary" onclick="window.membersManager.exportMembers()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
                
                <div class="members-filters">
                    <div class="filter-group">
                        <input type="text" class="form-control" placeholder="Search members..." 
                               id="membersSearch" style="width: 300px;">
                    </div>
                    <div class="filter-group">
                        <select class="form-control" id="membersFilter">
                            <option value="all">All Members</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <select class="form-control" id="membersSort">
                            <option value="name">Sort by Name</option>
                            <option value="date">Sort by Join Date</option>
                            <option value="status">Sort by Status</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="members-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Members:</span>
                    <span class="stat-value" id="totalMembersCount">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Active Members:</span>
                    <span class="stat-value" id="activeMembersCount">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">New This Month:</span>
                    <span class="stat-value" id="newMembersCount">0</span>
                </div>
            </div>

            <div class="members-list" id="membersList">
                <!-- Members will be rendered here -->
            </div>
        `;

        this.setupMembersEventListeners();
        this.updateMembersStats();
    }

    setupMembersEventListeners() {
        const searchInput = document.getElementById('membersSearch');
        const filterSelect = document.getElementById('membersFilter');
        const sortSelect = document.getElementById('membersSort');

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

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.members];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(member => 
                member.firstName.toLowerCase().includes(this.searchQuery) ||
                member.lastName.toLowerCase().includes(this.searchQuery) ||
                member.email.toLowerCase().includes(this.searchQuery) ||
                member.phone.includes(this.searchQuery)
            );
        }

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(member => {
                if (this.currentFilter === 'active') {
                    return member.membershipStatus === 'Active';
                } else if (this.currentFilter === 'inactive') {
                    return member.membershipStatus !== 'Active';
                }
                return true;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                case 'date':
                    return new Date(b.dateJoined) - new Date(a.dateJoined);
                case 'status':
                    return a.membershipStatus.localeCompare(b.membershipStatus);
                default:
                    return 0;
            }
        });

        this.filteredMembers = filtered;
        this.renderMembersList();
    }

    renderMembersList() {
        const membersList = document.getElementById('membersList');
        if (!membersList) return;

        if (this.filteredMembers.length === 0) {
            membersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Members Found</h3>
                    <p>No members match your current filters.</p>
                    <button class="btn btn-primary" onclick="window.membersManager.showAddMemberModal()">
                        <i class="fas fa-user-plus"></i> Add First Member
                    </button>
                </div>
            `;
            return;
        }

        const membersHTML = this.filteredMembers.map(member => `
            <div class="member-card">
                <div class="member-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="member-info">
                    <h4 class="member-name">${member.firstName} ${member.lastName}</h4>
                    <div class="member-details">
                        <span class="member-email"><i class="fas fa-envelope"></i> ${member.email}</span>
                        <span class="member-phone"><i class="fas fa-phone"></i> ${member.phone}</span>
                        <span class="member-joined"><i class="fas fa-calendar"></i> Joined ${new Date(member.dateJoined).toLocaleDateString()}</span>
                    </div>
                    <div class="member-status">
                        <span class="status-badge ${member.membershipStatus.toLowerCase()}">${member.membershipStatus}</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn btn-sm btn-secondary" onclick="window.membersManager.viewMember(${member.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="window.membersManager.editMember(${member.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.membersManager.deleteMember(${member.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        membersList.innerHTML = membersHTML;
    }

    updateMembersStats() {
        const totalCount = document.getElementById('totalMembersCount');
        const activeCount = document.getElementById('activeMembersCount');
        const newCount = document.getElementById('newMembersCount');

        if (totalCount) totalCount.textContent = this.members.length;
        
        if (activeCount) {
            const active = this.members.filter(m => m.membershipStatus === 'Active').length;
            activeCount.textContent = active;
        }

        if (newCount) {
            const thisMonth = new Date();
            const newThisMonth = this.members.filter(member => {
                const joinDate = new Date(member.dateJoined);
                return joinDate.getMonth() === thisMonth.getMonth() && 
                       joinDate.getFullYear() === thisMonth.getFullYear();
            }).length;
            newCount.textContent = newThisMonth;
        }
    }

    showAddMemberModal() {
        const memberForm = this.generateMemberForm();
        window.app.showModal('Add New Member', memberForm);
        this.setupMemberFormHandlers();
    }

    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const memberForm = this.generateMemberForm(member);
        window.app.showModal('Edit Member', memberForm);
        this.setupMemberFormHandlers(member);
    }

    viewMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const memberDetails = `
            <div class="member-profile">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="profile-info">
                        <h3>${member.firstName} ${member.lastName}</h3>
                        <span class="status-badge ${member.membershipStatus.toLowerCase()}">${member.membershipStatus}</span>
                    </div>
                </div>
                
                <div class="profile-details">
                    <div class="detail-group">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> ${member.email}</p>
                        <p><strong>Phone:</strong> ${member.phone}</p>
                        <p><strong>Address:</strong> ${member.address}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Personal Information</h4>
                        <p><strong>Birth Date:</strong> ${new Date(member.birthDate).toLocaleDateString()}</p>
                        <p><strong>Marital Status:</strong> ${member.maritalStatus}</p>
                        <p><strong>Occupation:</strong> ${member.occupation}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Church Information</h4>
                        <p><strong>Date Joined:</strong> ${new Date(member.dateJoined).toLocaleDateString()}</p>
                        <p><strong>Emergency Contact:</strong> ${member.emergencyContact}</p>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="window.membersManager.editMember(${member.id}); window.app.hideModal();">
                        <i class="fas fa-edit"></i> Edit Member
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.hideModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        window.app.showModal('Member Profile', memberDetails);
    }

    deleteMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
            window.app.data.members = window.app.data.members.filter(m => m.id !== memberId);
            window.app.saveData();
            this.loadMembers();
            window.app.showNotification('Member deleted successfully', 'success');
        }
    }

    generateMemberForm(member = null) {
        const isEdit = member !== null;
        
        return `
            <form id="memberForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="firstName" value="${member?.firstName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="lastName" value="${member?.lastName || ''}" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" id="email" value="${member?.email || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Phone *</label>
                    <input type="tel" class="form-control" id="phone" value="${member?.phone || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Address</label>
                    <textarea class="form-control" id="address" rows="2">${member?.address || ''}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Birth Date</label>
                        <input type="date" class="form-control" id="birthDate" value="${member?.birthDate || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Marital Status</label>
                        <select class="form-control" id="maritalStatus">
                            <option value="Single" ${member?.maritalStatus === 'Single' ? 'selected' : ''}>Single</option>
                            <option value="Married" ${member?.maritalStatus === 'Married' ? 'selected' : ''}>Married</option>
                            <option value="Divorced" ${member?.maritalStatus === 'Divorced' ? 'selected' : ''}>Divorced</option>
                            <option value="Widowed" ${member?.maritalStatus === 'Widowed' ? 'selected' : ''}>Widowed</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Occupation</label>
                        <input type="text" class="form-control" id="occupation" value="${member?.occupation || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Membership Status</label>
                        <select class="form-control" id="membershipStatus">
                            <option value="Active" ${member?.membershipStatus === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${member?.membershipStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="Visitor" ${member?.membershipStatus === 'Visitor' ? 'selected' : ''}>Visitor</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Emergency Contact</label>
                    <input type="text" class="form-control" id="emergencyContact" 
                           placeholder="Name - Phone" value="${member?.emergencyContact || ''}">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Member
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.app.hideModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    }

    setupMemberFormHandlers(existingMember = null) {
        const form = document.getElementById('memberForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                birthDate: document.getElementById('birthDate').value,
                maritalStatus: document.getElementById('maritalStatus').value,
                occupation: document.getElementById('occupation').value,
                membershipStatus: document.getElementById('membershipStatus').value,
                emergencyContact: document.getElementById('emergencyContact').value
            };

            if (existingMember) {
                this.updateMember(existingMember.id, formData);
            } else {
                this.addMember(formData);
            }
        });
    }

    addMember(memberData) {
        const newMember = {
            id: Date.now(),
            ...memberData,
            dateJoined: new Date().toISOString().split('T')[0]
        };

        window.app.data.members.push(newMember);
        window.app.saveData();
        this.loadMembers();
        window.app.hideModal();
        window.app.showNotification('Member added successfully', 'success');
    }

    updateMember(memberId, memberData) {
        const memberIndex = window.app.data.members.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
            window.app.data.members[memberIndex] = {
                ...window.app.data.members[memberIndex],
                ...memberData
            };
            window.app.saveData();
            this.loadMembers();
            window.app.hideModal();
            window.app.showNotification('Member updated successfully', 'success');
        }
    }

    exportMembers() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accord-church-members-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.app.showNotification('Members exported successfully', 'success');
    }

    generateCSV() {
        const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Birth Date', 'Marital Status', 'Occupation', 'Membership Status', 'Date Joined', 'Emergency Contact'];
        const rows = this.members.map(member => [
            member.firstName,
            member.lastName,
            member.email,
            member.phone,
            member.address,
            member.birthDate,
            member.maritalStatus,
            member.occupation,
            member.membershipStatus,
            member.dateJoined,
            member.emergencyContact
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field || ''}"`).join(',')
        ).join('\n');
    }
}

// Initialize members manager
document.addEventListener('DOMContentLoaded', () => {
    window.membersManager = new MembersManager();
});
