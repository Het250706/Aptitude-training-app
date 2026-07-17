const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const challengeController = require('../controllers/challengeController');

// Apply authentication to all routes
router.use(verifyToken);

// Routes
router.get('/', challengeController.getChallenges);
router.get('/user', challengeController.getUserChallenges);
router.post('/generate', challengeController.generateChallenge);
router.get('/:challengeId', challengeController.getChallenge);
router.post('/:challengeId/start', challengeController.startChallenge);
router.post('/:challengeId/submit', challengeController.submitChallenge);

module.exports = router;