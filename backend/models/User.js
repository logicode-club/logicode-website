const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: [
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
        ],
        default: 'member'
    },
    profileImage: {
        type: String,
        default: '/images/default-avatar.png'
    },
    phone: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        enum: ['FE', 'SE', 'TE', 'BE', 'Alumni'],
    },
    department: {
        type: String,
        trim: true
    },
    rollNumber: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    skills: [{
        type: String
    }],
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        portfolio: String
    },
    position: {
        type: String,
        trim: true
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    eventsParticipated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    testResults: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', userSchema);

