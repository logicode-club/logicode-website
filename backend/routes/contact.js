const express = require('express');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: contact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin/Core)
router.get('/', protect, authorize('admin', 'core'), async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) query.status = status;

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private (Admin/Core)
router.put('/:id', protect, authorize('admin', 'core'), async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                reply: req.body.reply,
                repliedBy: req.user.id,
                repliedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

