const Announcement = require('../models/Announcement');

/**
 * @desc    Get all announcements (with filters)
 * @route   GET /api/announcements
 * @access  Public
 */
exports.getAnnouncements = async (req, res, next) => {
    try {
        const { active, type, limit = 10 } = req.query;

        // Build query
        const query = {};
        if (active === 'true') {
            query.isActive = true;
            query.$or = [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ];
        }
        if (type) query.type = type;

        const announcements = await Announcement.find(query)
            .populate('createdBy', 'name')
            .sort({ priority: -1, createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message
        });
    }
};

/**
 * @desc    Get active announcements for homepage
 * @route   GET /api/announcements/active
 * @access  Public
 */
exports.getActiveAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.getActive()
            .populate('createdBy', 'name')
            .limit(5);

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching active announcements',
            error: error.message
        });
    }
};

/**
 * @desc    Get single announcement
 * @route   GET /api/announcements/:id
 * @access  Public
 */
exports.getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching announcement',
            error: error.message
        });
    }
};

/**
 * @desc    Create announcement
 * @route   POST /api/announcements
 * @access  Private/Admin
 */
exports.createAnnouncement = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const announcement = await Announcement.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating announcement',
            error: error.message
        });
    }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Private/Admin
 */
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating announcement',
            error: error.message
        });
    }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private/Admin
 */
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting announcement',
            error: error.message
        });
    }
};

/**
 * @desc    Toggle announcement active status
 * @route   PUT /api/announcements/:id/toggle
 * @access  Private/Admin
 */
exports.toggleAnnouncementStatus = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        announcement.isActive = !announcement.isActive;
        await announcement.save();

        res.status(200).json({
            success: true,
            message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling announcement status',
            error: error.message
        });
    }
};

module.exports = exports;

