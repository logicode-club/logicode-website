const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedOption: {
            type: String
        },
        selectedOptions: [{
            type: String
        }],
        isCorrect: {
            type: Boolean
        },
        marksObtained: {
            type: Number,
            default: 0
        },
        timeTaken: {
            type: Number // in seconds
        }
    }],
    totalScore: {
        type: Number,
        required: true,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number
    },
    isPassed: {
        type: Boolean,
        default: false
    },
    startedAt: {
        type: Date,
        required: true
    },
    submittedAt: {
        type: Date,
        required: true
    },
    timeTaken: {
        type: Number // total time in seconds
    },
    attemptNumber: {
        type: Number,
        default: 1
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    tabSwitches: {
        type: Number,
        default: 0
    },
    suspiciousActivity: [{
        type: {
            type: String,
            enum: ['tab-switch', 'copy-attempt', 'right-click', 'fullscreen-exit']
        },
        timestamp: Date
    }]
}, {
    timestamps: true
});

// Calculate rank after saving
resultSchema.post('save', async function() {
    const Result = this.constructor;
    const results = await Result.find({ test: this.test }).sort({ totalScore: -1, timeTaken: 1 });
    
    for (let i = 0; i < results.length; i++) {
        results[i].rank = i + 1;
        await results[i].save();
    }
});

module.exports = mongoose.model('Result', resultSchema);

