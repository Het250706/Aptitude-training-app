const db = require('../config/database');

class Gamification {
  static async awardPoints(userId, points, source, sourceId = null) {
    const query = `
      INSERT INTO user_points (user_id, points, source, source_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    await db.query(query, [userId, points, source, sourceId]);

    // Update leaderboard
    await this.updateLeaderboard(userId);

    return { points, source };
  }

  static async updateLeaderboard(userId) {
    const totalPointsQuery = `
      SELECT COALESCE(SUM(points), 0) as total_points
      FROM user_points
      WHERE user_id = $1
    `;
    const pointsResult = await db.query(totalPointsQuery, [userId]);
    const totalPoints = pointsResult.rows[0].total_points;

    const statsQuery = `
      SELECT COUNT(*) as quizzes_taken,
             COUNT(CASE WHEN points = 100 THEN 1 END) as perfect_scores
      FROM user_points
      WHERE user_id = $1 AND source = 'quiz_completion'
    `;
    const statsResult = await db.query(statsQuery, [userId]);

    const query = `
      INSERT INTO leaderboard (user_id, total_points, quizzes_taken, perfect_scores, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        total_points = EXCLUDED.total_points,
        quizzes_taken = EXCLUDED.quizzes_taken,
        perfect_scores = EXCLUDED.perfect_scores,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(query, [userId, totalPoints, statsResult.rows[0].quizzes_taken, statsResult.rows[0].perfect_scores]);

    // Update ranks
    await this.updateRanks();

    return result.rows[0];
  }

  static async updateRanks() {
    const query = `
      UPDATE leaderboard l
      SET rank = sub.rank
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
        FROM leaderboard
      ) sub
      WHERE l.id = sub.id
    `;
    await db.query(query);
  }

  static async getLeaderboard(limit = 100) {
    const query = `
      SELECT l.*, u.full_name, u.avatar
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.total_points DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async getUserRank(userId) {
    try {
      const query = `
      SELECT total_points, current_streak, longest_streak, rank
      FROM leaderboard
      WHERE user_id = $1
    `;
      const result = await db.query(query, [userId]);
      if (result.rows.length === 0) {
        // Create initial record
        const insertQuery = `
        INSERT INTO leaderboard (user_id, total_points, current_streak, longest_streak)
        VALUES ($1, 0, 0, 0)
        RETURNING *
      `;
        const insertResult = await db.query(insertQuery, [userId]);
        return insertResult.rows[0];
      }
      return result.rows[0];
    } catch (error) {
      console.error('Get user rank error:', error);
      return { total_points: 0, current_streak: 0, longest_streak: 0, rank: null };
    }
  }

  static async checkAndAwardBadges(userId) {
    // Get user stats
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT CASE WHEN source = 'quiz_completion' THEN source_id END) as quizzes_completed,
        COUNT(CASE WHEN points = 100 THEN 1 END) as perfect_scores,
        COALESCE(MAX(current_streak), 0) as max_streak,
        COALESCE(SUM(points), 0) as total_points
      FROM user_points up
      LEFT JOIN quiz_sessions qs ON up.source_id = qs.id AND up.source = 'quiz_completion'
      WHERE up.user_id = $1
    `;
    const stats = await db.query(statsQuery, [userId]);
    const userStats = stats.rows[0];

    // Define badge criteria
    const badges = [
      { name: 'First Blood', criteria: 'quizzes_completed >= 1', condition: userStats.quizzes_completed >= 1 },
      { name: 'Perfect Score', criteria: 'perfect_scores >= 1', condition: userStats.perfect_scores >= 1 },
      { name: 'On Fire!', criteria: 'max_streak >= 5', condition: userStats.max_streak >= 5 },
      { name: 'Unstoppable', criteria: 'max_streak >= 10', condition: userStats.max_streak >= 10 },
      { name: 'Quiz Master', criteria: 'quizzes_completed >= 10', condition: userStats.quizzes_completed >= 10 },
      { name: 'Point Collector', criteria: 'total_points >= 1000', condition: userStats.total_points >= 1000 },
      { name: 'Elite Learner', criteria: 'total_points >= 5000', condition: userStats.total_points >= 5000 }
    ];

    const awardedBadges = [];
    for (const badge of badges) {
      if (badge.condition) {
        const badgeCheck = await this.getBadgeId(badge.name);
        if (badgeCheck) {
          const awarded = await this.awardBadge(userId, badgeCheck.id);
          if (awarded) {
            awardedBadges.push(badge.name);
          }
        }
      }
    }

    return awardedBadges;
  }

  static async getBadgeId(badgeName) {
    const query = 'SELECT id FROM badges WHERE name = $1';
    const result = await db.query(query, [badgeName]);
    return result.rows[0];
  }

  static async awardBadge(userId, badgeId) {
    const query = `
      INSERT INTO user_badges (user_id, badge_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query, [userId, badgeId]);
    return result.rows[0];
  }

  static async getUserBadges(userId) {
    const query = `
      SELECT b.*, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Gamification;