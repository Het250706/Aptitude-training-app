const AdaptiveQuiz = require('../models/AdaptiveQuiz');
const Gamification = require('../models/Gamification');
const UserProfile = require('../models/UserProfile');
const openAIService = require('../services/openaiService');
const db = require('../config/database');

// Cache for generated questions to reduce API calls
const questionCache = new Map();

class QuizController {
    constructor() {
        this.startQuiz = this.startQuiz.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.getQuizResults = this.getQuizResults.bind(this);
    }

    async startQuiz(req, res) {
        try {
            const userId = req.userId;
            let { topic, difficulty = 'intermediate', questionType = 'mcq', questionCount = 10 } = req.body;

            // Resolve missing topic from user's active learning path or profile targets
            if (!topic) {
                try {
                    const activeNodeQuery = `
                        SELECT lpn.topic as module_name
                        FROM learning_path_nodes lpn
                        JOIN user_learning_progress ulp ON lpn.id = ulp.node_id
                        WHERE ulp.user_id = $1 AND ulp.progress_percentage < 100
                        LIMIT 1
                    `;
                    const nodeResult = await db.query(activeNodeQuery, [userId]);
                    if (nodeResult.rows[0]) {
                        topic = nodeResult.rows[0].module_name;
                    }
                } catch (e) {
                    console.error('Error fetching active module for quiz topic:', e.message);
                }
            }

            if (!topic) {
                try {
                    const userProfile = await UserProfile.findByUserId(userId);
                    if (userProfile && userProfile.target_aptitude_areas && userProfile.target_aptitude_areas.length > 0) {
                        topic = userProfile.target_aptitude_areas[0];
                    }
                } catch (e) {
                    console.error('Error fetching target areas for quiz topic:', e.message);
                }
            }

            if (!topic) {
                topic = 'Quantitative Aptitude'; // Absolute fallback
            }

            // Check cache for existing questions
            const cacheKey = `${topic}_${difficulty}_${questionType}`;
            let questions = questionCache.get(cacheKey);

            if (!questions) {
                // Get user context for personalized questions
                const userProfile = await UserProfile.findByUserId(userId);
                const userPerformance = await this.getUserPerformance(userId);

                const userContext = {
                    skillLevel: userProfile?.skill_level || 'intermediate',
                    performance: userPerformance?.averageScore > 70 ? 'high' : 'average',
                    learningStyle: userProfile?.learning_style || 'visual',
                    weaknesses: userPerformance?.weaknesses || []
                };

                // Generate AI-powered questions (falls back to local generators if OpenAI fails)
                const rawQuestions = await openAIService.generateQuestions(
                    topic, difficulty, questionType, questionCount, userContext
                );

                // Insert questions into database to get real database IDs (prevents foreign key check violations)
                const savedQuestions = [];
                for (const q of rawQuestions) {
                    const insertQuery = `
                        INSERT INTO adaptive_questions 
                        (category, subcategory, difficulty_level, question_type, question_text, options, correct_answer, explanation, hints, points_awarded, time_limit)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                        RETURNING id
                    `;

                    // Ensure correctAnswer is index-mapped to the text option
                    const correctText = Array.isArray(q.options) && q.correctAnswer !== undefined
                        ? String(q.options[q.correctAnswer])
                        : String(q.correctAnswer || '');

                    const values = [
                        topic,
                        q.subcategory || null,
                        difficulty,
                        questionType,
                        q.text,
                        JSON.stringify(q.options),
                        correctText,
                        q.explanation || null,
                        q.hints || [],
                        q.points || 10,
                        q.timeLimit || 60
                    ];

                    const dbResult = await db.query(insertQuery, values);
                    savedQuestions.push({
                        ...q,
                        id: dbResult.rows[0].id // Inject the database SERIAL id
                    });
                }

                questions = savedQuestions;

                // Cache for 1 hour
                questionCache.set(cacheKey, questions);
                setTimeout(() => questionCache.delete(cacheKey), 3600000);
            }

            // Create session
            const session = await AdaptiveQuiz.startSession(userId);

            // Shuffle the questions array for this specific session so users get a randomized order
            const sessionQuestions = [...questions].sort(() => 0.5 - Math.random());

            // Store questions in session
            await AdaptiveQuiz.saveQuestionsToSession(session.id, sessionQuestions);

            res.json({
                success: true,
                sessionId: session.id,
                sessionToken: session.session_token,
                totalQuestions: sessionQuestions.length,
                firstQuestion: {
                    id: sessionQuestions[0].id,
                    text: sessionQuestions[0].text,
                    type: sessionQuestions[0].questionType,
                    options: sessionQuestions[0].options,
                    timeLimit: sessionQuestions[0].timeLimit || 60,
                    points: sessionQuestions[0].points,
                    hints: sessionQuestions[0].hints
                }
            });
        } catch (error) {
            console.error('Start quiz error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async submitAnswer(req, res) {
        try {
            const { sessionId, questionId, answer, timeTaken } = req.body;
            const userId = req.userId;

            // Get question from session
            const question = await AdaptiveQuiz.getQuestionFromSession(sessionId, questionId);

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            // Get user history for AI analysis
            const userHistory = await this.getUserAnswerHistory(userId, question.topic);

            // Get AI analysis of the answer
            const analysis = await openAIService.analyzeAnswer(question, answer, timeTaken, userHistory);

            // Update session with analysis
            const result = await AdaptiveQuiz.submitAnswerWithAnalysis(
                sessionId, questionId, answer, timeTaken, analysis
            );

            // Award points based on AI evaluation
            let pointsEarned = 0;
            if (analysis.isCorrect) {
                pointsEarned = this.calculatePoints(question.difficulty, timeTaken, result.current_streak || 0);
                await Gamification.awardPoints(userId, pointsEarned, 'quiz_answer', questionId);
            }

            // Get next question (adaptive based on performance)
            let nextQuestion = null;
            if (result.questions_answered < result.total_questions) {
                try {
                    const performance = {
                        correctRate: result.correct_answers / result.questions_answered,
                        averageTime: result.average_time,
                        strengths: analysis.strengths,
                        weaknesses: analysis.improvements
                    };

                    const adaptiveQuestion = await openAIService.generateAdaptiveQuestion(
                        performance, question.difficulty, question.topic
                    );

                    if (adaptiveQuestion) {
                        nextQuestion = adaptiveQuestion;
                        await AdaptiveQuiz.saveQuestionToSession(sessionId, nextQuestion);
                    }
                } catch (err) {
                    console.error('Error generating adaptive next question, using fallback:', err.message);
                }

                if (!nextQuestion) {
                    // Fallback to pre-generated questions in session data
                    try {
                        const sessionQuery = 'SELECT questions_data FROM quiz_sessions WHERE id = $1';
                        const sessionRes = await db.query(sessionQuery, [sessionId]);
                        if (sessionRes.rows[0] && sessionRes.rows[0].questions_data) {
                            const questions = typeof sessionRes.rows[0].questions_data === 'string'
                                ? JSON.parse(sessionRes.rows[0].questions_data)
                                : sessionRes.rows[0].questions_data;
                            
                            // The next question index corresponds to result.questions_answered
                            if (questions && questions[result.questions_answered]) {
                                nextQuestion = questions[result.questions_answered];
                            }
                        }
                    } catch (e) {
                        console.error('Error loading fallback next question from session:', e.message);
                    }
                }
            }

            // Complete session if done
            let sessionResults = null;
            if (result.questions_answered >= result.total_questions) {
                const completed = await AdaptiveQuiz.completeSession(sessionId);
                sessionResults = await AdaptiveQuiz.getSessionResults(sessionId);

                // Award completion bonus
                const completionPoints = 50;
                await Gamification.awardPoints(userId, completionPoints, 'quiz_completion', sessionId);

                // Check for badges
                const newBadges = await Gamification.checkAndAwardBadges(userId);
                sessionResults.newBadges = newBadges;
            }

            res.json({
                success: true,
                correctAnswer: (Array.isArray(question.options) && question.correctAnswer !== undefined)
                    ? question.options[question.correctAnswer]
                    : question.correct_answer,
                analysis: {
                    isCorrect: analysis.isCorrect,
                    score: analysis.score,
                    feedback: analysis.feedback,
                    strengths: analysis.strengths || [],
                    improvements: analysis.improvements || [],
                    conceptExplanation: analysis.conceptExplanation,
                    suggestedResources: analysis.suggestedResources || [],
                    nextSteps: analysis.nextSteps
                },
                pointsEarned,
                nextQuestion: nextQuestion ? {
                    id: nextQuestion.id,
                    text: nextQuestion.text,
                    type: nextQuestion.questionType,
                    options: nextQuestion.options,
                    timeLimit: nextQuestion.timeLimit,
                    points: nextQuestion.points,
                    hints: nextQuestion.hints
                } : null,
                session: sessionResults || result
            });
        } catch (error) {
            console.error('Submit answer error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getQuizResults(req, res) {
        try {
            const { sessionId } = req.params;
            const results = await AdaptiveQuiz.getSessionResults(sessionId);

            res.json({
                success: true,
                results
            });
        } catch (error) {
            console.error('Get quiz results error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getUserPerformance(userId) {
        try {
            const query = `
        SELECT 
          AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) as average_score,
          AVG(time_taken) as average_time,
          json_agg(DISTINCT category) as topics_attempted
        FROM quiz_responses qr
        JOIN quiz_sessions qs ON qr.session_id = qs.id
        JOIN adaptive_questions q ON qr.question_id = q.id
        WHERE qs.user_id = $1
      `;
            const result = await db.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Get user performance error:', error);
            return null;
        }
    }

    async getUserAnswerHistory(userId, topic) {
        try {
            const query = `
        SELECT is_correct, time_taken
        FROM quiz_responses qr
        JOIN quiz_sessions qs ON qr.session_id = qs.id
        JOIN adaptive_questions q ON qr.question_id = q.id
        WHERE qs.user_id = $1 AND q.category = $2
        ORDER BY qr.answered_at DESC
        LIMIT 10
      `;
            const result = await db.query(query, [userId, topic]);
            return result.rows;
        } catch (error) {
            console.error('Get user answer history error:', error);
            return [];
        }
    }

    calculatePoints(difficulty, timeTaken, streak) {
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
}

// Export an instance of the controller
const quizController = new QuizController();
module.exports = quizController;