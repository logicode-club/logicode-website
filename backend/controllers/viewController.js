const User = require('../models/User');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Announcement = require('../models/Announcement');

// @desc    Render home page
exports.getHome = async (req, res) => {
    try {
        const memberCount = await User.countDocuments({ isActive: true });
        const eventCount = await Event.countDocuments();
        const projectCount = await Project.countDocuments({ status: 'completed' });

        // Get active announcements for homepage
        const announcements = await Announcement.getActive().limit(3);

        const upcomingEvents = await Event.find({ status: 'upcoming' })
            .sort({ startDate: 1 })
            .limit(3);

        const featuredProjects = await Project.find({ isFeatured: true })
            .populate('teamMembers.user', 'name profileImage')
            .limit(3);

        res.render('index', {
            title: 'Home',
            memberCount,
            eventCount,
            projectCount,
            announcements,
            upcomingEvents,
            featuredProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render about page
exports.getAbout = async (req, res) => {
    try {
        res.render('about', {
            title: 'About Us'
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render team page
exports.getTeam = async (req, res) => {
    try {
        const president = await User.findOne({ position: 'President', isActive: true });
        const vicePresident = await User.findOne({ position: 'Vice President', isActive: true });
        const coreMembers = await User.find({ 
            role: 'core', 
            isActive: true,
            position: { $nin: ['President', 'Vice President'] }
        }).sort({ position: 1 });
        const members = await User.find({ role: 'member', isActive: true }).sort({ name: 1 });

        res.render('team', {
            title: 'Our Team',
            president,
            vicePresident,
            coreMembers,
            members
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render projects page
exports.getProjects = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(query)
            .populate('teamMembers.user', 'name profileImage')
            .sort({ isFeatured: -1, createdAt: -1 });

        const categories = await Project.distinct('category');

        res.render('projects', {
            title: 'Projects',
            projects,
            categories,
            selectedCategory: category || 'all',
            searchQuery: search || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render events page
exports.getEvents = async (req, res) => {
    try {
        const upcomingEvents = await Event.find({ status: 'upcoming' })
            .sort({ startDate: 1 });
        
        const pastEvents = await Event.find({ status: 'completed' })
            .sort({ startDate: -1 })
            .limit(10);

        res.render('events', {
            title: 'Events',
            upcomingEvents,
            pastEvents
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render blogs page
exports.getBlogs = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { status: 'published' };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name profileImage')
            .sort({ isFeatured: -1, publishedAt: -1 });

        const categories = ['Web Dev', 'AI', 'Placement', 'Club News', 'Tutorial', 'Interview', 'Other'];

        res.render('blogs', {
            title: 'Blogs',
            blogs,
            categories,
            selectedCategory: category || 'all',
            searchQuery: search || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render contact page
exports.getContact = async (req, res) => {
    try {
        res.render('contact', {
            title: 'Contact Us'
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render gallery page
exports.getGallery = async (req, res) => {
    try {
        const events = await Event.find({ 
            status: 'completed',
            gallery: { $exists: true, $ne: [] }
        }).sort({ startDate: -1 });

        res.render('gallery', {
            title: 'Gallery',
            events
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

// @desc    Render login page
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/login', {
        title: 'Login'
    });
};

// @desc    Render register page
exports.getRegister = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/register', {
        title: 'Register'
    });
};

// @desc    Render admin dashboard
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get statistics
        const stats = {
            users: {
                total: await User.countDocuments(),
                active: await User.countDocuments({ isActive: true }),
                members: await User.countDocuments({ role: 'member' }),
                core: await User.countDocuments({ role: 'core' }),
                admin: await User.countDocuments({ role: 'admin' })
            },
            events: {
                total: await Event.countDocuments(),
                upcoming: await Event.countDocuments({ status: 'upcoming' }),
                ongoing: await Event.countDocuments({ status: 'ongoing' }),
                completed: await Event.countDocuments({ status: 'completed' })
            },
            projects: {
                total: await Project.countDocuments(),
                ongoing: await Project.countDocuments({ status: 'ongoing' }),
                completed: await Project.countDocuments({ status: 'completed' }),
                featured: await Project.countDocuments({ isFeatured: true })
            },
            blogs: {
                total: await Blog.countDocuments(),
                published: await Blog.countDocuments({ status: 'published' }),
                pending: await Blog.countDocuments({ status: 'pending' }),
                draft: await Blog.countDocuments({ status: 'draft' })
            }
        };

        // Get recent activities
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');

        const recentEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt');

        const recentBlogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('author', 'name')
            .select('title status createdAt');

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats,
            activities: {
                users: recentUsers,
                events: recentEvents,
                blogs: recentBlogs
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error', error });
    }
};

