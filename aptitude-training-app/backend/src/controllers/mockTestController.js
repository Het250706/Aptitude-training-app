const openAIService = require('../services/openaiService');
const Gamification = require('../models/Gamification');
const db = require('../config/database');

class MockTestController {
    constructor() {
        this.generateMockTest = this.generateMockTest.bind(this);
        this.submitMockTest = this.submitMockTest.bind(this);
    }

    async generateMockTest(req, res) {
        try {
            const { examType, sectionCount = 4, totalQuestions = 20 } = req.body;
            const userId = req.userId;

            // Get user's weak areas for personalized mock test
            const userPerformance = await this.getUserWeakAreas(userId);

            // Generate AI-powered mock test
            const mockTest = await openAIService.generateMockTest(
                examType, sectionCount, totalQuestions, userPerformance
            );

            // Create test session
            const sessionId = await this.createMockTestSession(userId, mockTest);

            res.json({
                success: true,
                sessionId,
                mockTest: {
                    name: mockTest.testName,
                    totalQuestions: mockTest.totalQuestions,
                    totalTime: mockTest.totalTime,
                    sections: mockTest.sections?.map(section => ({
                        name: section.name,
                        questionCount: section.questionCount,
                        questions: section.questions?.map(q => ({
                            id: q.id,
                            text: q.text,
                            options: q.options,
                            type: q.questionType,
                            points: q.points
                        }))
                    })) || []
                }
            });
        } catch (error) {
            console.error('Generate mock test error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async submitMockTest(req, res) {
        try {
            const { sessionId, answers, timeTaken } = req.body;
            const userId = req.userId;

            // Get test data
            const testData = await this.getMockTestSession(sessionId);

            if (!testData) {
                return res.status(404).json({ message: 'Test session not found' });
            }

            // Analyze each answer with AI
            const analyzedAnswers = [];
            let totalScore = 0;
            let sectionScores = {};

            for (const answer of answers) {
                const question = testData.questions?.find(q => q.id === answer.questionId);
                if (question) {
                    const analysis = await openAIService.analyzeAnswer(question, answer.userAnswer, answer.timeTaken);

                    analyzedAnswers.push({
                        ...answer,
                        analysis
                    });

                    if (analysis.isCorrect) {
                        totalScore += question.points || 10;
                        sectionScores[question.section] = (sectionScores[question.section] || 0) + (question.points || 10);
                    }
                }
            }

            // Generate overall performance analysis
            const performanceAnalysis = await openAIService.analyzeMockTestPerformance(
                testData, { sectionScores }, totalScore
            );

            // Calculate percentile
            const percentile = await this.calculatePercentile(userId, totalScore);

            // Award points based on performance
            const pointsEarned = Math.floor(totalScore * 0.5);
            if (pointsEarned > 0) {
                await Gamification.awardPoints(userId, pointsEarned, 'mock_test_completion', sessionId);
            }

            // Check for badges
            const newBadges = await Gamification.checkAndAwardBadges(userId);

            res.json({
                success: true,
                results: {
                    totalScore,
                    maxScore: testData.totalPoints || (testData.totalQuestions * 10),
                    percentage: (totalScore / (testData.totalPoints || (testData.totalQuestions * 10))) * 100,
                    percentile,
                    sectionScores,
                    performanceAnalysis: {
                        strengths: performanceAnalysis.strengths || [],
                        weaknesses: performanceAnalysis.weaknesses || [],
                        recommendations: performanceAnalysis.recommendations || [],
                        timeManagement: performanceAnalysis.timeManagement || "Good"
                    },
                    detailedAnswers: analyzedAnswers,
                    pointsEarned,
                    newBadges
                }
            });
        } catch (error) {
            console.error('Submit mock test error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getUserWeakAreas(userId) {
        try {
            const query = `
        SELECT q.category as topic, 
               COUNT(*) as attempts,
               SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) as correct_count
        FROM quiz_responses qr
        JOIN quiz_sessions qs ON qr.session_id = qs.id
        JOIN adaptive_questions q ON qr.question_id = q.id
        WHERE qs.user_id = $1
        GROUP BY q.category
        HAVING (SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END)::float / COUNT(*)) < 0.6
        ORDER BY (SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END)::float / COUNT(*)) ASC
        LIMIT 3
      `;
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Get user weak areas error:', error);
            return [];
        }
    }

    async createMockTestSession(userId, mockTest) {
        const query = `
      INSERT INTO quiz_sessions (user_id, questions_data, total_questions, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING id
    `;
        const values = [userId, JSON.stringify(mockTest), mockTest.totalQuestions];
        const result = await db.query(query, values);
        return result.rows[0].id;
    }

    async getMockTestSession(sessionId) {
        const query = 'SELECT * FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [sessionId]);
        if (result.rows[0] && result.rows[0].questions_data) {
            const testData = typeof result.rows[0].questions_data === 'string'
                ? JSON.parse(result.rows[0].questions_data)
                : result.rows[0].questions_data;
            return testData;
        }
        return null;
    }

    async calculatePercentile(userId, score) {
        try {
            const query = `
        SELECT COUNT(*) as total_users,
               COUNT(CASE WHEN total_points > $1 THEN 1 END) as users_above
        FROM leaderboard
      `;
            const result = await db.query(query, [score]);
            const totalUsers = parseInt(result.rows[0].total_users);
            const usersAbove = parseInt(result.rows[0].users_above);

            if (totalUsers === 0) return 50;
            return Math.round(((totalUsers - usersAbove) / totalUsers) * 100);
        } catch (error) {
            console.error('Calculate percentile error:', error);
            return 50;
        }
    }
}

// Export an instance of the controller
const mockTestController = new MockTestController();
module.exports = mockTestController;