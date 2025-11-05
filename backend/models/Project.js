const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide project title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide project description']
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    category: {
        type: String,
        enum: ['Web', 'AI', 'App', 'IoT', 'Blockchain', 'Game', 'Other'],
        required: true
    },
    techStack: [{
        type: String,
        required: true
    }],
    images: [{
        type: String
    }],
    thumbnail: {
        type: String,
        default: '/images/default-project.jpg'
    },
    githubLink: {
        type: String
    },
    liveLink: {
        type: String
    },
    videoLink: {
        type: String
    },
    teamMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: String
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    award: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'archived'],
        default: 'ongoing'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

