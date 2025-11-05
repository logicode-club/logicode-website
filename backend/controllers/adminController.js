const User = require('../models/User');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Test = require('../models/Test');
const Contact = require('../models/Contact');
const Announcement = require('../models/Announcement');
const Result = require('../models/Result');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalEvents,
            upcomingEvents,
            totalProjects,
            featuredProjects,
            totalBlogs,
            pendingBlogs,
            totalTests,
            totalContacts,
            unreadContacts,
            totalAnnouncements
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Event.countDocuments(),
            Event.countDocuments({ status: 'upcoming' }),
            Project.countDocuments(),
            Project.countDocuments({ isFeatured: true }),
            Blog.countDocuments(),
            Blog.countDocuments({ status: 'pending' }),
            Test.countDocuments(),
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'new' }),
            Announcement.countDocuments({ isActive: true })
        ]);

        // Get role distribution
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Get recent activities
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentEvents = await Event.find()
            .select('title status startDate createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentBlogs = await Blog.find()
            .select('title status createdAt')
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    users: {
                        total: totalUsers,
                        active: activeUsers,
                        inactive: totalUsers - activeUsers
                    },
                    events: {
                        total: totalEvents,
                        upcoming: upcomingEvents
                    },
                    projects: {
                        total: totalProjects,
                        featured: featuredProjects
                    },
                    blogs: {
                        total: totalBlogs,
                        pending: pendingBlogs
                    },
                    tests: {
                        total: totalTests
                    },
                    contacts: {
                        total: totalContacts,
                        unread: unreadContacts
                    },
                    announcements: {
                        total: totalAnnouncements
                    },
                    roleDistribution
                },
                recentActivities: {
                    users: recentUsers,
                    events: recentEvents,
                    blogs: recentBlogs
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;

        // Build query
        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        // Validate role
        const validRoles = [
            'admin',
            'president',
            'vice_president',
            'treasurer',
            'secretary',
            'competitive_coding_lead',
            'competitive_coding_colead',
            'technical_support_lead',
            'technical_support_colead',
            'event_management_lead',
            'event_management_colead',
            'decoration_team_lead',
            'decoration_team_colead',
            'media_team_lead',
            'media_team_colead',
            'member'
        ];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

/**
 * @desc    Get pending blogs
 * @route   GET /api/admin/blogs/pending
 * @access  Private/Admin
 */
exports.getPendingBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ status: 'pending' })
            .populate('author', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending blogs',
            error: error.message
        });
    }
};

/**
 * @desc    Approve blog
 * @route   PUT /api/admin/blogs/:id/approve
 * @access  Private/Admin
 */
exports.approveBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                status: 'published',
                publishedAt: Date.now()
            },
            { new: true }
        ).populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog approved and published successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving blog',
            error: error.message
        });
    }
};

/**
 * @desc    Reject blog
 * @route   PUT /api/admin/blogs/:id/reject
 * @access  Private/Admin
 */
exports.rejectBlog = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                status: 'draft',
                rejectionReason: reason || 'Content needs improvement'
            },
            { new: true }
        ).populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog rejected successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting blog',
            error: error.message
        });
    }
};

/**
 * @desc    Export event participants as CSV
 * @route   GET /api/admin/events/:id/export
 * @access  Private/Admin
 */
exports.exportEventParticipants = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('participants.user', 'name email phone rollNumber year department');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Create CSV
        let csv = 'Name,Email,Phone,Roll Number,Year,Department,Registered At\n';

        event.participants.forEach(p => {
            csv += `"${p.user.name}","${p.user.email}","${p.user.phone || 'N/A'}","${p.user.rollNumber || 'N/A'}","${p.user.year || 'N/A'}","${p.user.department || 'N/A'}","${new Date(p.registeredAt).toLocaleDateString()}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_')}-participants.csv"`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting participants',
            error: error.message
        });
    }
};

module.exports = exports;

