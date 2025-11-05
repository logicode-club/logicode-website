const express = require('express');
const Blog = require('../models/Blog');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = { status: 'published' };

        if (category) query.category = category;
        if (status && req.user && (req.user.role === 'admin' || req.user.role === 'core')) {
            query.status = status;
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name profileImage')
            .sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name profileImage bio')
            .populate('comments.user', 'name profileImage');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        req.body.author = req.user.id;
        
        // Members can only create drafts
        if (req.user.role === 'member') {
            req.body.status = 'draft';
        }

        const blog = await Blog.create(req.body);

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check ownership or admin/core
        if (blog.author.toString() !== req.user.id && !['admin', 'core'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check ownership or admin
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const likeIndex = blog.likes.indexOf(req.user.id);

        if (likeIndex > -1) {
            // Unlike
            blog.likes.splice(likeIndex, 1);
        } else {
            // Like
            blog.likes.push(req.user.id);
        }

        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

