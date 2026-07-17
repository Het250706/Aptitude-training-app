const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const generateRefreshToken = async (userId) => {
    const token = RefreshToken.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create(userId, token, expiresAt);
    return token;
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    console.log('Google profile received:', profile.id, profile.emails[0]?.value);

                    // Check if user exists with Google ID
                    let user = await User.findByGoogleId(profile.id);

                    if (!user) {
                        // Check if user exists with email
                        user = await User.findByEmail(profile.emails[0].value);

                        if (user) {
                            // Link Google account to existing user
                            const updateQuery = `
                  UPDATE users 
                  SET google_id = $1, avatar = $2, updated_at = CURRENT_TIMESTAMP
                  WHERE id = $3
                  RETURNING id, email, full_name, onboarding_completed, avatar, google_id
                `;
                            const db = require('./database');
                            const result = await db.query(updateQuery, [
                                profile.id,
                                profile.photos[0]?.value || null,
                                user.id
                            ]);
                            user = result.rows[0];
                            console.log('Linked Google account to existing user:', user.id);
                        } else {
                            // Create new user with NULL password_hash
                            user = await User.create({
                                email: profile.emails[0].value,
                                passwordHash: null, // Explicitly set to null for OAuth users
                                fullName: profile.displayName,
                                googleId: profile.id,
                                avatar: profile.photos[0]?.value || null,
                            });
                            console.log('Created new user via Google OAuth:', user.id);
                        }
                    }

                    // Generate JWT tokens
                    const jwtAccessToken = generateAccessToken(user.id);
                    const jwtRefreshToken = await generateRefreshToken(user.id);

                    // Update last login
                    await User.updateLastLogin(user.id);

                    return done(null, { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
                } catch (error) {
                    console.error('Google Strategy Error:', error);
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn('⚠️ Google OAuth Strategy not loaded: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in .env');
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;