import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp, Award, Clock, Target, BookOpen,
    ChevronRight, Zap, Flame, Brain, Sparkles,
    Loader, RefreshCw
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import { getDashboardData, getLearningContent } from '../../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingContent, setGeneratingContent] = useState(false);
    const [aiContent, setAiContent] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await getDashboardData();
            setDashboardData(response.dashboard);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            toast.error('Failed to load dashboard data');
            // Set fallback data
            setDashboardData(getFallbackData());
        } finally {
            setLoading(false);
        }
    };

    const generateAIContent = async () => {
        setGeneratingContent(true);
        try {
            const response = await getLearningContent({
                topic: dashboardData?.learningPath?.currentModule?.name || 'Aptitude',
                contentType: 'lesson'
            });
            setAiContent(response.content);
            toast.success('AI-generated content ready!');
        } catch (error) {
            console.error('Error generating content:', error);
            toast.error('Failed to generate content');
        } finally {
            setGeneratingContent(false);
        }
    };

    const getFallbackData = () => ({
        user: { name: 'Learner' },
        stats: {
            overallProgress: 0,
            totalPoints: 0,
            quizzesCompleted: 0,
            challengesCompleted: 0,
            currentStreak: 0,
            averageAccuracy: 0
        },
        learningPath: { modules: [], currentModule: null },
        recentActivity: [],
        upcomingTasks: [],
        achievements: [],
        weeklyPerformance: []
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your personalized dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            icon: TrendingUp,
            label: 'Overall Progress',
            value: `${dashboardData?.stats?.overallProgress || 0}%`,
            color: 'blue',
            subtext: 'Complete modules to advance'
        },
        {
            icon: Flame,
            label: 'Current Streak',
            value: `${dashboardData?.stats?.currentStreak || 0} days`,
            color: 'orange',
            subtext: 'Keep practicing daily'
        },
        {
            icon: Award,
            label: 'Total Points',
            value: dashboardData?.stats?.totalPoints || 0,
            color: 'yellow',
            subtext: `${dashboardData?.stats?.quizzesCompleted || 0} quizzes completed`
        },
        {
            icon: Target,
            label: 'Avg. Accuracy',
            value: `${dashboardData?.stats?.averageAccuracy || 0}%`,
            color: 'green',
            subtext: 'Aiming for 90%+'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section with AI Assistant */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {dashboardData?.user?.name?.split(' ')[0] || 'Learner'}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {dashboardData?.stats?.overallProgress === 0
                                    ? "Let's start your learning journey today!"
                                    : `You're ${dashboardData?.stats?.overallProgress}% of the way to your goal!`}
                            </p>
                        </div>
                        <button
                            onClick={generateAIContent}
                            disabled={generatingContent}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                        >
                            {generatingContent ? (
                                <Loader className="animate-spin h-5 w-5" />
                            ) : (
                                <Sparkles className="h-5 w-5" />
                            )}
                            <span>Generate AI Lesson</span>
                        </button>
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
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Generated Content Section */}
                    {aiContent && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-2">
                                    <Brain className="w-6 h-6 text-purple-600" />
                                    <h2 className="text-xl font-bold text-gray-900">AI-Generated Lesson</h2>
                                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Personalized</span>
                                </div>
                                <button
                                    onClick={() => setAiContent(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{aiContent.title}</h3>
                            <p className="text-gray-700 mb-4">{aiContent.description}</p>
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: aiContent.content?.introduction || '' }} />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">⏱️ {aiContent.estimatedTime} min read</span>
                                <button className="text-purple-600 hover:text-purple-700 font-medium">
                                    Start Learning →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Learning Path Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Your Learning Path</h2>
                                    <Link to="/learning-path" className="text-blue-600 hover:text-blue-700 text-sm">
                                        View Full Path →
                                    </Link>
                                </div>

                                {dashboardData?.learningPath?.currentModule && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-600">Current Focus</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {dashboardData.learningPath.currentModule.name}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {dashboardData.learningPath.currentModule.progress || 0}%
                                                </div>
                                                <p className="text-xs text-gray-500">Complete</p>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className="bg-blue-600 rounded-full h-2 transition-all"
                                                style={{ width: `${dashboardData.learningPath.currentModule.progress || 0}%` }}
                                            />
                                        </div>

                                        <button
                                            onClick={generateAIContent}
                                            className="text-blue-600 font-medium hover:text-blue-700 text-sm flex items-center"
                                        >
                                            Continue with AI Tutor
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700">All Modules</h3>
                                    {dashboardData?.learningPath?.modules?.map((module, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className={`w-2 h-2 rounded-full ${module.progress === 100 ? 'bg-green-500' :
                                                        module.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium">{module.name}</span>
                                                        <span className="text-sm text-gray-500">{module.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`rounded-full h-1.5 ${module.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
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

                            {/* Weekly Performance Chart */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Weekly Performance</h2>
                                <div className="h-48 flex items-end justify-between">
                                    {dashboardData?.weeklyPerformance?.map((day, idx) => (
                                        <div key={idx} className="flex flex-col items-center flex-1">
                                            <div
                                                className="w-full max-w-[40px] bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                                                style={{ height: `${(day.accuracy || 0) * 1.6}px` }}
                                            />
                                            <span className="text-xs text-gray-500 mt-2">
                                                {new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className="text-xs font-medium text-gray-700">{Math.round(day.accuracy || 0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Upcoming Tasks */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
                                {dashboardData?.upcomingTasks?.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboardData.upcomingTasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                <div>
                                                    <p className="font-medium">{task.title}</p>
                                                    <p className="text-sm text-gray-500">{task.progress}% complete</p>
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
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No pending tasks! 🎉</p>
                                )}
                            </div>

                            {/* Achievements */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Recent Achievements</h2>
                                    <Award className="w-5 h-5 text-yellow-500" />
                                </div>
                                {dashboardData?.achievements?.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboardData.achievements.map((badge, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                                                <Zap className="w-8 h-8 text-green-600" />
                                                <div>
                                                    <p className="font-medium">{badge.name}</p>
                                                    <p className="text-xs text-gray-500">Earned {new Date(badge.earned_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Complete quizzes to earn badges!</p>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Need a quick practice?</h3>
                                <p className="text-blue-100 text-sm mb-4">Generate an AI-powered quiz based on your weak areas</p>
                                <Link
                                    to="/quiz"
                                    className="block w-full text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
                                >
                                    Start AI Quiz
                                </Link>
                            </div>

                            {/* AI Tutor Tip */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold">AI Tutor Suggestion</h3>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {dashboardData?.stats?.averageAccuracy < 60
                                        ? "Focus on practicing basic concepts first. Try the 'Fundamentals' module."
                                        : dashboardData?.stats?.averageAccuracy < 80
                                            ? "You're doing great! Challenge yourself with advanced problems."
                                            : "Excellent progress! Try the expert-level challenges to push further."}
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