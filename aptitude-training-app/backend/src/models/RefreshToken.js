const db = require('../config/database');
const crypto = require('crypto');

class RefreshToken {
    static async create(userId, token, expiresAt) {
        const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, token, expires_at
    `;
        const result = await db.query(query, [userId, token, expiresAt]);
        return result.rows[0];
    }

    static async findByToken(token) {
        const query = `
      SELECT * FROM refresh_tokens 
      WHERE token = $1 AND revoked = false AND expires_at > CURRENT_TIMESTAMP
    `;
        const result = await db.query(query, [token]);
        return result.rows[0];
    }

    static async revokeToken(token) {
        const query = `
      UPDATE refresh_tokens 
      SET revoked = true, revoked_at = CURRENT_TIMESTAMP
      WHERE token = $1
      RETURNING id
    `;
        const result = await db.query(query, [token]);
        return result.rows[0];
    }

    static async revokeAllUserTokens(userId) {
        const query = `
      UPDATE refresh_tokens 
      SET revoked = true, revoked_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND revoked = false
      RETURNING id
    `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    static async cleanupExpiredTokens() {
        const query = `
      DELETE FROM refresh_tokens 
      WHERE expires_at < CURRENT_TIMESTAMP OR revoked = true
      RETURNING id
    `;
        const result = await db.query(query);
        return result.rows;
    }

    static generateToken() {
        return crypto.randomBytes(64).toString('hex');
    }
}

module.exports = RefreshToken;