// Admin User Management
let currentPage = 1;
let currentRole = '';
let currentSearch = '';
let currentStatus = '';

// Role display names
const roleNames = {
    'admin': 'Admin',
    'president': 'President',
    'vice_president': 'Vice President',
    'treasurer': 'Treasurer',
    'secretary': 'Secretary',
    'competitive_coding_lead': 'Competitive Coding Lead',
    'competitive_coding_colead': 'Competitive Coding Co-Lead',
    'technical_support_lead': 'Technical Support Lead',
    'technical_support_colead': 'Technical Support Co-Lead',
    'event_management_lead': 'Event Management Lead',
    'event_management_colead': 'Event Management Co-Lead',
    'decoration_team_lead': 'Decoration Team Lead',
    'decoration_team_colead': 'Decoration Team Co-Lead',
    'media_team_lead': 'Media Team Lead',
    'media_team_colead': 'Media Team Co-Lead',
    'member': 'Member'
};

// Load users on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(() => {
        currentSearch = searchInput.value;
        currentPage = 1;
        loadUsers();
    }, 500));
    
    // Role filter
    document.getElementById('roleFilter').addEventListener('change', (e) => {
        currentRole = e.target.value;
        currentPage = 1;
        loadUsers();
    });
    
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        currentStatus = e.target.value;
        currentPage = 1;
        loadUsers();
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Modal overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });
    
    // Confirm role change
    document.getElementById('confirmRoleChange').addEventListener('click', handleRoleChange);
}

// Load users from API
async function loadUsers() {
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 10
        });
        
        if (currentRole) params.append('role', currentRole);
        if (currentSearch) params.append('search', currentSearch);
        
        const response = await fetch(`/api/admin/users?${params}`);
        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.data);
            displayPagination(data.currentPage, data.totalPages);
        } else {
            showNotification('Failed to load users', 'error');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users', 'error');
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-users" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-muted);">No users found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Filter by status if needed
    let filteredUsers = users;
    if (currentStatus === 'active') {
        filteredUsers = users.filter(u => u.isActive);
    } else if (currentStatus === 'inactive') {
        filteredUsers = users.filter(u => !u.isActive);
    }
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <img src="${user.profileImage || '/images/default-avatar.png'}" alt="${user.name}" class="user-avatar">
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        ${user.department ? `<p>${user.department}</p>` : ''}
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${user.role}">${roleNames[user.role] || user.role}</span>
            </td>
            <td>
                <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                    ${user.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>${new Date(user.joinedDate || user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="openRoleModal('${user._id}', '${user.name}', '${user.role}')" title="Change Role">
                        <i class="fas fa-user-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser('${user._id}', '${user.name}')" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Display pagination
function displayPagination(current, total) {
    const pagination = document.getElementById('pagination');
    
    if (total <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button ${current === 1 ? 'disabled' : ''} onclick="changePage(${current - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="${i === current ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === current - 2 || i === current + 2) {
            html += `<button disabled>...</button>`;
        }
    }
    
    // Next button
    html += `<button ${current === total ? 'disabled' : ''} onclick="changePage(${current + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadUsers();
}

// Open role change modal
function openRoleModal(userId, userName, currentRole) {
    document.getElementById('userId').value = userId;
    document.getElementById('userName').textContent = userName;
    document.getElementById('newRole').value = currentRole;
    
    document.getElementById('roleModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle role change
async function handleRoleChange() {
    const userId = document.getElementById('userId').value;
    const newRole = document.getElementById('newRole').value;
    
    try {
        const response = await fetch(`/api/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('User role updated successfully', 'success');
            closeAllModals();
            loadUsers();
        } else {
            showNotification(data.message || 'Failed to update role', 'error');
        }
    } catch (error) {
        console.error('Error updating role:', error);
        showNotification('Error updating role', 'error');
    }
}

// Delete user
async function deleteUser(userId, userName) {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('User deleted successfully', 'success');
            loadUsers();
        } else {
            showNotification(data.message || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user', 'error');
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10001;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
                color: #3b82f6;
            }
            
            .notification i {
                font-size: 1.5rem;
            }
            
            .notification span {
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

