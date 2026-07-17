const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const mockTestController = require('../controllers/mockTestController');

// Apply authentication to all routes
router.use(verifyToken);

// Routes
router.post('/generate', mockTestController.generateMockTest);
router.post('/submit', mockTestController.submitMockTest);

module.exports = router;