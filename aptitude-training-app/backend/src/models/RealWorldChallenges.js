const db = require('../config/database');

class RealWorldChallenges {
    static async getChallenges(category = null, difficulty = null) {
        let query = 'SELECT * FROM challenges WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = $' + (params.length + 1);
            params.push(category);
        }
        if (difficulty) {
            query += ' AND difficulty_level = $' + (params.length + 1);
            params.push(difficulty);
        }

        query += ' ORDER BY difficulty_level ASC';

        const result = await db.query(query, params);
        return result.rows;
    }

    static async getChallengeById(challengeId) {
        const query = 'SELECT * FROM challenges WHERE id = $1';
        const result = await db.query(query, [challengeId]);
        return result.rows[0];
    }

    static async startChallenge(userId, challengeId) {
        const query = `
      INSERT INTO user_challenges (user_id, challenge_id, status, started_at)
      VALUES ($1, $2, 'started', CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, challenge_id) 
      DO UPDATE SET status = 'started', started_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
        const result = await db.query(query, [userId, challengeId]);
        return result.rows[0];
    }

    static async submitSolution(userId, challengeId, solution, timeSpent) {
        // Evaluate solution
        const challenge = await this.getChallengeById(challengeId);
        const evaluation = await this.evaluateSolution(challenge, solution);

        const query = `
      UPDATE user_challenges 
      SET user_solution = $1,
          score = $2,
          status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          feedback = $3
      WHERE user_id = $4 AND challenge_id = $5
      RETURNING *
    `;
        const result = await db.query(query, [
            solution, evaluation.score, JSON.stringify(evaluation.feedback),
            userId, challengeId
        ]);

        return {
            ...result.rows[0],
            evaluation
        };
    }

    static async evaluateSolution(challenge, solution) {
        let score = 0;
        let feedback = [];

        switch (challenge.challenge_type) {
            case 'coding':
                score = await this.evaluateCodeSolution(solution, challenge.test_cases);
                feedback = this.generateCodeFeedback(score, challenge.test_cases);
                break;
            case 'scenario':
                score = this.evaluateScenarioSolution(solution, challenge.content.criteria);
                feedback = this.generateScenarioFeedback(score, challenge.content.criteria);
                break;
            case 'puzzle':
                score = this.evaluatePuzzleSolution(solution, challenge.correct_answer);
                feedback = this.generatePuzzleFeedback(score);
                break;
            case 'case_study':
                score = this.evaluateCaseStudy(solution, challenge.content.rubric);
                feedback = this.generateCaseStudyFeedback(score, challenge.content.rubric);
                break;
        }

        return { score, feedback };
    }

    // Add these methods to the RealWorldChallenges class

    static async createChallenge(challengeData) {
        const query = `
    INSERT INTO challenges (
      title, description, category, challenge_type, difficulty_level, 
      content, initial_code, test_cases, solution_explanation, 
      time_limit, points_reward, experience_reward
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;

        const values = [
            challengeData.title,
            challengeData.description,
            challengeData.category,
            challengeData.challengeType,
            challengeData.difficultyLevel,
            JSON.stringify(challengeData.content),
            challengeData.initialCode || null,
            challengeData.testCases ? JSON.stringify(challengeData.testCases) : null,
            challengeData.solutionExplanation,
            challengeData.timeLimit || 60,
            challengeData.pointsReward || 100,
            challengeData.experienceReward || 50
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async submitSolution(userId, challengeId, solution, timeSpent, score, evaluation) {
        const query = `
    UPDATE user_challenges 
    SET user_solution = $1,
        score = $2,
        status = 'completed',
        completed_at = CURRENT_TIMESTAMP,
        feedback = $3,
        attempts = attempts + 1
    WHERE user_id = $4 AND challenge_id = $5
    RETURNING *
  `;

        const values = [solution, score, JSON.stringify(evaluation), userId, challengeId];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async evaluateCodeSolution(code, testCases) {
        // This would integrate with a code execution service
        // For now, return a mock score based on test cases
        if (!code || code.length < 10) return 0;
        if (code.includes('console.log') && code.includes('function')) return 85;
        return 70;
    }

    static evaluateScenarioSolution(solution, criteria) {
        const keywords = criteria.keywords || [];
        const solutionLower = solution.toLowerCase();
        const matchedKeywords = keywords.filter(k => solutionLower.includes(k.toLowerCase()));
        return Math.floor((matchedKeywords.length / keywords.length) * 100);
    }

    static evaluatePuzzleSolution(solution, correctAnswer) {
        return solution.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 100 : 0;
    }

    static evaluateCaseStudy(solution, rubric) {
        // Evaluate against rubric points
        let totalScore = 0;
        for (const criteria of rubric) {
            if (solution.toLowerCase().includes(criteria.keyword.toLowerCase())) {
                totalScore += criteria.points;
            }
        }
        return Math.min(100, totalScore);
    }

    static generateCodeFeedback(score, testCases) {
        if (score >= 90) {
            return [{ type: 'success', message: 'Excellent solution! All test cases passed.' }];
        } else if (score >= 70) {
            return [{ type: 'warning', message: 'Good attempt! Some test cases failed. Check edge cases.' }];
        } else {
            return [{ type: 'error', message: 'Solution needs improvement. Review the problem requirements.' }];
        }
    }

    static generateScenarioFeedback(score, criteria) {
        return [{
            type: score >= 70 ? 'success' : 'info',
            message: score >= 70 ? 'Good analysis!' : 'Consider these factors in your analysis...'
        }];
    }

    static generatePuzzleFeedback(score) {
        return [{
            type: score === 100 ? 'success' : 'info',
            message: score === 100 ? 'Perfect! Great problem solving!' : 'Try a different approach.'
        }];
    }

    static generateCaseStudyFeedback(score, rubric) {
        const feedback = [];
        if (score < 70) {
            feedback.push({ type: 'info', message: 'Consider addressing all key points in the rubric.' });
        }
        return feedback;
    }

    static async getUserChallenges(userId) {
        const query = `
      SELECT uc.*, c.title, c.category, c.difficulty_level, c.points_reward
      FROM user_challenges uc
      JOIN challenges c ON uc.challenge_id = c.id
      WHERE uc.user_id = $1
      ORDER BY uc.completed_at DESC NULLS LAST
    `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }
}

module.exports = RealWorldChallenges;