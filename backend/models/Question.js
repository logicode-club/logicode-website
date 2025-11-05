const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    questionText: {
        type: String,
        required: [true, 'Please provide question text']
    },
    questionType: {
        type: String,
        enum: ['mcq', 'multiple-answer', 'true-false'],
        default: 'mcq'
    },
    options: [{
        text: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    correctAnswer: {
        type: String // For true-false or single correct answer reference
    },
    marks: {
        type: Number,
        required: true,
        default: 1
    },
    negativeMarks: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    category: {
        type: String,
        trim: true
    },
    explanation: {
        type: String
    },
    image: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);

