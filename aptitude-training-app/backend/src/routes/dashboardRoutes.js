const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(verifyToken);

router.get('/data', dashboardController.getDashboardData);
router.get('/learning-content', dashboardController.getLearningContent);
router.post('/generate-content', dashboardController.generateAIContent);

module.exports = router;