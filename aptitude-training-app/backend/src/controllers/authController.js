const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const RefreshToken = require('../models/RefreshToken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const generateRefreshToken = async (userId) => {
    const token = RefreshToken.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create(userId, token, expiresAt);
    return token;
};

exports.register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({ email, passwordHash, fullName });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Update last login
        await User.updateLastLogin(user.id);

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                onboardingCompleted: user.onboarding_completed,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user has password (not OAuth-only)
        if (!user.password_hash) {
            return res.status(401).json({
                message: 'This account uses Google Sign-In. Please use Google to login.'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Update last login
        await User.updateLastLogin(user.id);

        // Get user profile
        const profile = await UserProfile.findByUserId(user.id);

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                onboardingCompleted: user.onboarding_completed,
                avatar: user.avatar,
                profile: profile,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.googleAuth = async (req, res) => {
    // This is handled by Passport middleware
    // The actual implementation is in the route configuration
};

exports.googleAuthCallback = async (req, res) => {
    try {
        // User data from Passport
        const { user, accessToken, refreshToken } = req.user;

        // Redirect to frontend with tokens
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error('Google auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
};

// Add this method to handle OAuth user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user has password (not OAuth-only)
        if (!user.password_hash) {
            return res.status(401).json({
                message: 'This account uses Google Sign-In. Please use "Continue with Google" to login.'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Update last login
        await User.updateLastLogin(user.id);

        // Get user profile
        const profile = await UserProfile.findByUserId(user.id);

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                onboardingCompleted: user.onboarding_completed,
                avatar: user.avatar,
                profile: profile,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        // Verify refresh token
        const tokenData = await RefreshToken.findByToken(refreshToken);
        if (!tokenData) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(tokenData.user_id);

        res.json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await RefreshToken.revokeToken(refreshToken);
        }

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = await UserProfile.findByUserId(req.userId);

        res.json({
            success: true,
            user,
            profile,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, avatar, preferences } = req.body;

        const updatedUser = await User.updateProfile(req.userId, {
            fullName,
            avatar,
            preferences,
        });

        res.json({
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password hash
        const user = await User.findById(req.userId);
        const fullUser = await User.findByEmail(user.email);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, fullUser.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await User.changePassword(req.userId, newPasswordHash);

        // Revoke all refresh tokens for security
        await RefreshToken.revokeAllUserTokens(req.userId);

        res.json({
            success: true,
            message: 'Password changed successfully. Please login again.',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deactivateAccount = async (req, res) => {
    try {
        const { password } = req.body;

        // Get user with password hash
        const user = await User.findById(req.userId);
        const fullUser = await User.findByEmail(user.email);

        // If user has password, verify it
        if (fullUser.password_hash) {
            const isMatch = await bcrypt.compare(password, fullUser.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Password is incorrect' });
            }
        }

        // Deactivate account
        await User.deactivateAccount(req.userId);

        // Revoke all refresh tokens
        await RefreshToken.revokeAllUserTokens(req.userId);

        res.json({
            success: true,
            message: 'Account deactivated successfully',
        });
    } catch (error) {
        console.error('Deactivate account error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};