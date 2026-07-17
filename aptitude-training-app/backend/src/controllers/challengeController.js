const RealWorldChallenges = require('../models/RealWorldChallenges');
const Gamification = require('../models/Gamification');
const UserProfile = require('../models/UserProfile');
const openAIService = require('../services/openaiService');

class ChallengeController {
    constructor() {
        this.getChallenges = this.getChallenges.bind(this);
        this.getChallenge = this.getChallenge.bind(this);
        this.startChallenge = this.startChallenge.bind(this);
        this.submitChallenge = this.submitChallenge.bind(this);
        this.getUserChallenges = this.getUserChallenges.bind(this);
        this.generateChallenge = this.generateChallenge.bind(this);
    }

    async getChallenges(req, res) {
        try {
            const { category, difficulty } = req.query;
            const challenges = await RealWorldChallenges.getChallenges(category, difficulty);

            res.json({
                success: true,
                challenges
            });
        } catch (error) {
            console.error('Get challenges error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getChallenge(req, res) {
        try {
            const { challengeId } = req.params;
            const challenge = await RealWorldChallenges.getChallengeById(challengeId);

            if (!challenge) {
                return res.status(404).json({ message: 'Challenge not found' });
            }

            res.json({
                success: true,
                challenge
            });
        } catch (error) {
            console.error('Get challenge error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async startChallenge(req, res) {
        try {
            const userId = req.userId;
            const { challengeId } = req.params;

            const challenge = await RealWorldChallenges.startChallenge(userId, challengeId);

            res.json({
                success: true,
                challenge
            });
        } catch (error) {
            console.error('Start challenge error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async submitChallenge(req, res) {
        try {
            const userId = req.userId;
            const { challengeId } = req.params;
            const { solution, timeSpent } = req.body;

            const challenge = await RealWorldChallenges.getChallengeById(challengeId);

            if (!challenge) {
                return res.status(404).json({ message: 'Challenge not found' });
            }

            // Get AI evaluation of the solution
            const evaluation = await openAIService.evaluateChallengeSolution(challenge, solution);

            // Calculate score based on AI evaluation
            const score = evaluation.overallScore || 70;
            const pointsEarned = Math.floor((score / 100) * (challenge.points_reward || 100));

            // Save results
            const result = await RealWorldChallenges.submitSolution(
                userId, challengeId, solution, timeSpent, score, evaluation
            );

            // Award points
            if (pointsEarned > 0) {
                await Gamification.awardPoints(userId, pointsEarned, 'challenge_completion', challengeId);
            }

            // Check for badges
            const newBadges = await Gamification.checkAndAwardBadges(userId);

            res.json({
                success: true,
                result: {
                    score,
                    pointsEarned,
                    feedback: evaluation.feedback,
                    strengths: evaluation.strengths || [],
                    improvements: evaluation.improvements || [],
                    sampleSolution: challenge.sample_solution || challenge.solution_explanation,
                    newBadges
                }
            });
        } catch (error) {
            console.error('Submit challenge error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getUserChallenges(req, res) {
        try {
            const userId = req.userId;
            const challenges = await RealWorldChallenges.getUserChallenges(userId);

            res.json({
                success: true,
                challenges
            });
        } catch (error) {
            console.error('Get user challenges error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async generateChallenge(req, res) {
        try {
            const { category, difficulty, industry } = req.body;
            const userId = req.userId;

            // Get user context for personalized challenge
            const userProfile = await UserProfile.findByUserId(userId);

            // Generate AI-powered challenge
            const challenge = await openAIService.generateChallenge(
                category, difficulty, industry || userProfile?.industry
            );

            // Save to database
            const savedChallenge = await RealWorldChallenges.createChallenge({
                ...challenge,
                created_by: userId
            });

            res.json({
                success: true,
                challenge: savedChallenge
            });
        } catch (error) {
            console.error('Generate challenge error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

// Export an instance of the controller
const challengeController = new ChallengeController();
module.exports = challengeController;