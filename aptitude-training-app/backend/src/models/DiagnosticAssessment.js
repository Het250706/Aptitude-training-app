const db = require('../config/database');

class DiagnosticAssessment {
    static async create(userId, results) {
        const query = `
      INSERT INTO diagnostic_assessments (user_id, scores, strengths, weaknesses, overall_score, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [
            userId,
            JSON.stringify(results.scores || {}),
            results.strengths || [],
            results.weaknesses || [],
            results.overallScore || 0,
            JSON.stringify(results)
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM diagnostic_assessments WHERE user_id = $1 ORDER BY completed_at DESC';
        const result = await db.query(query, [userId]);
        return result.rows.map(row => ({
            ...row,
            scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
            data: row.data ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) : null
        }));
    }

    static async findLatestByUserId(userId) {
        const query = 'SELECT * FROM diagnostic_assessments WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1';
        const result = await db.query(query, [userId]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            ...row,
            scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
            data: row.data ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) : null
        };
    }

    static async getLatestScore(userId) {
        const query = `
      SELECT overall_score, strengths, weaknesses, completed_at 
      FROM diagnostic_assessments 
      WHERE user_id = $1 
      ORDER BY completed_at DESC 
      LIMIT 1
    `;
        const result = await db.query(query, [userId]);
        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    static async getAverageScores(userId) {
        const query = `
      SELECT 
        AVG(overall_score) as average_score,
        COUNT(*) as total_attempts,
        MAX(overall_score) as highest_score,
        MIN(overall_score) as lowest_score
      FROM diagnostic_assessments 
      WHERE user_id = $1
    `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }
}

module.exports = DiagnosticAssessment;