const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Apply authentication to all routes
router.use(verifyToken);

// Profile routes
router.post('/profile', userController.createProfile);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Diagnostic routes
router.post('/diagnostic', userController.submitDiagnostic);
router.get('/diagnostic-results', userController.getDiagnosticResults);

// Learning path routes
router.get('/learning-path', userController.getLearningPath);
router.put('/learning-progress', userController.updateLearningProgress);
router.post('/complete-module', userController.completeModule);

// Onboarding routes
router.post('/complete-onboarding', userController.completeOnboarding);
router.get('/onboarding-status', userController.getOnboardingStatus);

module.exports = router;