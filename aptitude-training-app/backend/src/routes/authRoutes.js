const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest, verifyToken } = require('../middleware/authMiddleware');
const passport = require('../config/passport');

// Email/Password routes
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('fullName').notEmpty().trim().withMessage('Full name is required'),
    ],
    validateRequest,
    authController.register
);

router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    validateRequest,
    authController.login
);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Google OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: '/login' }),
        authController.googleAuthCallback
    );
} else {
    const handleNoGoogleOAuth = (req, res) => {
        res.status(501).json({
            success: false,
            message: 'Google OAuth is not configured on this server.'
        });
    };
    router.get('/google', handleNoGoogleOAuth);
    router.get('/google/callback', handleNoGoogleOAuth);
}

// Protected routes
router.get('/me', verifyToken, authController.getMe);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);
router.post('/deactivate-account', verifyToken, authController.deactivateAccount);

module.exports = router;