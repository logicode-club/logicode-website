const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Result = require('../models/Result');

/**
 * Admin Routes - Complete and Optimized
 * All routes require authentication and admin/core role
 */

// Apply authentication middleware to all routes
router.use(protect);
router.use(authorize('admin', 'president', 'vice_president'));

// ==================== Dashboard ====================
// @route   GET /api/admin/stats
// @desc    Get dashboard statistics with recent activities
// @access  Private/Admin
router.get('/stats', adminController.getDashboardStats);

// ==================== User Management (Admin Only) ====================
// @route   GET /api/admin/users
// @desc    Get all users with filters and pagination
// @access  Private/Admin
router.get('/users', authorize('admin'), adminController.getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', authorize('admin'), adminController.updateUserRole);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', authorize('admin'), adminController.deleteUser);

// ==================== Blog Management ====================
// @route   GET /api/admin/blogs/pending
// @desc    Get pending blogs for approval
// @access  Private/Admin
router.get('/blogs/pending', adminController.getPendingBlogs);

// @route   PUT /api/admin/blogs/:id/approve
// @desc    Approve blog
// @access  Private/Admin
router.put('/blogs/:id/approve', adminController.approveBlog);

// @route   PUT /api/admin/blogs/:id/reject
// @desc    Reject blog with reason
// @access  Private/Admin
router.put('/blogs/:id/reject', adminController.rejectBlog);

// ==================== Test Management ====================
// @route   GET /api/admin/tests/:id/results
// @desc    Get test results and analytics
// @access  Private/Admin
router.get('/tests/:id/results', async (req, res) => {
    try {
        const results = await Result.find({ test: req.params.id })
            .populate('user', 'name email profileImage')
            .sort({ totalScore: -1, timeTaken: 1 });

        const analytics = {
            totalAttempts: results.length,
            averageScore: results.reduce((acc, r) => acc + r.totalScore, 0) / results.length || 0,
            passRate: (results.filter(r => r.isPassed).length / results.length * 100) || 0,
            highestScore: results[0]?.totalScore || 0,
            lowestScore: results[results.length - 1]?.totalScore || 0
        };

        res.status(200).json({
            success: true,
            data: { results, analytics }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== Data Export ====================
// @route   GET /api/admin/events/:id/export
// @desc    Export event participants as CSV
// @access  Private/Admin
router.get('/events/:id/export', adminController.exportEventParticipants);

// @route   GET /api/admin/tests/:id/export
// @desc    Export test results as CSV
// @access  Private/Admin
router.get('/tests/:id/export', async (req, res) => {
    try {
        const results = await Result.find({ test: req.params.id })
            .populate('user', 'name email rollNumber')
            .sort({ rank: 1 });

        let csv = 'Rank,Name,Email,Roll Number,Score,Percentage,Status,Time Taken (sec)\n';

        results.forEach(result => {
            csv += `${result.rank},${result.user.name},${result.user.email},${result.user.rollNumber || 'N/A'},${result.totalScore},${result.percentage.toFixed(2)},${result.isPassed ? 'Pass' : 'Fail'},${result.timeTaken}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=test-results-${req.params.id}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

