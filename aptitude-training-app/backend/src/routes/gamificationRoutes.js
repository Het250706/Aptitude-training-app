const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const gamificationController = require('../controllers/gamificationController');

// Apply authentication to all routes
router.use(verifyToken);

// Routes
router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/badges', gamificationController.getUserBadges);
router.get('/points', gamificationController.getUserPoints);

module.exports = router;