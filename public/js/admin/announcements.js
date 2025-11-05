// Admin Announcement Management
let currentFilter = 'all';

// Load announcements on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create announcement button
    document.getElementById('createAnnouncementBtn').addEventListener('click', () => {
        openAnnouncementModal();
    });
    
    // Filter tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadAnnouncements();
        });
    });
    
    // Announcement form submit
    document.getElementById('announcementForm').addEventListener('submit', handleSubmit);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Modal overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });
}

// Load announcements from API
async function loadAnnouncements() {
    try {
        let url = '/api/announcements';
        
        if (currentFilter === 'active') {
            url += '?active=true';
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            let announcements = data.data;
            
            // Filter inactive if needed
            if (currentFilter === 'inactive') {
                announcements = announcements.filter(a => !a.isActive);
            }
            
            displayAnnouncements(announcements);
        } else {
            showNotification('Failed to load announcements', 'error');
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        showNotification('Error loading announcements', 'error');
    }
}

// Display announcements
function displayAnnouncements(announcements) {
    const list = document.getElementById('announcementsList');
    
    if (!announcements || announcements.length === 0) {
        list.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-bullhorn"></i>
                <h3>No announcements found</h3>
                <p>Create your first announcement to get started!</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = announcements.map(announcement => {
        const isExpired = announcement.expiresAt && new Date(announcement.expiresAt) < new Date();
        
        return `
            <div class="announcement-item ${announcement.type}">
                <div class="announcement-icon">
                    ${getIconForType(announcement.type)}
                </div>
                <div class="announcement-content">
                    <h3>${announcement.title}</h3>
                    <p>${announcement.message}</p>
                    ${announcement.link ? `<a href="${announcement.link}" target="_blank">${announcement.linkText}</a>` : ''}
                    <div class="announcement-meta">
                        <span><i class="fas fa-tag"></i> ${announcement.type}</span>
                        <span><i class="fas fa-exclamation-circle"></i> ${announcement.priority}</span>
                        <span><i class="fas fa-${announcement.isActive ? 'check-circle' : 'times-circle'}"></i> ${announcement.isActive ? 'Active' : 'Inactive'}</span>
                        ${announcement.expiresAt ? `<span><i class="fas fa-calendar-times"></i> ${isExpired ? 'Expired' : 'Expires'} ${new Date(announcement.expiresAt).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="announcement-actions">
                    <button class="action-btn toggle" onclick="toggleAnnouncement('${announcement._id}')" title="${announcement.isActive ? 'Deactivate' : 'Activate'}">
                        <i class="fas fa-${announcement.isActive ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="action-btn edit" onclick="editAnnouncement('${announcement._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAnnouncement('${announcement._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get icon for announcement type
function getIconForType(type) {
    const icons = {
        info: '<i class="fas fa-info-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        event: '<i class="fas fa-calendar-alt"></i>'
    };
    return icons[type] || icons.info;
}

// Open announcement modal
function openAnnouncementModal(announcement = null) {
    const modal = document.getElementById('announcementModal');
    const form = document.getElementById('announcementForm');
    const title = document.getElementById('modalTitle');
    
    if (announcement) {
        // Edit mode
        title.textContent = 'Edit Announcement';
        document.getElementById('announcementId').value = announcement._id;
        document.getElementById('title').value = announcement.title;
        document.getElementById('message').value = announcement.message;
        document.getElementById('type').value = announcement.type;
        document.getElementById('priority').value = announcement.priority;
        document.getElementById('link').value = announcement.link || '';
        document.getElementById('linkText').value = announcement.linkText || 'Learn More';
        document.getElementById('expiresAt').value = announcement.expiresAt ? formatDateForInput(announcement.expiresAt) : '';
        document.getElementById('isActive').checked = announcement.isActive;
    } else {
        // Create mode
        title.textContent = 'Create Announcement';
        form.reset();
        document.getElementById('announcementId').value = '';
        document.getElementById('isActive').checked = true;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();
    
    const announcementId = document.getElementById('announcementId').value;
    const formData = {
        title: document.getElementById('title').value,
        message: document.getElementById('message').value,
        type: document.getElementById('type').value,
        priority: document.getElementById('priority').value,
        link: document.getElementById('link').value || null,
        linkText: document.getElementById('linkText').value || 'Learn More',
        expiresAt: document.getElementById('expiresAt').value || null,
        isActive: document.getElementById('isActive').checked
    };
    
    try {
        const url = announcementId ? `/api/announcements/${announcementId}` : '/api/announcements';
        const method = announcementId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(announcementId ? 'Announcement updated successfully' : 'Announcement created successfully', 'success');
            closeAllModals();
            loadAnnouncements();
        } else {
            showNotification(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        console.error('Error saving announcement:', error);
        showNotification('Error saving announcement', 'error');
    }
}

// Edit announcement
async function editAnnouncement(announcementId) {
    try {
        const response = await fetch(`/api/announcements/${announcementId}`);
        const data = await response.json();
        
        if (data.success) {
            openAnnouncementModal(data.data);
        } else {
            showNotification('Failed to load announcement', 'error');
        }
    } catch (error) {
        console.error('Error loading announcement:', error);
        showNotification('Error loading announcement', 'error');
    }
}

// Toggle announcement status
async function toggleAnnouncement(announcementId) {
    try {
        const response = await fetch(`/api/announcements/${announcementId}/toggle`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            loadAnnouncements();
        } else {
            showNotification(data.message || 'Failed to toggle status', 'error');
        }
    } catch (error) {
        console.error('Error toggling announcement:', error);
        showNotification('Error toggling announcement', 'error');
    }
}

// Delete announcement
async function deleteAnnouncement(announcementId) {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/announcements/${announcementId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Announcement deleted successfully', 'success');
            loadAnnouncements();
        } else {
            showNotification(data.message || 'Failed to delete announcement', 'error');
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showNotification('Error deleting announcement', 'error');
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Format date for input
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

