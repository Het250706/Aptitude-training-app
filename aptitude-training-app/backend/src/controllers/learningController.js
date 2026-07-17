const LearningStyleAssessment = require('../models/LearningStyleAssessment');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const AdaptiveLearningPath = require('../models/AdaptiveLearningPath');
const UserProfile = require('../models/UserProfile');
const db = require('../config/database');

class LearningController {
    constructor() {
        this.submitDiagnosticAssessment = this.submitDiagnosticAssessment.bind(this);
        this.submitLearningStyleAssessment = this.submitLearningStyleAssessment.bind(this);
        this.getLearningStyleQuestions = this.getLearningStyleQuestions.bind(this);
        this.generateLearningPath = this.generateLearningPath.bind(this);
        this.getLearningPath = this.getLearningPath.bind(this);
        this.updateNodeProgress = this.updateNodeProgress.bind(this);
    }

    // Diagnostic Assessment
    async submitDiagnosticAssessment(req, res) {
        try {
            const { answers, timeTaken } = req.body;
            const userId = req.userId;

            // Analyze answers to determine skill levels
            const skillLevels = this.analyzeSkillLevels(answers);

            // Calculate baseline scores
            const baseline = this.calculateBaseline(skillLevels);

            // Identify skill gaps
            const skillGaps = this.identifySkillGaps(skillLevels);

            // Save skill gaps to database
            await SkillGapAnalysis.create(userId, skillGaps);

            // Update user profile with diagnostic results
            await UserProfile.saveDiagnosticResults(userId, {
                baseline,
                skillLevels,
                skillGaps,
                completedAt: new Date(),
                timeTaken
            });

            res.json({
                success: true,
                baseline,
                skillLevels,
                skillGaps,
                message: 'Diagnostic assessment completed'
            });
        } catch (error) {
            console.error('Diagnostic assessment error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Learning Style Assessment (VARK)
    async submitLearningStyleAssessment(req, res) {
        try {
            const { answers } = req.body;
            const userId = req.userId;

            // Calculate VARK scores
            const scores = this.calculateVARKScore(answers);

            // Save to database
            const learningStyle = await LearningStyleAssessment.create(userId, scores);

            res.json({
                success: true,
                learningStyle,
                scores,
                recommendations: this.getLearningStyleRecommendations(learningStyle.primary_style)
            });
        } catch (error) {
            console.error('Learning style assessment error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get Learning Style Questions
    async getLearningStyleQuestions(req, res) {
        try {
            const questions = LearningStyleAssessment.getVARKQuestions();
            res.json(questions);
        } catch (error) {
            console.error('Get learning style questions error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Generate Personalized Learning Path
    async generateLearningPath(req, res) {
        try {
            const userId = req.userId;

            // Get user profile
            const profile = await UserProfile.findByUserId(userId);

            // Get skill gaps
            const skillGaps = await SkillGapAnalysis.findByUserId(userId);

            // Get learning style
            const learningStyle = await LearningStyleAssessment.findByUserId(userId);

            if (!skillGaps || skillGaps.length === 0) {
                return res.status(400).json({ message: 'Complete diagnostic assessment first' });
            }

            // Generate adaptive learning path
            const learningPath = await AdaptiveLearningPath.generatePath(
                userId, profile, skillGaps, learningStyle
            );

            res.json({
                success: true,
                learningPath,
                summary: {
                    totalNodes: learningPath.length,
                    estimatedHours: learningPath.reduce((sum, node) => sum + (node.estimated_duration || 0), 0) / 60,
                    focusAreas: skillGaps.filter(g => g.priority === 'critical').map(g => g.skill_category)
                }
            });
        } catch (error) {
            console.error('Generate learning path error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get User's Learning Path
    async getLearningPath(req, res) {
        try {
            const userId = req.userId;
            const learningPath = await AdaptiveLearningPath.getUserPath(userId);

            // Calculate overall progress
            const totalProgress = learningPath.reduce((sum, node) => sum + (node.user_progress || 0), 0) / (learningPath.length || 1);

            res.json({
                success: true,
                learningPath,
                overallProgress: Math.round(totalProgress),
                nextNode: learningPath.find(node => node.user_progress < 100)
            });
        } catch (error) {
            console.error('Get learning path error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Update Node Progress
    async updateNodeProgress(req, res) {
        try {
            const { nodeId, progress, timeSpent } = req.body;
            const userId = req.userId;

            const updated = await AdaptiveLearningPath.updateNodeProgress(userId, nodeId, progress, timeSpent);

            // Check if node is mastered (progress >= 80%)
            if (progress >= 80) {
                await AdaptiveLearningPath.markNodeMastered(userId, nodeId, progress);
            }

            // Get updated path to check if user should be recommended to next node
            const learningPath = await AdaptiveLearningPath.getUserPath(userId);
            const currentNode = learningPath.find(n => n.id === nodeId);
            const nextNode = learningPath.find(n => n.node_order === (currentNode?.node_order + 1));

            res.json({
                success: true,
                progress: updated,
                nextNodeRecommendation: nextNode ? {
                    id: nextNode.id,
                    title: nextNode.title,
                    type: nextNode.node_type
                } : null
            });
        } catch (error) {
            console.error('Update node progress error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Helper Functions
    analyzeSkillLevels(answers) {
        const skillCategories = {
            'Quantitative Aptitude': { score: 0, maxScore: 0 },
            'Logical Reasoning': { score: 0, maxScore: 0 },
            'Verbal Ability': { score: 0, maxScore: 0 },
            'Data Interpretation': { score: 0, maxScore: 0 }
        };

        for (const answer of answers) {
            if (skillCategories[answer.category]) {
                skillCategories[answer.category].score += answer.isCorrect ? 1 : 0;
                skillCategories[answer.category].maxScore += 1;
            }
        }

        // Calculate percentages
        const levels = {};
        for (const [category, data] of Object.entries(skillCategories)) {
            levels[category] = {
                score: data.score,
                maxScore: data.maxScore,
                percentage: data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0,
                level: this.getSkillLevel(data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0)
            };
        }

        return levels;
    }

    getSkillLevel(percentage) {
        if (percentage >= 80) return 'expert';
        if (percentage >= 60) return 'advanced';
        if (percentage >= 40) return 'intermediate';
        if (percentage >= 20) return 'beginner';
        return 'novice';
    }

    calculateBaseline(skillLevels) {
        const totalPercentage = Object.values(skillLevels).reduce((sum, s) => sum + s.percentage, 0);
        const average = totalPercentage / Object.keys(skillLevels).length;

        return {
            overallScore: Math.round(average),
            level: this.getSkillLevel(average),
            strengths: Object.entries(skillLevels)
                .filter(([_, data]) => data.percentage >= 70)
                .map(([category]) => category),
            weaknesses: Object.entries(skillLevels)
                .filter(([_, data]) => data.percentage < 40)
                .map(([category]) => category)
        };
    }

    identifySkillGaps(skillLevels) {
        const targetLevel = 80; // Target percentage
        const gaps = [];

        for (const [category, data] of Object.entries(skillLevels)) {
            const currentLevel = data.percentage;
            const gapScore = Math.max(0, targetLevel - currentLevel);

            if (gapScore > 0) {
                gaps.push({
                    skill_category: category,
                    current_level: Math.round(currentLevel),
                    target_level: targetLevel,
                    gap_score: gapScore,
                    priority: this.determinePriority(gapScore),
                    recommendations: this.generateRecommendations(category, currentLevel)
                });
            }
        }

        // Sort by priority and gap score
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return gaps.sort((a, b) => {
            return (priorityOrder[b.priority] - priorityOrder[a.priority]) || (b.gap_score - a.gap_score);
        });
    }

    determinePriority(gapScore) {
        if (gapScore >= 60) return 'critical';
        if (gapScore >= 40) return 'high';
        if (gapScore >= 20) return 'medium';
        return 'low';
    }

    generateRecommendations(skillCategory, currentLevel) {
        const recommendations = {
            'Quantitative Aptitude': [
                'Practice basic arithmetic daily',
                'Learn shortcut techniques',
                'Focus on speed and accuracy'
            ],
            'Logical Reasoning': [
                'Solve puzzles regularly',
                'Practice pattern recognition',
                'Work on analytical thinking'
            ],
            'Verbal Ability': [
                'Read newspapers daily',
                'Build vocabulary',
                'Practice comprehension'
            ],
            'Data Interpretation': [
                'Analyze charts and graphs',
                'Practice data calculation',
                'Work on approximation techniques'
            ]
        };

        return recommendations[skillCategory] || ['Focus on fundamentals', 'Regular practice', 'Review concepts'];
    }

    calculateVARKScore(answers) {
        const scores = { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };

        for (const answer of answers) {
            if (scores[answer.style] !== undefined) {
                scores[answer.style]++;
            }
        }

        // Normalize to percentages
        const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
        const percentages = {};
        for (const [style, score] of Object.entries(scores)) {
            percentages[style] = total > 0 ? Math.round((score / total) * 100) : 25;
        }

        return percentages;
    }

    getLearningStyleRecommendations(primaryStyle) {
        const recommendations = {
            visual: [
                'Use diagrams and charts',
                'Watch video tutorials',
                'Create mind maps',
                'Color-code your notes'
            ],
            auditory: [
                'Listen to audio explanations',
                'Participate in discussions',
                'Record and review lectures',
                'Use mnemonic devices'
            ],
            reading: [
                'Read written materials',
                'Take detailed notes',
                'Write summaries',
                'Use flashcards'
            ],
            kinesthetic: [
                'Practice with exercises',
                'Use interactive simulations',
                'Take frequent breaks',
                'Apply concepts practically'
            ]
        };

        return {
            primary: primaryStyle,
            tips: recommendations[primaryStyle] || recommendations.visual,
            suggestedContentTypes: this.getContentTypesForStyle(primaryStyle)
        };
    }

    getContentTypesForStyle(style) {
        const contentTypes = {
            visual: ['video', 'infographic', 'diagram', 'chart'],
            auditory: ['audio', 'podcast', 'lecture', 'discussion'],
            reading: ['article', 'documentation', 'ebook', 'summary'],
            kinesthetic: ['interactive', 'quiz', 'exercise', 'simulation']
        };
        return contentTypes[style] || contentTypes.visual;
    }
}

// Export an instance of the controller
const learningController = new LearningController();
module.exports = learningController;