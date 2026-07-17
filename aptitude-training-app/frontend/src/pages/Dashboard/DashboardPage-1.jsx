import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Award,
    Clock,
    Target,
    Calendar,
    BookOpen,
    BarChart3,
    ChevronRight,
    Activity,
    Zap,
    Users,
    CheckCircle,
    Circle,
    Play,
    Star,
    Flame,
    Brain,
    MessageCircle,
    Bell,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import { useAuth } from '../../context/AuthContext';
import { getMe, getLearningPath, getPerformanceAnalytics, getAchievements } from '../../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [learningPath, setLearningPath] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all dashboard data in parallel
            const [userData, pathData, analyticsData, achievementsData] = await Promise.all([
                getMe(),
                getLearningPath().catch(() => null),
                getPerformanceAnalytics().catch(() => null),
                getAchievements().catch(() => [])
            ]);

            setAnalytics(analyticsData || getDefaultAnalytics());
            setLearningPath(pathData?.learningPath || getDefaultLearningPath());
            setAchievements(achievementsData || getDefaultAchievements());
            setRecentActivity(getDefaultRecentActivity());
            setUpcomingTasks(getDefaultUpcomingTasks());

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set default data if API fails
            setAnalytics(getDefaultAnalytics());
            setLearningPath(getDefaultLearningPath());
            setAchievements(getDefaultAchievements());
            setRecentActivity(getDefaultRecentActivity());
            setUpcomingTasks(getDefaultUpcomingTasks());
            toast.error('Failed to load some dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Default data for demo/new users
    const getDefaultAnalytics = () => ({
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
    });

    const getDefaultLearningPath = () => ({
        modules: [
            { id: 1, name: 'Quantitative Aptitude', progress: 75, status: 'in-progress', estimatedHours: 25 },
            { id: 2, name: 'Logical Reasoning', progress: 45, status: 'in-progress', estimatedHours: 20 },
            { id: 3, name: 'Data Interpretation', progress: 20, status: 'in-progress', estimatedHours: 25 },
            { id: 4, name: 'Verbal Ability', progress: 0, status: 'locked', estimatedHours: 15 }
        ],
        currentModule: { id: 1, name: 'Quantitative Aptitude', lesson: 'Percentages & Ratios' }
    });

    const getDefaultAchievements = () => [
        { id: 1, name: 'Quick Learner', description: 'Completed 5 modules', unlocked: true, icon: Zap },
        { id: 2, name: 'Perfect Score', description: 'Got 100% on a quiz', unlocked: false, icon: Award },
        { id: 3, name: '7 Day Streak', description: 'Studied for 7 days straight', unlocked: true, icon: Flame },
        { id: 4, name: 'Speed Demon', description: 'Completed test under time', unlocked: false, icon: Zap }
    ];

    const getDefaultRecentActivity = () => [
        { id: 1, type: 'quiz', title: 'Quantitative Aptitude Quiz', score: 85, date: '2 hours ago', status: 'completed' },
        { id: 2, type: 'lesson', title: 'Logical Reasoning: Patterns', progress: 75, date: 'Yesterday', status: 'in-progress' },
        { id: 3, type: 'mock', title: 'Full Mock Test #3', score: 78, date: '2 days ago', status: 'completed' },
        { id: 4, type: 'lesson', title: 'Data Interpretation Basics', progress: 100, date: '3 days ago', status: 'completed' }
    ];

    const getDefaultUpcomingTasks = () => [
        { id: 1, title: 'Complete Quantitative Module', due: 'Today', priority: 'high' },
        { id: 2, title: 'Take Weekly Assessment', due: 'Tomorrow', priority: 'medium' },
        { id: 3, title: 'Review Weak Areas', due: 'Mar 25', priority: 'low' }
    ];

    const stats = [
        {
            icon: TrendingUp,
            label: 'Overall Progress',
            value: `${analytics?.overallProgress || 0}%`,
            change: '+12%',
            color: 'blue',
            subtext: `${learningPath?.modules?.filter(m => m.progress === 100).length || 0}/${learningPath?.modules?.length || 4} modules`
        },
        {
            icon: Flame,
            label: 'Current Streak',
            value: `${analytics?.streak || 0} days`,
            change: '+3 days',
            color: 'orange',
            subtext: 'Best: 21 days'
        },
        {
            icon: Clock,
            label: 'Study Time',
            value: `${analytics?.totalStudyTime || 0} hrs`,
            change: '+8 hrs',
            color: 'purple',
            subtext: 'This week: 12 hrs'
        },
        {
            icon: Target,
            label: 'Avg. Accuracy',
            value: `${analytics?.averageAccuracy || 0}%`,
            change: '+5%',
            color: 'green',
            subtext: 'Target: 90%'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.fullName?.split(' ')[0] || 'Learner'}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${stat.color}-500 hover:shadow-md transition`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                                    <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Learning Progress */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Continue Learning Section */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Continue Learning</h2>
                                    <Link to="/learning-path" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        View All
                                    </Link>
                                </div>

                                {learningPath?.currentModule && (
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-600">Current Module</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">{learningPath.currentModule.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1">Lesson: {learningPath.currentModule.lesson}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {learningPath.modules?.find(m => m.id === learningPath.currentModule.id)?.progress || 0}%
                                                </div>
                                                <p className="text-xs text-gray-500">Complete</p>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                            <div
                                                className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                                                style={{ width: `${learningPath.modules?.find(m => m.id === learningPath.currentModule.id)?.progress || 0}%` }}
                                            />
                                        </div>

                                        <Link
                                            to="/learning-path"
                                            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                                        >
                                            Continue Lesson
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                )}

                                {/* Module Progress List */}
                                <div className="mt-6 space-y-4">
                                    <h3 className="font-semibold text-gray-700">Your Modules</h3>
                                    {learningPath?.modules?.map((module) => (
                                        <div key={module.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                            <div className="flex items-center space-x-3 flex-1">
                                                {module.progress === 100 ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : module.status === 'locked' ? (
                                                    <Circle className="w-5 h-5 text-gray-300" />
                                                ) : (
                                                    <Play className="w-5 h-5 text-blue-500" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium">{module.name}</span>
                                                        <span className="text-sm text-gray-500">{module.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`rounded-full h-1.5 transition-all ${module.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                                                                }`}
                                                            style={{ width: `${module.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Chart */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Performance Overview</h2>
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
                                        <option>Last 7 days</option>
                                        <option>Last 30 days</option>
                                        <option>Last 3 months</option>
                                    </select>
                                </div>

                                <div className="h-64">
                                    <div className="flex items-end justify-between h-48 mb-4">
                                        {analytics?.weeklyData?.map((value, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1">
                                                <div
                                                    className="w-full max-w-[40px] bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                                                    style={{ height: `${(value / 100) * 160}px` }}
                                                />
                                                <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Performance */}
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="font-semibold text-gray-700 mb-3">Performance by Category</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(analytics?.categoryScores || {}).map(([category, score]) => (
                                            <div key={category}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{category}</span>
                                                    <span className="font-medium">{score}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`rounded-full h-2 ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                                <div className="space-y-3">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full ${activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`} />
                                                <div>
                                                    <p className="font-medium">{activity.title}</p>
                                                    <p className="text-sm text-gray-500">{activity.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {activity.score ? (
                                                    <span className="font-semibold text-green-600">{activity.score}%</span>
                                                ) : (
                                                    <span className="text-sm text-gray-600">{activity.progress}% complete</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/learning-path" className="mt-4 text-blue-600 text-sm font-medium hover:underline inline-block">
                                    View All Activity →
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Upcoming Tasks */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
                                <div className="space-y-3">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition">
                                            <div>
                                                <p className="font-medium">{task.title}</p>
                                                <p className="text-sm text-gray-500">Due: {task.due}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-green-100 text-green-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                                    View Calendar →
                                </button>
                            </div>

                            {/* Achievements */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Achievements</h2>
                                    <Award className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="space-y-3">
                                    {achievements.map((achievement) => (
                                        <div key={achievement.id} className={`flex items-center space-x-3 p-2 rounded ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50 opacity-60'
                                            }`}>
                                            <achievement.icon className={`w-8 h-8 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                                                }`} />
                                            <div className="flex-1">
                                                <p className="font-medium">{achievement.name}</p>
                                                <p className="text-xs text-gray-500">{achievement.description}</p>
                                            </div>
                                            {achievement.unlocked && (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Ready for a challenge?</h3>
                                <p className="text-blue-100 text-sm mb-4">Take a quick 10-question quiz to test your skills</p>
                                <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                                    Start Quick Quiz
                                </button>
                            </div>

                            {/* Tips Section */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold">AI Tip of the Day</h3>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Based on your performance, focus on practicing Data Interpretation questions.
                                    You're showing improvement in this area!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;