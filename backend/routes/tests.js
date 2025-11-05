const express = require('express');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private (Admin/Leadership)
router.get('/', protect, authorize('admin', 'president', 'vice_president', 'competitive_coding_lead', 'competitive_coding_colead'), async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('event', 'title')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get test by access code
// @route   GET /api/tests/access/:code
// @access  Private
router.get('/access/:code', protect, async (req, res) => {
    try {
        const test = await Test.findOne({ accessCode: req.params.code });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Invalid access code'
            });
        }

        // Check if test is active
        if (!test.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This test is not active'
            });
        }

        // Check if test has started
        if (new Date() < test.startTime) {
            return res.status(400).json({
                success: false,
                message: 'Test has not started yet'
            });
        }

        // Check if test has ended
        if (new Date() > test.endTime) {
            return res.status(400).json({
                success: false,
                message: 'Test has ended'
            });
        }

        // Check if user is allowed (if not public)
        if (!test.isPublic && !test.allowedUsers.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to take this test'
            });
        }

        // Check previous attempts
        const previousAttempts = await Result.countDocuments({
            user: req.user.id,
            test: test._id
        });

        if (previousAttempts >= test.allowedAttempts) {
            return res.status(400).json({
                success: false,
                message: 'You have exhausted all attempts for this test'
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get test questions
// @route   GET /api/tests/:id/questions
// @access  Private
router.get('/:id/questions', protect, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        let questions = await Question.find({ test: req.params.id })
            .select('-correctAnswer -explanation')
            .sort({ order: 1 });

        // Shuffle questions if enabled
        if (test.shuffleQuestions) {
            questions = questions.sort(() => Math.random() - 0.5);
        }

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Submit test
// @route   POST /api/tests/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        const { answers, startedAt, tabSwitches, suspiciousActivity } = req.body;

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        // Get all questions
        const questions = await Question.find({ test: req.params.id });

        // Calculate score
        let totalScore = 0;
        const processedAnswers = [];

        for (const answer of answers) {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            
            if (!question) continue;

            let isCorrect = false;
            let marksObtained = 0;

            if (question.questionType === 'mcq') {
                isCorrect = answer.selectedOption === question.correctAnswer;
                marksObtained = isCorrect ? question.marks : -question.negativeMarks;
            }

            totalScore += marksObtained;

            processedAnswers.push({
                question: question._id,
                selectedOption: answer.selectedOption,
                isCorrect,
                marksObtained,
                timeTaken: answer.timeTaken
            });
        }

        // Get attempt number
        const previousAttempts = await Result.countDocuments({
            user: req.user.id,
            test: test._id
        });

        // Create result
        const result = await Result.create({
            user: req.user.id,
            test: test._id,
            answers: processedAnswers,
            totalScore,
            percentage: (totalScore / test.totalMarks) * 100,
            isPassed: totalScore >= test.passingMarks,
            startedAt,
            submittedAt: new Date(),
            timeTaken: Math.floor((new Date() - new Date(startedAt)) / 1000),
            attemptNumber: previousAttempts + 1,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            tabSwitches,
            suspiciousActivity
        });

        res.status(201).json({
            success: true,
            data: result,
            showResults: test.showResults
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Create test
// @route   POST /api/tests
// @access  Private (Admin/Leadership)
router.post('/', protect, authorize('admin', 'president', 'vice_president', 'competitive_coding_lead', 'competitive_coding_colead'), async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const test = await Test.create(req.body);

        res.status(201).json({
            success: true,
            data: test
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Add questions to test
// @route   POST /api/tests/:id/questions
// @access  Private (Admin/Leadership)
router.post('/:id/questions', protect, authorize('admin', 'president', 'vice_president', 'competitive_coding_lead', 'competitive_coding_colead'), async (req, res) => {
    try {
        const questions = req.body.questions.map(q => ({
            ...q,
            test: req.params.id
        }));

        const createdQuestions = await Question.insertMany(questions);

        res.status(201).json({
            success: true,
            count: createdQuestions.length,
            data: createdQuestions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

