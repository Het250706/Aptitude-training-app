const Gamification = require('../models/Gamification');

class GamificationController {
    constructor() {
        this.getLeaderboard = this.getLeaderboard.bind(this);
        this.getUserBadges = this.getUserBadges.bind(this);
        this.getUserPoints = this.getUserPoints.bind(this);
    }

    async getLeaderboard(req, res) {
        try {
            const { limit = 100 } = req.query;
            const leaderboard = await Gamification.getLeaderboard(parseInt(limit));
            const userRank = await Gamification.getUserRank(req.userId);

            res.json({
                success: true,
                leaderboard,
                userRank
            });
        } catch (error) {
            console.error('Get leaderboard error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getUserBadges(req, res) {
        try {
            const badges = await Gamification.getUserBadges(req.userId);

            res.json({
                success: true,
                badges
            });
        } catch (error) {
            console.error('Get user badges error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getUserPoints(req, res) {
        try {
            const userId = req.userId;
            const rank = await Gamification.getUserRank(userId);
            const badges = await Gamification.getUserBadges(userId);

            res.json({
                success: true,
                totalPoints: rank?.total_points || 0,
                rank: rank?.rank || null,
                badgesCount: badges.length,
                badges
            });
        } catch (error) {
            console.error('Get user points error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

// Export an instance of the controller
const gamificationController = new GamificationController();
module.exports = gamificationController;