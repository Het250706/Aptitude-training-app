const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ email, passwordHash, fullName, googleId = null, avatar = null }) {
        const query = `
      INSERT INTO users (email, password_hash, full_name, google_id, avatar, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, full_name, created_at, onboarding_completed, avatar, google_id
    `;
        const values = [email, passwordHash || null, fullName, googleId, avatar];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async findByGoogleId(googleId) {
        const query = 'SELECT * FROM users WHERE google_id = $1 AND is_active = true';
        const result = await db.query(query, [googleId]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
      SELECT id, email, full_name, created_at, updated_at, onboarding_completed, 
             is_active, avatar, google_id, last_login, preferences
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
        const result = await db.query(query, [id]);
        if (result.rows[0] && result.rows[0].preferences) {
            result.rows[0].preferences = typeof result.rows[0].preferences === 'string'
                ? JSON.parse(result.rows[0].preferences)
                : result.rows[0].preferences;
        }
        return result.rows[0];
    }

    static async updateLastLogin(userId) {
        const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
        await db.query(query, [userId]);
    }

    static async updateOnboardingStatus(userId, completed) {
        const query = `
      UPDATE users 
      SET onboarding_completed = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, full_name, onboarding_completed
    `;
        const result = await db.query(query, [completed, userId]);
        return result.rows[0];
    }

    static async updateProfile(userId, { fullName, avatar, preferences }) {
        const updates = [];
        const values = [];
        let paramCounter = 1;

        if (fullName !== undefined) {
            updates.push(`full_name = $${paramCounter++}`);
            values.push(fullName);
        }
        if (avatar !== undefined) {
            updates.push(`avatar = $${paramCounter++}`);
            values.push(avatar);
        }
        if (preferences !== undefined) {
            updates.push(`preferences = $${paramCounter++}`);
            values.push(JSON.stringify(preferences));
        }

        if (updates.length === 0) return null;

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(userId);

        const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, email, full_name, avatar, preferences, onboarding_completed
    `;

        const result = await db.query(query, values);
        if (result.rows[0] && result.rows[0].preferences) {
            result.rows[0].preferences = typeof result.rows[0].preferences === 'string'
                ? JSON.parse(result.rows[0].preferences)
                : result.rows[0].preferences;
        }
        return result.rows[0];
    }

    static async changePassword(userId, newPasswordHash) {
        const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
        await db.query(query, [newPasswordHash, userId]);
    }

    static async deactivateAccount(userId) {
        const query = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email
    `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    static async updatePreferences(userId, preferences) {
        const query = `
      UPDATE users 
      SET preferences = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING preferences
    `;
        const result = await db.query(query, [JSON.stringify(preferences), userId]);
        if (result.rows[0] && result.rows[0].preferences) {
            result.rows[0].preferences = JSON.parse(result.rows[0].preferences);
        }
        return result.rows[0];
    }

    static async getAllUsers(limit = 100, offset = 0) {
        const query = `
      SELECT id, email, full_name, created_at, last_login, onboarding_completed
      FROM users 
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    static async countUsers() {
        const query = 'SELECT COUNT(*) as count FROM users WHERE is_active = true';
        const result = await db.query(query);
        return parseInt(result.rows[0].count);
    }

    // Check if user has password set (not OAuth-only)
    static async hasPassword(userId) {
        const query = 'SELECT password_hash FROM users WHERE id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0]?.password_hash !== null;
    }
}

module.exports = User;