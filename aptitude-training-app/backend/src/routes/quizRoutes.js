const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

// Apply authentication to all routes
router.use(verifyToken);

// Routes
router.post('/start', quizController.startQuiz);
router.post('/submit', quizController.submitAnswer);
router.get('/results/:sessionId', quizController.getQuizResults);

module.exports = router;