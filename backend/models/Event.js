const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide event description']
    },
    eventType: {
        type: String,
        enum: ['workshop', 'competition', 'webinar', 'hackathon', 'seminar', 'other'],
        required: true
    },
    banner: {
        type: String,
        default: '/images/default-event.jpg'
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide end date']
    },
    venue: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    meetingLink: {
        type: String
    },
    maxParticipants: {
        type: Number,
        default: 0 // 0 means unlimited
    },
    registrationDeadline: {
        type: Date
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'attended', 'absent'],
            default: 'registered'
        }
    }],
    winners: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        position: {
            type: Number,
            required: true
        },
        prize: String
    }],
    organizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    gallery: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    registrationOpen: {
        type: Boolean,
        default: true
    },
    eventCode: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedTest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }
}, {
    timestamps: true
});

// Generate event code
eventSchema.pre('save', function(next) {
    if (!this.eventCode) {
        this.eventCode = `EVT${Date.now().toString(36).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);

