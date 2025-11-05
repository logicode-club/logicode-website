const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide test title'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please provide test duration']
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    instructions: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    allowedAttempts: {
        type: Number,
        default: 1
    },
    shuffleQuestions: {
        type: Boolean,
        default: true
    },
    showResults: {
        type: Boolean,
        default: false
    },
    accessCode: {
        type: String,
        unique: true
    },
    allowedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Generate access code
testSchema.pre('save', function(next) {
    if (!this.accessCode) {
        this.accessCode = `TEST${Date.now().toString(36).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('Test', testSchema);

