// Admin Events Management
let currentEventId = null;
let currentFilter = 'all';

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create event button
    document.getElementById('createEventBtn').addEventListener('click', () => {
        openEventModal();
    });
    
    // Filter tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            loadEvents();
        });
    });
    
    // Event form submit
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            closeAllModals();
        });
    });
}

// Load events from API
async function loadEvents() {
    try {
        const url = currentFilter === 'all' 
            ? '/api/events' 
            : `/api/events?status=${currentFilter}`;
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayEvents(data.data);
        } else {
            showNotification('Failed to load events', 'error');
        }
    } catch (error) {
        console.error('Error loading events:', error);
        showNotification('Error loading events', 'error');
    }
}

// Display events in table
function displayEvents(events) {
    const tbody = document.getElementById('eventsTableBody');
    
    if (!events || events.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-muted);">No events found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = events.map(event => `
        <tr>
            <td>
                <img src="${event.banner || '/images/default-event.jpg'}" alt="${event.title}" class="event-banner">
            </td>
            <td>
                <strong>${event.title}</strong>
            </td>
            <td>
                <span class="badge badge-primary">${event.eventType}</span>
            </td>
            <td>
                ${new Date(event.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                })}
            </td>
            <td>
                <span class="status-badge ${event.status}">${event.status}</span>
            </td>
            <td>
                <button class="action-btn view" onclick="viewParticipants('${event._id}')" title="View Participants">
                    <i class="fas fa-users"></i> ${event.participants ? event.participants.length : 0}
                </button>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editEvent('${event._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEvent('${event._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Open event modal
function openEventModal(event = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const title = document.getElementById('modalTitle');
    
    if (event) {
        // Edit mode
        title.textContent = 'Edit Event';
        document.getElementById('eventId').value = event._id;
        document.getElementById('title').value = event.title;
        document.getElementById('eventType').value = event.eventType;
        document.getElementById('description').value = event.description;
        document.getElementById('startDate').value = formatDateForInput(event.startDate);
        document.getElementById('endDate').value = formatDateForInput(event.endDate);
        document.getElementById('venue').value = event.venue;
        document.getElementById('maxParticipants').value = event.maxParticipants || '';
        document.getElementById('banner').value = event.banner || '';
        document.getElementById('isOnline').checked = event.isOnline;
        document.getElementById('registrationOpen').checked = event.registrationOpen;
        document.getElementById('eventCode').value = event.eventCode || '';
    } else {
        // Create mode
        title.textContent = 'Create Event';
        form.reset();
        document.getElementById('eventId').value = '';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle event form submit
async function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('eventId').value;
    const formData = {
        title: document.getElementById('title').value,
        eventType: document.getElementById('eventType').value,
        description: document.getElementById('description').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        venue: document.getElementById('venue').value,
        maxParticipants: document.getElementById('maxParticipants').value || 0,
        banner: document.getElementById('banner').value,
        isOnline: document.getElementById('isOnline').checked,
        registrationOpen: document.getElementById('registrationOpen').checked,
        eventCode: document.getElementById('eventCode').value
    };
    
    try {
        const url = eventId ? `/api/events/${eventId}` : '/api/events';
        const method = eventId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(eventId ? 'Event updated successfully' : 'Event created successfully', 'success');
            closeAllModals();
            loadEvents();
        } else {
            showNotification(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showNotification('Error saving event', 'error');
    }
}

// Edit event
async function editEvent(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        
        if (data.success) {
            openEventModal(data.data);
        } else {
            showNotification('Failed to load event', 'error');
        }
    } catch (error) {
        console.error('Error loading event:', error);
        showNotification('Error loading event', 'error');
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Event deleted successfully', 'success');
            loadEvents();
        } else {
            showNotification(data.message || 'Failed to delete event', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error deleting event', 'error');
    }
}

// View participants
async function viewParticipants(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        
        if (data.success) {
            const event = data.data;
            const modal = document.getElementById('participantsModal');
            const list = document.getElementById('participantsList');
            
            if (!event.participants || event.participants.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No participants yet</p>';
            } else {
                list.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <strong>Total Participants: ${event.participants.length}</strong>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${event.participants.map((p, index) => `
                            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--dark-bg); border-radius: 0.5rem;">
                                <span style="font-weight: 600;">${index + 1}.</span>
                                <img src="${p.user.profileImage}" alt="${p.user.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                                <div>
                                    <div style="font-weight: 600;">${p.user.name}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-muted);">${p.user.email}</div>
                                </div>
                                <div style="margin-left: auto; font-size: 0.875rem; color: var(--text-muted);">
                                    ${new Date(p.registeredAt).toLocaleDateString()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            currentEventId = eventId;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error loading participants:', error);
        showNotification('Error loading participants', 'error');
    }
}

// Export participants
document.getElementById('exportParticipants')?.addEventListener('click', async () => {
    if (!currentEventId) return;
    
    try {
        window.location.href = `/api/admin/events/${currentEventId}/export`;
    } catch (error) {
        console.error('Error exporting participants:', error);
        showNotification('Error exporting participants', 'error');
    }
});

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
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

