const db = require('../config/database');

class SkillGapAnalysis {
    static async create(userId, skillGaps) {
        const query = `
      INSERT INTO skill_gaps 
      (user_id, skill_category, current_level, target_level, gap_score, priority, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const results = [];
        for (const gap of skillGaps) {
            const values = [
                userId, gap.skill_category, gap.current_level, gap.target_level,
                gap.gap_score, gap.priority, JSON.stringify(gap.recommendations)
            ];
            const result = await db.query(query, values);
            results.push(result.rows[0]);
        }
        return results;
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM skill_gaps WHERE user_id = $1 ORDER BY priority DESC, gap_score DESC';
        const result = await db.query(query, [userId]);
        return result.rows.map(row => ({
            ...row,
            recommendations: typeof row.recommendations === 'string' ? JSON.parse(row.recommendations) : row.recommendations
        }));
    }

    static async updateSkillGap(userId, skillCategory, updates) {
        const query = `
      UPDATE skill_gaps 
      SET current_level = COALESCE($1, current_level),
          gap_score = COALESCE($2, gap_score),
          priority = COALESCE($3, priority),
          recommendations = COALESCE($4, recommendations),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5 AND skill_category = $6
      RETURNING *
    `;
        const values = [
            updates.current_level, updates.gap_score, updates.priority,
            updates.recommendations ? JSON.stringify(updates.recommendations) : null,
            userId, skillCategory
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static calculateGapScore(currentLevel, targetLevel) {
        return Math.max(0, targetLevel - currentLevel);
    }

    static determinePriority(gapScore) {
        if (gapScore >= 60) return 'critical';
        if (gapScore >= 40) return 'high';
        if (gapScore >= 20) return 'medium';
        return 'low';
    }
}

module.exports = SkillGapAnalysis;