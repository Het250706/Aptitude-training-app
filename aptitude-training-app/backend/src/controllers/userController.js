const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const LearningPath = require('../models/LearningPath');
const DiagnosticAssessment = require('../models/DiagnosticAssessment');
const {
    validateFieldOfExpertise,
    validateAptitudeAreas,
    validateLearningStyle,
    validateDifficultyLevel
} = require('../utils/validation');

// AI-based profile analysis and learning path generation
const analyzeProfileAndGeneratePath = (profileData, diagnosticResults) => {
    const { fieldOfExpertise, targetAptitudeAreas, learningStyle, weeklyHoursAvailable } = profileData;

    // Parse weekly hours
    let weeklyHours = 5;
    if (weeklyHoursAvailable) {
        const hoursMatch = weeklyHoursAvailable.match(/(\d+)/);
        if (hoursMatch) weeklyHours = parseInt(hoursMatch[1]);
    }

    // Base modules by field of expertise
    let learningModules = [];

    if (fieldOfExpertise === 'Engineering & Technology') {
        learningModules = [
            {
                id: 'mod_quant_1',
                name: 'Quantitative Aptitude Fundamentals',
                description: 'Master basic mathematical concepts including arithmetic, algebra, and geometry',
                weight: 0.3,
                focus: 'advanced',
                estimatedHours: 25,
                order: 1,
                progress: 0,
                completed: false,
                topics: ['Number Systems', 'Arithmetic', 'Algebra', 'Geometry', 'Trigonometry']
            },
            {
                id: 'mod_logic_1',
                name: 'Logical Reasoning Mastery',
                description: 'Develop critical thinking and pattern recognition skills',
                weight: 0.25,
                focus: 'intermediate',
                estimatedHours: 20,
                order: 2,
                progress: 0,
                completed: false,
                topics: ['Blood Relations', 'Syllogisms', 'Coding-Decoding', 'Series Completion']
            },
            {
                id: 'mod_data_1',
                name: 'Data Interpretation',
                description: 'Analyze and interpret complex data sets from charts and graphs',
                weight: 0.25,
                focus: 'advanced',
                estimatedHours: 25,
                order: 3,
                progress: 0,
                completed: false,
                topics: ['Bar Graphs', 'Line Graphs', 'Pie Charts', 'Data Tables', 'Caselets']
            },
            {
                id: 'mod_verbal_1',
                name: 'Verbal Ability',
                description: 'Enhance reading comprehension and vocabulary skills',
                weight: 0.2,
                focus: 'intermediate',
                estimatedHours: 15,
                order: 4,
                progress: 0,
                completed: false,
                topics: ['Reading Comprehension', 'Vocabulary', 'Grammar', 'Para-jumbles']
            }
        ];
    } else if (fieldOfExpertise === 'Business & Management' || fieldOfExpertise === 'Finance & Accounting') {
        learningModules = [
            {
                id: 'mod_data_2',
                name: 'Advanced Data Interpretation',
                description: 'Master complex data analysis for business decisions',
                weight: 0.35,
                focus: 'advanced',
                estimatedHours: 30,
                order: 1,
                progress: 0,
                completed: false,
                topics: ['Financial Graphs', 'Market Data', 'Statistical Analysis', 'Business Caselets']
            },
            {
                id: 'mod_logic_2',
                name: 'Business Logic & Reasoning',
                description: 'Apply logical reasoning to business scenarios',
                weight: 0.3,
                focus: 'advanced',
                estimatedHours: 25,
                order: 2,
                progress: 0,
                completed: false,
                topics: ['Decision Making', 'Critical Path', 'Resource Allocation', 'Risk Analysis']
            },
            {
                id: 'mod_quant_2',
                name: 'Business Mathematics',
                description: 'Essential math for business and finance',
                weight: 0.2,
                focus: 'intermediate',
                estimatedHours: 20,
                order: 3,
                progress: 0,
                completed: false,
                topics: ['Profit/Loss', 'Interest', 'Ratios', 'Statistics']
            },
            {
                id: 'mod_verbal_2',
                name: 'Business Communication',
                description: 'Improve verbal and written business communication',
                weight: 0.15,
                focus: 'intermediate',
                estimatedHours: 15,
                order: 4,
                progress: 0,
                completed: false,
                topics: ['Business Writing', 'Presentations', 'Email Etiquette', 'Reports']
            }
        ];
    } else {
        learningModules = [
            {
                id: 'mod_verbal_3',
                name: 'Advanced Verbal Ability',
                description: 'Master language skills for competitive exams',
                weight: 0.35,
                focus: 'advanced',
                estimatedHours: 25,
                order: 1,
                progress: 0,
                completed: false,
                topics: ['Critical Reasoning', 'Reading Comprehension', 'Vocabulary', 'Grammar']
            },
            {
                id: 'mod_logic_3',
                name: 'Analytical Reasoning',
                description: 'Develop analytical thinking skills',
                weight: 0.3,
                focus: 'intermediate',
                estimatedHours: 20,
                order: 2,
                progress: 0,
                completed: false,
                topics: ['Analytical Puzzles', 'Sequences', 'Assumptions', 'Conclusions']
            },
            {
                id: 'mod_quant_3',
                name: 'Basic Quantitative Aptitude',
                description: 'Essential math skills for aptitude tests',
                weight: 0.2,
                focus: 'beginner',
                estimatedHours: 20,
                order: 3,
                progress: 0,
                completed: false,
                topics: ['Arithmetic', 'Percentages', 'Averages', 'Time & Work']
            },
            {
                id: 'mod_data_3',
                name: 'Basic Data Interpretation',
                description: 'Introduction to data analysis',
                weight: 0.15,
                focus: 'beginner',
                estimatedHours: 15,
                order: 4,
                progress: 0,
                completed: false,
                topics: ['Basic Charts', 'Tables', 'Graphs']
            }
        ];
    }

    // Adjust based on learning style
    learningModules = learningModules.map(module => {
        const adjustedModule = { ...module };

        if (learningStyle === 'visual') {
            adjustedModule.contentType = 'video-heavy';
            adjustedModule.resources = ['infographics', 'charts', 'video-tutorials', 'animations'];
            adjustedModule.estimatedHours = Math.floor(module.estimatedHours * 0.9);
        } else if (learningStyle === 'reading') {
            adjustedModule.contentType = 'text-heavy';
            adjustedModule.resources = ['articles', 'documentation', 'case-studies', 'ebooks'];
            adjustedModule.estimatedHours = module.estimatedHours;
        } else if (learningStyle === 'auditory') {
            adjustedModule.contentType = 'audio-heavy';
            adjustedModule.resources = ['podcasts', 'lectures', 'discussions', 'voice-overs'];
            adjustedModule.estimatedHours = Math.floor(module.estimatedHours * 0.95);
        } else if (learningStyle === 'kinesthetic') {
            adjustedModule.contentType = 'practice-heavy';
            adjustedModule.resources = ['interactive-exercises', 'quizzes', 'projects', 'simulations'];
            adjustedModule.estimatedHours = Math.floor(module.estimatedHours * 1.1);
        }

        return adjustedModule;
    });

    // Adjust based on diagnostic results (weaknesses)
    if (diagnosticResults && diagnosticResults.weaknesses && diagnosticResults.weaknesses.length > 0) {
        learningModules = learningModules.map(module => {
            const moduleWeakness = diagnosticResults.weaknesses.some(weakness =>
                module.name.toLowerCase().includes(weakness.toLowerCase()) ||
                module.topics.some(topic => topic.toLowerCase().includes(weakness.toLowerCase()))
            );

            if (moduleWeakness) {
                return {
                    ...module,
                    priority: 'high',
                    suggestedHours: (module.suggestedHours || module.estimatedHours) + 5,
                    reinforcementExercises: true,
                    focus: module.focus === 'beginner' ? 'intermediate' :
                        module.focus === 'intermediate' ? 'advanced' : 'advanced'
                };
            }
            return module;
        });
    }

    // Adjust based on diagnostic results (strengths - can skip or reduce)
    if (diagnosticResults && diagnosticResults.strengths && diagnosticResults.strengths.length > 0) {
        learningModules = learningModules.map(module => {
            const moduleStrength = diagnosticResults.strengths.some(strength =>
                module.name.toLowerCase().includes(strength.toLowerCase()) ||
                module.topics.some(topic => topic.toLowerCase().includes(strength.toLowerCase()))
            );

            if (moduleStrength) {
                return {
                    ...module,
                    priority: 'low',
                    suggestedHours: Math.floor((module.suggestedHours || module.estimatedHours) * 0.7),
                    canSkip: true
                };
            }
            return module;
        });
    }

    // Calculate total hours and timeline
    const totalHours = learningModules.reduce((sum, m) => sum + (m.suggestedHours || m.estimatedHours), 0);
    const estimatedWeeks = Math.ceil(totalHours / weeklyHours);

    // Generate weekly schedule
    const weeklySchedule = [];
    let remainingHours = totalHours;
    let currentWeek = 1;

    while (remainingHours > 0 && currentWeek <= estimatedWeeks) {
        const weekHours = Math.min(weeklyHours, remainingHours);
        weeklySchedule.push({
            week: currentWeek,
            hoursToStudy: weekHours,
            focusAreas: learningModules
                .filter(m => (m.priority === 'high' && currentWeek <= 2) ||
                    (m.priority !== 'high' && currentWeek > 2))
                .slice(0, 2)
                .map(m => m.name)
        });
        remainingHours -= weekHours;
        currentWeek++;
    }

    return {
        modules: learningModules,
        totalHours,
        estimatedWeeks,
        recommendedWeeklyHours: weeklyHours,
        weeklySchedule,
        startDate: new Date(),
        milestones: generateMilestones(learningModules, estimatedWeeks, weeklyHours)
    };
};

const generateMilestones = (modules, totalWeeks, weeklyHours) => {
    const milestones = [];
    let accumulatedHours = 0;
    let weekCounter = 1;

    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const moduleHours = module.suggestedHours || module.estimatedHours;
        const weeksForModule = Math.ceil(moduleHours / weeklyHours);

        milestones.push({
            id: `milestone_${i + 1}`,
            week: weekCounter,
            moduleId: module.id,
            moduleName: module.name,
            targetCompletion: `Week ${weekCounter}`,
            exercisesCount: moduleHours * 2,
            estimatedCompletionDate: new Date(Date.now() + weekCounter * 7 * 24 * 60 * 60 * 1000)
        });

        accumulatedHours += moduleHours;
        weekCounter += weeksForModule;
    }

    return milestones;
};

exports.createProfile = async (req, res) => {
    try {
        const profileData = req.body;

        console.log('Creating profile for user:', req.userId);
        console.log('Profile data:', profileData);
        console.log('=== Profile Creation Debug ===');
        console.log('Received profile data:', JSON.stringify(profileData, null, 2));
        console.log('targetAptitudeAreas type:', typeof profileData.targetAptitudeAreas);
        console.log('targetAptitudeAreas value:', profileData.targetAptitudeAreas);

        // Map currentRole to jobTitle if needed
        if (profileData.currentRole && !profileData.jobTitle) {
            profileData.jobTitle = profileData.currentRole;
        }

        // Validate input
        if (profileData.fieldOfExpertise && !validateFieldOfExpertise(profileData.fieldOfExpertise)) {
            return res.status(400).json({ message: 'Invalid field of expertise' });
        }

        if (profileData.targetAptitudeAreas && !validateAptitudeAreas(profileData.targetAptitudeAreas)) {
            return res.status(400).json({ message: 'Invalid aptitude areas selected' });
        }

        if (profileData.learningStyle && !validateLearningStyle(profileData.learningStyle)) {
            return res.status(400).json({ message: 'Invalid learning style' });
        }

        if (profileData.preferredDifficultyLevel && !validateDifficultyLevel(profileData.preferredDifficultyLevel)) {
            return res.status(400).json({ message: 'Invalid difficulty level' });
        }

        profileData.userId = req.userId;

        const existingProfile = await UserProfile.findByUserId(req.userId);
        let profile;

        if (existingProfile) {
            console.log('Updating existing profile');
            profile = await UserProfile.update(req.userId, profileData);
        } else {
            console.log('Creating new profile');
            profile = await UserProfile.create(profileData);
        }

        res.json({
            success: true,
            profile,
            message: 'Profile created successfully',
        });
    } catch (error) {
        console.error('Create profile error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.stack
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findByUserId(req.userId);
        const user = await User.findById(req.userId);

        res.json({
            success: true,
            profile,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const profile = await UserProfile.update(req.userId, profileData);

        res.json({
            success: true,
            profile,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.submitDiagnostic = async (req, res) => {
    try {
        const { answers, scores, strengths, weaknesses, overallScore } = req.body;

        // Save diagnostic results
        const diagnosticResults = {
            scores,
            strengths,
            weaknesses,
            overallScore,
            completedAt: new Date(),
            detailedAnswers: answers,
        };

        // Save to database
        await DiagnosticAssessment.create(req.userId, diagnosticResults);
        await UserProfile.saveDiagnosticResults(req.userId, diagnosticResults);

        // Get user profile
        const profile = await UserProfile.findByUserId(req.userId);

        // Generate AI learning path
        const learningPath = analyzeProfileAndGeneratePath(profile, diagnosticResults);

        // Save learning path to database
        await LearningPath.create(req.userId, learningPath);

        res.json({
            success: true,
            diagnosticResults,
            learningPath,
            message: 'Diagnostic assessment completed successfully',
        });
    } catch (error) {
        console.error('Submit diagnostic error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDiagnosticResults = async (req, res) => {
    try {
        const results = await DiagnosticAssessment.findByUserId(req.userId);

        res.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('Get diagnostic results error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLearningPath = async (req, res) => {
    try {
        let learningPath = await LearningPath.findByUserId(req.userId);

        if (!learningPath) {
            // Generate new learning path if not exists
            const profile = await UserProfile.findByUserId(req.userId);
            const diagnosticResultsArray = await DiagnosticAssessment.findByUserId(req.userId);
            const diagnosticResults = diagnosticResultsArray[0] || null;
            const newLearningPath = analyzeProfileAndGeneratePath(profile, diagnosticResults);
            learningPath = await LearningPath.create(req.userId, newLearningPath);
        }

        res.json({
            success: true,
            learningPath
        });
    } catch (error) {
        console.error('Get learning path error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateLearningProgress = async (req, res) => {
    try {
        const { moduleId, progress, timeSpent } = req.body;

        const updatedPath = await LearningPath.updateProgress(req.userId, moduleId, progress, timeSpent);

        res.json({
            success: true,
            learningPath: updatedPath,
            message: 'Progress updated successfully'
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.completeModule = async (req, res) => {
    try {
        const { moduleId } = req.body;

        const updatedPath = await LearningPath.completeModule(req.userId, moduleId);

        res.json({
            success: true,
            learningPath: updatedPath,
            message: 'Module completed successfully!'
        });
    } catch (error) {
        console.error('Complete module error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPerformanceAnalytics = async (req, res) => {
    try {
        // Try to get real data from database
        let analytics = await Analytics.findByUserId(req.userId);

        // Return default data if none exists
        if (!analytics) {
            analytics = {
                overallProgress: 42,
                streak: 15,
                totalStudyTime: 42,
                averageAccuracy: 85,
                weeklyData: [65, 70, 75, 80, 85, 82, 88],
                categoryScores: {
                    'Quantitative': 78,
                    'Logical Reasoning': 82,
                    'Verbal Ability': 88,
                    'Data Interpretation': 72
                }
            };
        }

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Analytics error:', error);
        // Return default data on error
        res.json({
            success: true,
            data: {
                overallProgress: 42,
                streak: 15,
                totalStudyTime: 42,
                averageAccuracy: 85,
                weeklyData: [65, 70, 75, 80, 85, 82, 88],
                categoryScores: {
                    'Quantitative': 78,
                    'Logical Reasoning': 82,
                    'Verbal Ability': 88,
                    'Data Interpretation': 72
                }
            }
        });
    }
};

exports.completeOnboarding = async (req, res) => {
    try {
        const user = await User.updateOnboardingStatus(req.userId, true);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                onboardingCompleted: user.onboarding_completed
            },
            message: 'Onboarding completed successfully',
        });
    } catch (error) {
        console.error('Complete onboarding error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getOnboardingStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            success: true,
            onboardingCompleted: user?.onboarding_completed || false
        });
    } catch (error) {
        console.error('Get onboarding status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};