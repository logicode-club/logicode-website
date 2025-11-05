// Admin Blog Management
let currentStatus = 'pending';
let currentBlogId = null;

// Load blogs on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatus = btn.dataset.status;
            loadBlogs();
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Modal overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });
    
    // Approve button in preview modal
    document.getElementById('approveBtn').addEventListener('click', () => {
        if (currentBlogId) {
            approveBlog(currentBlogId);
        }
    });
    
    // Reject button in preview modal
    document.getElementById('rejectBtn').addEventListener('click', () => {
        if (currentBlogId) {
            openRejectModal(currentBlogId);
        }
    });
    
    // Confirm reject button
    document.getElementById('confirmReject').addEventListener('click', handleReject);
}

// Load blogs from API
async function loadBlogs() {
    try {
        let url = '/api/blogs';
        
        if (currentStatus === 'pending') {
            url = '/api/admin/blogs/pending';
        } else if (currentStatus !== 'all') {
            url = `/api/blogs?status=${currentStatus}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayBlogs(data.data);
            
            // Update pending count
            if (currentStatus === 'pending') {
                document.getElementById('pendingCount').textContent = data.count;
            }
        } else {
            showNotification('Failed to load blogs', 'error');
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        showNotification('Error loading blogs', 'error');
    }
}

// Display blogs in grid
function displayBlogs(blogs) {
    const grid = document.getElementById('blogsGrid');
    
    if (!blogs || blogs.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-blog"></i>
                <h3>No blogs found</h3>
                <p>There are no ${currentStatus === 'all' ? '' : currentStatus} blogs at the moment.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" class="blog-card-image">` : ''}
            <div class="blog-card-content">
                <div class="blog-card-header">
                    <h3 class="blog-card-title">${blog.title}</h3>
                    <span class="blog-status ${blog.status}">${blog.status.toUpperCase()}</span>
                </div>
                
                <p class="blog-card-excerpt">${blog.excerpt || blog.content.substring(0, 150) + '...'}</p>
                
                <div class="blog-card-meta">
                    <div class="blog-author">
                        <img src="${blog.author.profileImage || '/images/default-avatar.png'}" alt="${blog.author.name}" class="blog-author-avatar">
                        <span>${blog.author.name}</span>
                    </div>
                    <span>•</span>
                    <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div class="blog-card-actions">
                    <button class="btn btn-outline" onclick="previewBlog('${blog._id}')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    ${blog.status === 'pending' ? `
                        <button class="btn btn-success" onclick="approveBlog('${blog._id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger" onclick="openRejectModal('${blog._id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Preview blog
async function previewBlog(blogId) {
    try {
        const response = await fetch(`/api/blogs/${blogId}`);
        const data = await response.json();
        
        if (data.success) {
            const blog = data.data;
            currentBlogId = blogId;
            
            const preview = document.getElementById('blogPreview');
            preview.innerHTML = `
                ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" style="width: 100%; border-radius: 0.5rem; margin-bottom: 1.5rem;">` : ''}
                
                <h2>${blog.title}</h2>
                
                <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; padding: 1rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <img src="${blog.author.profileImage || '/images/default-avatar.png'}" alt="${blog.author.name}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <strong>${blog.author.name}</strong>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.875rem;">${new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="blog-content">
                    ${blog.content}
                </div>
                
                ${blog.tags && blog.tags.length > 0 ? `
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                        <strong>Tags:</strong>
                        ${blog.tags.map(tag => `<span class="badge" style="margin-left: 0.5rem;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            `;
            
            // Show/hide action buttons based on status
            const approveBtn = document.getElementById('approveBtn');
            const rejectBtn = document.getElementById('rejectBtn');
            
            if (blog.status === 'pending') {
                approveBtn.style.display = 'flex';
                rejectBtn.style.display = 'flex';
            } else {
                approveBtn.style.display = 'none';
                rejectBtn.style.display = 'none';
            }
            
            document.getElementById('previewModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error loading blog:', error);
        showNotification('Error loading blog', 'error');
    }
}

// Approve blog
async function approveBlog(blogId) {
    try {
        const response = await fetch(`/api/admin/blogs/${blogId}/approve`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Blog approved and published successfully', 'success');
            closeAllModals();
            loadBlogs();
        } else {
            showNotification(data.message || 'Failed to approve blog', 'error');
        }
    } catch (error) {
        console.error('Error approving blog:', error);
        showNotification('Error approving blog', 'error');
    }
}

// Open reject modal
function openRejectModal(blogId) {
    document.getElementById('rejectBlogId').value = blogId;
    document.getElementById('rejectionReason').value = '';
    
    // Close preview modal if open
    document.getElementById('previewModal').classList.remove('active');
    
    document.getElementById('rejectModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle reject
async function handleReject() {
    const blogId = document.getElementById('rejectBlogId').value;
    const reason = document.getElementById('rejectionReason').value;
    
    if (!reason.trim()) {
        showNotification('Please provide a reason for rejection', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/blogs/${blogId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Blog rejected successfully', 'success');
            closeAllModals();
            loadBlogs();
        } else {
            showNotification(data.message || 'Failed to reject blog', 'error');
        }
    } catch (error) {
        console.error('Error rejecting blog:', error);
        showNotification('Error rejecting blog', 'error');
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    currentBlogId = null;
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

