const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const learningController = require('../controllers/learningController');

// Apply authentication to all routes
router.use(verifyToken);

// Diagnostic Assessment
router.post('/diagnostic', learningController.submitDiagnosticAssessment);

// Learning Style Assessment (VARK)
router.post('/learning-style', learningController.submitLearningStyleAssessment);
router.get('/learning-style/questions', learningController.getLearningStyleQuestions);

// Learning Path
router.post('/generate-path', learningController.generateLearningPath);
router.get('/learning-path', learningController.getLearningPath);
router.put('/node-progress', learningController.updateNodeProgress);

module.exports = router;