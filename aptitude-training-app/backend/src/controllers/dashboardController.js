const db = require('../config/database');
const UserProfile = require('../models/UserProfile');
const openAIService = require('../services/openaiService');

class DashboardController {
    constructor() {
        this.getDashboardData = this.getDashboardData.bind(this);
        this.getLearningContent = this.getLearningContent.bind(this);
        this.generateAIContent = this.generateAIContent.bind(this);
    }

    async getDashboardData(req, res) {
        try {
            const userId = req.userId;

            console.log('Fetching dashboard data for user:', userId);

            // Get user basic info
            const userQuery = 'SELECT id, full_name, email, created_at, onboarding_completed FROM users WHERE id = $1';
            const userResult = await db.query(userQuery, [userId]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get user profile
            let profile = null;
            try {
                const profileQuery = 'SELECT * FROM user_profiles WHERE user_id = $1';
                const profileResult = await db.query(profileQuery, [userId]);
                profile = profileResult.rows[0];
            } catch (error) {
                console.log('Error fetching profile:', error.message);
            }

            // Get user points - handle missing table gracefully
            let totalPoints = 0;
            let quizzesCompleted = 0;
            let challengesCompleted = 0;

            try {
                const statsQuery = `
          SELECT 
            COALESCE(SUM(points), 0) as total_points,
            COUNT(DISTINCT CASE WHEN source = 'quiz_completion' THEN source_id END) as quizzes_completed,
            COUNT(DISTINCT CASE WHEN source = 'challenge_completion' THEN source_id END) as challenges_completed
          FROM user_points
          WHERE user_id = $1
        `;
                const statsResult = await db.query(statsQuery, [userId]);
                if (statsResult.rows[0]) {
                    totalPoints = parseInt(statsResult.rows[0].total_points) || 0;
                    quizzesCompleted = parseInt(statsResult.rows[0].quizzes_completed) || 0;
                    challengesCompleted = parseInt(statsResult.rows[0].challenges_completed) || 0;
                }
            } catch (error) {
                console.log('user_points table not ready, using defaults:', error.message);
            }

            // Get user rank and streak
            let currentStreak = 0;
            let leaderboardPoints = 0;
            try {
                const rankQuery = `
          SELECT total_points, current_streak, longest_streak, rank
          FROM leaderboard
          WHERE user_id = $1
        `;
                const rankResult = await db.query(rankQuery, [userId]);
                if (rankResult.rows[0]) {
                    leaderboardPoints = parseInt(rankResult.rows[0].total_points) || 0;
                    currentStreak = parseInt(rankResult.rows[0].current_streak) || 0;
                }
            } catch (error) {
                console.log('leaderboard table not ready, using defaults:', error.message);
            }

            // Get average accuracy
            let averageAccuracy = 0;
            try {
                const accuracyQuery = `
          SELECT 
            CASE WHEN COUNT(*) > 0 
              THEN ROUND(AVG(CASE WHEN is_correct THEN 100 ELSE 0 END))
              ELSE 0 
            END as avg_accuracy
          FROM quiz_responses
          WHERE user_id = $1
        `;
                const accuracyResult = await db.query(accuracyQuery, [userId]);
                if (accuracyResult.rows[0]) {
                    averageAccuracy = parseInt(accuracyResult.rows[0].avg_accuracy) || 0;
                }
            } catch (error) {
                console.log('quiz_responses table not ready, using defaults:', error.message);
            }

            // Get recent activity
            let recentActivity = [];
            try {
                // Get recent quizzes
                const recentQuizzesQuery = `
          SELECT 
            id,
            completed_at,
            correct_answers,
            COALESCE(total_questions, 10) as total_questions,
            total_points
          FROM quiz_sessions
          WHERE user_id = $1 AND status = 'completed' AND completed_at IS NOT NULL
          ORDER BY completed_at DESC
          LIMIT 3
        `;
                const recentQuizzes = await db.query(recentQuizzesQuery, [userId]);

                // Get recent challenges
                const recentChallengesQuery = `
          SELECT 
            uc.id,
            uc.completed_at,
            uc.score,
            c.title,
            c.points_reward
          FROM user_challenges uc
          LEFT JOIN challenges c ON uc.challenge_id = c.id
          WHERE uc.user_id = $1 AND uc.status = 'completed' AND uc.completed_at IS NOT NULL
          ORDER BY uc.completed_at DESC
          LIMIT 3
        `;
                const recentChallenges = await db.query(recentChallengesQuery, [userId]);

                // Combine activities
                for (const quiz of recentQuizzes.rows) {
                    recentActivity.push({
                        type: 'quiz',
                        activity_id: quiz.id,
                        date: quiz.completed_at,
                        result: `${quiz.correct_answers}/${quiz.total_questions}`,
                        points: quiz.total_points || 0
                    });
                }

                for (const challenge of recentChallenges.rows) {
                    recentActivity.push({
                        type: 'challenge',
                        activity_id: challenge.id,
                        date: challenge.completed_at,
                        result: `${challenge.score}%`,
                        points: challenge.points_reward || 0,
                        title: challenge.title
                    });
                }

                // Sort by date
                recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.log('Error fetching recent activity:', error.message);
            }

            // Get learning path modules
            let modules = [];
            let currentModule = null;
            let overallProgress = 0;

            try {
                const learningPathQuery = `
          SELECT id, node_order, node_type, title, description, estimated_duration, difficulty_level
          FROM learning_path_nodes
          WHERE user_id = $1
          ORDER BY node_order ASC
        `;
                const learningPathResult = await db.query(learningPathQuery, [userId]);

                if (learningPathResult.rows.length > 0) {
                    let totalProgress = 0;

                    for (const node of learningPathResult.rows) {
                        const progressQuery = `
              SELECT progress_percentage, is_mastered
              FROM user_learning_progress
              WHERE user_id = $1 AND node_id = $2
            `;
                        const progressResult = await db.query(progressQuery, [userId, node.id]);
                        const progress = progressResult.rows[0]?.progress_percentage || 0;

                        totalProgress += progress;

                        const moduleData = {
                            id: node.id,
                            name: node.title,
                            progress: progress,
                            status: progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'locked',
                            estimatedHours: node.estimated_duration ? Math.ceil(node.estimated_duration / 60) : 1,
                            type: node.node_type
                        };

                        modules.push(moduleData);

                        // Find current module (first in-progress)
                        if (!currentModule && progress > 0 && progress < 100) {
                            currentModule = moduleData;
                        }
                    }

                    overallProgress = Math.round(totalProgress / learningPathResult.rows.length);
                }
            } catch (error) {
                console.log('Error fetching learning path:', error.message);
            }

            // If no modules found, create default ones
            if (modules.length === 0) {
                modules = [
                    { id: 1, name: 'Quantitative Aptitude', progress: 0, status: 'locked', estimatedHours: 5, type: 'lesson' },
                    { id: 2, name: 'Logical Reasoning', progress: 0, status: 'locked', estimatedHours: 4, type: 'lesson' },
                    { id: 3, name: 'Verbal Ability', progress: 0, status: 'locked', estimatedHours: 3, type: 'lesson' },
                    { id: 4, name: 'Data Interpretation', progress: 0, status: 'locked', estimatedHours: 4, type: 'lesson' }
                ];
                currentModule = null;
            }

            // Get upcoming tasks
            let upcomingTasks = [];
            if (modules.length > 0) {
                upcomingTasks = modules
                    .filter(m => m.progress < 100)
                    .slice(0, 3)
                    .map(m => ({
                        id: m.id,
                        title: m.name,
                        progress: m.progress,
                        priority: m.progress < 30 ? 'high' : m.progress < 70 ? 'medium' : 'low'
                    }));
            }

            // Get user achievements/badges
            let achievements = [];
            try {
                const badgesQuery = `
          SELECT b.*, ub.earned_at
          FROM user_badges ub
          JOIN badges b ON ub.badge_id = b.id
          WHERE ub.user_id = $1
          ORDER BY ub.earned_at DESC
          LIMIT 3
        `;
                const badgesResult = await db.query(badgesQuery, [userId]);
                achievements = badgesResult.rows;
            } catch (error) {
                console.log('Error fetching badges:', error.message);
            }

            // Get weekly performance
            let weeklyPerformance = [];
            try {
                const weeklyQuery = `
          SELECT 
            DATE_TRUNC('day', answered_at) as day,
            ROUND(AVG(CASE WHEN is_correct THEN 100 ELSE 0 END)) as accuracy,
            COUNT(*) as question_count
          FROM quiz_responses
          WHERE user_id = $1 AND answered_at > NOW() - INTERVAL '7 days'
          GROUP BY DATE_TRUNC('day', answered_at)
          ORDER BY day ASC
        `;
                const weeklyResult = await db.query(weeklyQuery, [userId]);
                weeklyPerformance = weeklyResult.rows;
            } catch (error) {
                console.log('Error fetching weekly performance:', error.message);
            }

            // Calculate total points
            const finalTotalPoints = totalPoints + leaderboardPoints;

            const dashboardData = {
                user: {
                    name: user.full_name || 'Learner',
                    avatar: profile?.avatar,
                    joinDate: user.created_at
                },
                stats: {
                    overallProgress: overallProgress,
                    totalPoints: finalTotalPoints,
                    quizzesCompleted: quizzesCompleted,
                    challengesCompleted: challengesCompleted,
                    currentStreak: currentStreak,
                    averageAccuracy: averageAccuracy
                },
                learningPath: {
                    modules: modules,
                    currentModule: currentModule
                },
                recentActivity: recentActivity.slice(0, 5),
                upcomingTasks: upcomingTasks,
                achievements: achievements,
                weeklyPerformance: weeklyPerformance
            };

            console.log('Dashboard data fetched successfully for user:', userId);

            res.json({
                success: true,
                dashboard: dashboardData
            });

        } catch (error) {
            console.error('Get dashboard data error:', error);

            // Return fallback data on error
            res.json({
                success: true,
                dashboard: {
                    user: {
                        name: 'Learner',
                        joinDate: new Date()
                    },
                    stats: {
                        overallProgress: 0,
                        totalPoints: 0,
                        quizzesCompleted: 0,
                        challengesCompleted: 0,
                        currentStreak: 0,
                        averageAccuracy: 0
                    },
                    learningPath: {
                        modules: [
                            { id: 1, name: 'Quantitative Aptitude', progress: 0, status: 'locked', estimatedHours: 5, type: 'lesson' },
                            { id: 2, name: 'Logical Reasoning', progress: 0, status: 'locked', estimatedHours: 4, type: 'lesson' },
                            { id: 3, name: 'Verbal Ability', progress: 0, status: 'locked', estimatedHours: 3, type: 'lesson' },
                            { id: 4, name: 'Data Interpretation', progress: 0, status: 'locked', estimatedHours: 4, type: 'lesson' }
                        ],
                        currentModule: null
                    },
                    recentActivity: [],
                    upcomingTasks: [],
                    achievements: [],
                    weeklyPerformance: []
                }
            });
        }
    }

    async getLearningContent(req, res) {
        try {
            const userId = req.userId;
            const { moduleId, topic } = req.query;

            console.log('Generating learning content for user:', userId, 'topic:', topic);

            // Get user name
            let userName = 'Learner';
            try {
                const userQuery = 'SELECT full_name FROM users WHERE id = $1';
                const userResult = await db.query(userQuery, [userId]);
                if (userResult.rows[0]) {
                    userName = userResult.rows[0].full_name.split(' ')[0];
                }
            } catch (error) {
                console.log('Error fetching user name:', error.message);
            }

            // Get learning style
            let learningStyle = 'visual';
            try {
                const learningStyleQuery = 'SELECT primary_style FROM learning_style_assessments WHERE user_id = $1';
                const learningStyleResult = await db.query(learningStyleQuery, [userId]);
                if (learningStyleResult.rows[0]) {
                    learningStyle = learningStyleResult.rows[0].primary_style;
                }
            } catch (error) {
                console.log('Error fetching learning style:', error.message);
            }

            // Generate AI-powered learning content
            const content = await openAIService.generateLearningContent({
                topic: topic || 'Aptitude Fundamentals',
                difficulty: 'intermediate',
                learningStyle: learningStyle,
                userContext: {
                    name: userName,
                    strengths: [],
                    weaknesses: []
                }
            });

            res.json({
                success: true,
                content: content || this.getFallbackLearningContent(topic || 'Aptitude')
            });

        } catch (error) {
            console.error('Get learning content error:', error);
            res.json({
                success: true,
                content: this.getFallbackLearningContent(req.query.topic || 'Aptitude')
            });
        }
    }

    async generateAIContent(req, res) {
        try {
            const { topic, contentType, difficulty } = req.body;
            const userId = req.userId;

            console.log('Generating AI content for user:', userId, 'topic:', topic);

            // Get user name
            let userName = 'Learner';
            let fieldOfExpertise = 'General';

            try {
                const userQuery = 'SELECT full_name FROM users WHERE id = $1';
                const userResult = await db.query(userQuery, [userId]);
                if (userResult.rows[0]) {
                    userName = userResult.rows[0].full_name.split(' ')[0];
                }

                const profileQuery = 'SELECT field_of_expertise FROM user_profiles WHERE user_id = $1';
                const profileResult = await db.query(profileQuery, [userId]);
                if (profileResult.rows[0] && profileResult.rows[0].field_of_expertise) {
                    fieldOfExpertise = profileResult.rows[0].field_of_expertise;
                }
            } catch (error) {
                console.log('Error fetching user context:', error.message);
            }

            // Get learning style
            let learningStyle = 'visual';
            try {
                const learningStyleQuery = 'SELECT primary_style FROM learning_style_assessments WHERE user_id = $1';
                const learningStyleResult = await db.query(learningStyleQuery, [userId]);
                if (learningStyleResult.rows[0]) {
                    learningStyle = learningStyleResult.rows[0].primary_style;
                }
            } catch (error) {
                console.log('Error fetching learning style:', error.message);
            }

            const content = await openAIService.generatePersonalizedContent({
                topic: topic || 'Aptitude',
                contentType: contentType || 'lesson',
                difficulty: difficulty || 'intermediate',
                learningStyle: learningStyle,
                userContext: {
                    name: userName,
                    fieldOfExpertise: fieldOfExpertise
                }
            });

            res.json({
                success: true,
                content: content || this.getFallbackLearningContent(topic || 'Aptitude')
            });

        } catch (error) {
            console.error('Generate AI content error:', error);
            res.json({
                success: true,
                content: this.getFallbackLearningContent(req.body.topic || 'Aptitude')
            });
        }
    }

    getFallbackLearningContent(topic) {
        return {
            title: `${topic} - Getting Started`,
            description: `Learn the fundamentals of ${topic} with this personalized lesson.`,
            content: {
                introduction: `<div class="prose max-w-none">
          <p>Welcome to your personalized lesson on <strong>${topic}</strong>!</p>
          <p>This content is designed to help you build a strong foundation in this subject area.</p>
          
          <h3>What You'll Learn:</h3>
          <ul>
            <li>Core concepts and principles of ${topic}</li>
            <li>Practical applications and real-world examples</li>
            <li>Common problem-solving strategies and techniques</li>
          </ul>
          
          <h3>Why This Matters:</h3>
          <p>Mastering ${topic} is essential for success in aptitude tests and professional assessments. This skill helps you think critically and solve problems efficiently.</p>
          
          <h3>How to Approach This Topic:</h3>
          <ul>
            <li>Start with the basics and build gradually</li>
            <li>Practice regularly with varied problems</li>
            <li>Review mistakes and understand the underlying concepts</li>
          </ul>
        </div>`,
                keyConcepts: [
                    {
                        concept: "Core Principles",
                        explanation: "Understanding the basic principles is essential for mastering this topic. Take time to grasp these fundamentals before moving to complex problems."
                    },
                    {
                        concept: "Practical Applications",
                        explanation: "Learn how to apply these concepts in real-world scenarios through examples and hands-on practice."
                    },
                    {
                        concept: "Problem-Solving Strategies",
                        explanation: "Develop systematic approaches to solve different types of problems efficiently."
                    }
                ],
                practiceQuestions: [
                    {
                        question: "What is the most important aspect to remember when studying this topic?",
                        answer: "Regular practice and understanding underlying concepts",
                        explanation: "Consistent practice helps reinforce learning and builds confidence. Understanding the 'why' behind solutions is crucial for long-term retention."
                    },
                    {
                        question: "How can you improve your speed in solving problems?",
                        answer: "Practice regularly and learn shortcut techniques",
                        explanation: "Speed comes with practice. Learn common patterns and shortcuts to solve problems faster."
                    }
                ],
                summary: "Continue practicing with our interactive exercises to reinforce your learning. Remember that mastery comes with consistent effort and practice.",
                resources: [
                    "Practice quizzes with increasing difficulty",
                    "Video tutorials explaining key concepts",
                    "Example problems with step-by-step solutions",
                    "Discussion forums for peer learning"
                ]
            },
            estimatedTime: 20,
            difficulty: "beginner"
        };
    }
}

module.exports = new DashboardController();