const mongoose = require('mongoose');

/**
 * Announcement Model
 * For displaying important notifications on the homepage
 */
const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'event'],
        default: 'info'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    link: {
        type: String,
        trim: true
    },
    linkText: {
        type: String,
        trim: true,
        default: 'Learn More'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
announcementSchema.index({ isActive: 1, expiresAt: 1, priority: -1 });

// Method to check if announcement is expired
announcementSchema.methods.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
};

// Static method to get active announcements
announcementSchema.statics.getActive = function() {
    return this.find({
        isActive: true,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    }).sort({ priority: -1, createdAt: -1 });
};

module.exports = mongoose.model('Announcement', announcementSchema);

