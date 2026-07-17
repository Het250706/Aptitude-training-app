const db = require('../config/database');
const crypto = require('crypto');

class AdaptiveQuiz {
    static async startSession(userId) {
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const query = `
      INSERT INTO quiz_sessions (user_id, session_token, current_difficulty, started_at)
      VALUES ($1, $2, 'beginner', CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const result = await db.query(query, [userId, sessionToken]);
        return result.rows[0];
    }

    static async getNextQuestion(sessionId, userPerformance = null) {
        // Get session
        const sessionQuery = 'SELECT * FROM quiz_sessions WHERE id = $1 AND status = $2';
        const sessionResult = await db.query(sessionQuery, [sessionId, 'active']);

        if (!sessionResult.rows[0]) {
            throw new Error('Invalid or completed session');
        }

        const session = sessionResult.rows[0];

        // Adjust difficulty based on performance
        let newDifficulty = session.current_difficulty;
        if (userPerformance) {
            newDifficulty = this.adjustDifficulty(session.current_difficulty, userPerformance);

            // Update session difficulty
            await db.query(
                'UPDATE quiz_sessions SET current_difficulty = $1 WHERE id = $2',
                [newDifficulty, sessionId]
            );
        }

        // Get appropriate question
        const questionQuery = `
      SELECT * FROM adaptive_questions
      WHERE difficulty_level = $1
      ORDER BY RANDOM()
      LIMIT 1
    `;
        const questionResult = await db.query(questionQuery, [newDifficulty]);

        if (!questionResult.rows[0]) {
            // Fallback to intermediate if no questions of current difficulty
            const fallbackQuery = `
        SELECT * FROM adaptive_questions
        WHERE difficulty_level = 'intermediate'
        ORDER BY RANDOM()
        LIMIT 1
      `;
            const fallbackResult = await db.query(fallbackQuery);
            return fallbackResult.rows[0];
        }

        return questionResult.rows[0];
    }

    static adjustDifficulty(currentDifficulty, performance) {
        const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = difficulties.indexOf(currentDifficulty);

        // performance: { isCorrect, timeTaken, streak }
        if (performance.isCorrect && performance.timeTaken < 30) {
            // Correct and fast - increase difficulty
            return difficulties[Math.min(currentIndex + 1, difficulties.length - 1)];
        } else if (performance.isCorrect && performance.streak >= 3) {
            // 3 correct in a row - increase difficulty
            return difficulties[Math.min(currentIndex + 1, difficulties.length - 1)];
        } else if (!performance.isCorrect && performance.streak <= -2) {
            // 2 wrong in a row - decrease difficulty
            return difficulties[Math.max(currentIndex - 1, 0)];
        } else if (!performance.isCorrect && performance.timeTaken > 60) {
            // Wrong and took too long - decrease difficulty
            return difficulties[Math.max(currentIndex - 1, 0)];
        }

        return currentDifficulty;
    }

    static async submitAnswer(sessionId, questionId, userAnswer, timeTaken) {
        // Get question
        const questionQuery = 'SELECT * FROM adaptive_questions WHERE id = $1';
        const questionResult = await db.query(questionQuery, [questionId]);
        const question = questionResult.rows[0];

        // Check answer
        const isCorrect = this.checkAnswer(question, userAnswer);

        // Get session
        const sessionQuery = 'SELECT * FROM quiz_sessions WHERE id = $1';
        const sessionResult = await db.query(sessionQuery, [sessionId]);
        const session = sessionResult.rows[0];

        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = this.calculatePoints(question.difficulty_level, timeTaken, session.current_streak);
        }

        // Update session stats
        const newStreak = isCorrect ? session.current_streak + 1 : 0;
        const updateQuery = `
      UPDATE quiz_sessions 
      SET questions_answered = questions_answered + 1,
          correct_answers = correct_answers + $1,
          current_streak = $2,
          total_points = total_points + $3
      WHERE id = $4
      RETURNING *
    `;
        const updateResult = await db.query(updateQuery, [
            isCorrect ? 1 : 0,
            newStreak,
            pointsEarned,
            sessionId
        ]);

        // Record response
        const responseQuery = `
      INSERT INTO quiz_responses 
      (session_id, question_id, user_answer, is_correct, time_taken, points_earned, difficulty_at_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        await db.query(responseQuery, [
            sessionId, questionId, userAnswer, isCorrect, timeTaken,
            pointsEarned, session.current_difficulty
        ]);

        return {
            isCorrect,
            pointsEarned,
            correctAnswer: question.correct_answer,
            explanation: question.explanation,
            newStreak,
            session: updateResult.rows[0]
        };
    }

    static checkAnswer(question, userAnswer) {
        // Handle different question types
        switch (question.question_type) {
            case 'mcq':
                return userAnswer === question.correct_answer;
            case 'coding':
                // For coding questions, we'd need to run test cases
                return this.checkCodeAnswer(userAnswer, question.test_cases);
            case 'scenario':
                // For scenario-based, check keywords or use AI
                return this.checkScenarioAnswer(userAnswer, question.correct_answer);
            default:
                return userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
        }
    }

    // Add these methods to existing AdaptiveQuiz class

    static async saveQuestionsToSession(sessionId, questions) {
        const query = `
    UPDATE quiz_sessions 
    SET questions_data = $1, total_questions = $2
    WHERE id = $3
  `;
        const values = [JSON.stringify(questions), questions.length, sessionId];
        await db.query(query, values);
    }

    static async getQuestionFromSession(sessionId, questionId) {
        const query = 'SELECT questions_data FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [sessionId]);
        if (result.rows[0] && result.rows[0].questions_data) {
            const questions = typeof result.rows[0].questions_data === 'string'
                ? JSON.parse(result.rows[0].questions_data)
                : result.rows[0].questions_data;
            return questions.find(q => q.id === questionId);
        }
        return null;
    }

    // Add these methods to the AdaptiveQuiz class

    static async saveQuestionsToSession(sessionId, questions) {
        const query = `
    UPDATE quiz_sessions 
    SET questions_data = $1, total_questions = $2
    WHERE id = $3
  `;
        const values = [JSON.stringify(questions), questions.length, sessionId];
        await db.query(query, values);
    }

    static async getQuestionFromSession(sessionId, questionId) {
        const query = 'SELECT questions_data FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [sessionId]);
        if (result.rows[0] && result.rows[0].questions_data) {
            const questions = typeof result.rows[0].questions_data === 'string'
                ? JSON.parse(result.rows[0].questions_data)
                : result.rows[0].questions_data;
            return questions.find(q => q.id === questionId);
        }
        return null;
    }

    static async saveQuestionToSession(sessionId, question) {
        const query = 'SELECT questions_data FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [sessionId]);
        if (result.rows[0]) {
            let questions = result.rows[0].questions_data;
            if (typeof questions === 'string') {
                questions = JSON.parse(questions);
            }
            questions.push(question);

            const updateQuery = `
      UPDATE quiz_sessions 
      SET questions_data = $1, total_questions = $2
      WHERE id = $3
    `;
            await db.query(updateQuery, [JSON.stringify(questions), questions.length, sessionId]);
        }
    }

    static async submitAnswerWithAnalysis(sessionId, questionId, answer, timeTaken, analysis) {
        const query = `
    INSERT INTO quiz_responses 
    (session_id, question_id, user_answer, is_correct, time_taken, points_earned, 
     ai_feedback, ai_strengths, ai_improvements)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

        const values = [
            sessionId, questionId, answer, analysis.isCorrect, timeTaken,
            analysis.isCorrect ? 10 : 0,
            analysis.feedback,
            JSON.stringify(analysis.strengths || []),
            JSON.stringify(analysis.improvements || [])
        ];

        await db.query(query, values);

        // Get current session to update stats
        const sessionQuery = 'SELECT * FROM quiz_sessions WHERE id = $1';
        const sessionResult = await db.query(sessionQuery, [sessionId]);
        const session = sessionResult.rows[0];

        const updateQuery = `
    UPDATE quiz_sessions 
    SET questions_answered = questions_answered + 1,
        correct_answers = correct_answers + $1,
        total_points = total_points + $2,
        current_streak = $3
    WHERE id = $4
    RETURNING *
  `;

        const newStreak = analysis.isCorrect ? (session.current_streak || 0) + 1 : 0;
        const pointsToAdd = analysis.isCorrect ? this.calculatePointsFromAnalysis(analysis) : 0;

        const updateResult = await db.query(updateQuery, [
            analysis.isCorrect ? 1 : 0,
            pointsToAdd,
            newStreak,
            sessionId
        ]);

        const updatedSession = updateResult.rows[0];
        updatedSession.total_questions = session.total_questions;
        updatedSession.average_time = (session.average_time || 0);

        return updatedSession;
    }

    static calculatePointsFromAnalysis(analysis) {
        if (analysis.score >= 90) return 100;
        if (analysis.score >= 70) return 70;
        if (analysis.score >= 50) return 40;
        return 10;
    }

    static async saveQuestionToSession(sessionId, question) {
        const query = 'SELECT questions_data FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [sessionId]);
        if (result.rows[0]) {
            let questions = result.rows[0].questions_data;
            if (typeof questions === 'string') {
                questions = JSON.parse(questions);
            }
            questions.push(question);

            const updateQuery = `
      UPDATE quiz_sessions 
      SET questions_data = $1, total_questions = $2
      WHERE id = $3
    `;
            await db.query(updateQuery, [JSON.stringify(questions), questions.length, sessionId]);
        }
    }

    static async submitAnswerWithAnalysis(sessionId, questionId, answer, timeTaken, analysis) {
        const query = `
    INSERT INTO quiz_responses 
    (session_id, question_id, user_answer, is_correct, time_taken, points_earned, 
     difficulty_at_time, ai_feedback, ai_strengths, ai_improvements)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

        const values = [
            sessionId, questionId, answer, analysis.isCorrect, timeTaken,
            analysis.isCorrect ? this.calculatePointsFromAnalysis(analysis) : 0,
            null, // difficulty_at_time would be set elsewhere
            analysis.feedback,
            analysis.strengths,
            analysis.improvements
        ];

        const result = await db.query(query, values);

        // Update session stats
        const updateQuery = `
    UPDATE quiz_sessions 
    SET questions_answered = questions_answered + 1,
        correct_answers = correct_answers + $1,
        total_points = total_points + $2
    WHERE id = $3
    RETURNING *
  `;
        const updateResult = await db.query(updateQuery, [
            analysis.isCorrect ? 1 : 0,
            analysis.isCorrect ? this.calculatePointsFromAnalysis(analysis) : 0,
            sessionId
        ]);

        return updateResult.rows[0];
    }

    static calculatePointsFromAnalysis(analysis) {
        // Points based on AI evaluation score
        if (analysis.score >= 90) return 100;
        if (analysis.score >= 70) return 70;
        if (analysis.score >= 50) return 40;
        return 10;
    }

    static calculatePoints(difficulty, timeTaken, streak) {
        const basePoints = {
            beginner: 10,
            intermediate: 20,
            advanced: 35,
            expert: 50
        };

        let points = basePoints[difficulty] || 10;

        // Time bonus (faster = more points)
        const timeBonus = Math.max(0, Math.floor((60 - timeTaken) / 10)) * 2;
        points += timeBonus;

        // Streak bonus
        const streakBonus = Math.floor(streak / 3) * 5;
        points += streakBonus;

        return points;
    }

    static checkCodeAnswer(userCode, testCases) {
        // This would integrate with a code execution service
        // For now, return true if code is not empty
        return userCode && userCode.length > 0;
    }

    static checkScenarioAnswer(userAnswer, correctAnswer) {
        // Use keyword matching or AI for scenario answers
        const keywords = correctAnswer.toLowerCase().split(',');
        const userAnswerLower = userAnswer.toLowerCase();
        const matchCount = keywords.filter(k => userAnswerLower.includes(k.trim())).length;
        return matchCount / keywords.length >= 0.6; // 60% keyword match
    }

    static async completeSession(sessionId) {
        const query = `
      UPDATE quiz_sessions 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await db.query(query, [sessionId]);
        return result.rows[0];
    }

    static async getSessionResults(sessionId) {
        const query = `
      SELECT qs.*, 
             json_agg(qr.*) as responses
      FROM quiz_sessions qs
      LEFT JOIN quiz_responses qr ON qs.id = qr.session_id
      WHERE qs.id = $1
      GROUP BY qs.id
    `;
        const result = await db.query(query, [sessionId]);
        return result.rows[0];
    }
}

module.exports = AdaptiveQuiz;