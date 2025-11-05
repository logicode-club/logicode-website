const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

/**
 * Announcement Routes
 * Public routes for viewing, protected routes for management
 */

// ==================== Public Routes ====================
// @route   GET /api/announcements
// @desc    Get all announcements with filters
// @access  Public
router.get('/', announcementController.getAnnouncements);

// @route   GET /api/announcements/active
// @desc    Get active announcements for homepage
// @access  Public
router.get('/active', announcementController.getActiveAnnouncements);

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get('/:id', announcementController.getAnnouncement);

// ==================== Protected Routes (Admin/Core) ====================
// Apply authentication middleware
router.use(protect);
router.use(authorize('admin', 'core'));

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private/Admin
router.post('/', announcementController.createAnnouncement);

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private/Admin
router.put('/:id', announcementController.updateAnnouncement);

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private/Admin
router.delete('/:id', announcementController.deleteAnnouncement);

// @route   PUT /api/announcements/:id/toggle
// @desc    Toggle announcement active status
// @access  Private/Admin
router.put('/:id/toggle', announcementController.toggleAnnouncementStatus);

module.exports = router;

