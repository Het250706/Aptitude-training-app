import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    Lock,
    Play,
    ChevronRight,
    Award,
    Clock,
    Target,
    TrendingUp
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const LearningPathPage = () => {
    const [selectedModule, setSelectedModule] = useState(null);

    const learningPath = {
        title: 'Your Personalized Learning Path',
        description: 'Based on your field of expertise: Engineering & Technology',
        overallProgress: 42,
        modules: [
            {
                id: 1,
                title: 'Quantitative Aptitude Fundamentals',
                description: 'Master basic mathematical concepts and operations',
                progress: 100,
                status: 'completed',
                lessons: [
                    { title: 'Number Systems', duration: '30 min', completed: true },
                    { title: 'Arithmetic Operations', duration: '45 min', completed: true },
                    { title: 'Basic Algebra', duration: '60 min', completed: true }
                ],
                estimatedTime: '5 hours',
                difficulty: 'Beginner'
            },
            {
                id: 2,
                title: 'Advanced Quantitative Techniques',
                description: 'Learn advanced problem-solving strategies',
                progress: 65,
                status: 'in-progress',
                lessons: [
                    { title: 'Percentages & Ratios', duration: '45 min', completed: true },
                    { title: 'Profit & Loss', duration: '60 min', completed: true },
                    { title: 'Averages & Mixtures', duration: '50 min', completed: false },
                    { title: 'Time & Work', duration: '55 min', completed: false }
                ],
                estimatedTime: '8 hours',
                difficulty: 'Intermediate'
            },
            {
                id: 3,
                title: 'Logical Reasoning Mastery',
                description: 'Develop critical thinking and pattern recognition',
                progress: 30,
                status: 'in-progress',
                lessons: [
                    { title: 'Blood Relations', duration: '40 min', completed: true },
                    { title: 'Syllogisms', duration: '50 min', completed: false },
                    { title: 'Coding-Decoding', duration: '45 min', completed: false },
                    { title: 'Series Completion', duration: '35 min', completed: false }
                ],
                estimatedTime: '6 hours',
                difficulty: 'Intermediate'
            },
            {
                id: 4,
                title: 'Data Interpretation',
                description: 'Analyze and interpret complex data sets',
                progress: 0,
                status: 'locked',
                lessons: [
                    { title: 'Bar Graphs & Charts', duration: '40 min', completed: false },
                    { title: 'Line Graphs', duration: '35 min', completed: false },
                    { title: 'Pie Charts', duration: '30 min', completed: false },
                    { title: 'Data Tables', duration: '45 min', completed: false }
                ],
                estimatedTime: '7 hours',
                difficulty: 'Advanced',
                prerequisite: 'Complete Module 2'
            },
            {
                id: 5,
                title: 'Verbal Ability',
                description: 'Enhance reading comprehension and vocabulary',
                progress: 0,
                status: 'locked',
                lessons: [
                    { title: 'Reading Comprehension', duration: '60 min', completed: false },
                    { title: 'Vocabulary Building', duration: '45 min', completed: false },
                    { title: 'Grammar Rules', duration: '50 min', completed: false },
                    { title: 'Para-jumbles', duration: '40 min', completed: false }
                ],
                estimatedTime: '6 hours',
                difficulty: 'Intermediate',
                prerequisite: 'Complete Module 3'
            }
        ]
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'in-progress':
                return <Play className="w-6 h-6 text-blue-500" />;
            case 'locked':
                return <Lock className="w-6 h-6 text-gray-400" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{learningPath.title}</h1>
                        <p className="text-gray-600 mt-1">{learningPath.description}</p>
                    </div>

                    {/* Overall Progress */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Overall Progress</h2>
                            <span className="text-2xl font-bold text-blue-600">{learningPath.overallProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                                style={{ width: `${learningPath.overallProgress}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Estimated completion: 4 weeks</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Target score: 90%+</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-600">AI-optimized path</span>
                            </div>
                        </div>
                    </div>

                    {/* Learning Modules */}
                    <div className="space-y-4">
                        {learningPath.modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl shadow-sm overflow-hidden ${module.status === 'locked' ? 'opacity-75' : ''
                                    }`}
                            >
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {getStatusIcon(module.status)}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-xl font-semibold">{module.title}</h3>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm text-gray-500">{module.estimatedTime}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${module.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                                                                module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                                                                    'bg-red-100 text-red-600'
                                                            }`}>
                                                            {module.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                                                {module.progress > 0 && (
                                                    <>
                                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                            <span>Progress</span>
                                                            <span>{module.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 rounded-full h-2 transition"
                                                                style={{ width: `${module.progress}%` }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {module.status === 'locked' && module.prerequisite && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Prerequisite: {module.prerequisite}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedModule === module.id ? 'rotate-90' : ''
                                            }`} />
                                    </div>
                                </div>

                                {/* Expanded Lessons */}
                                {selectedModule === module.id && module.status !== 'locked' && (
                                    <div className="border-t border-gray-100 bg-gray-50">
                                        <div className="p-6">
                                            <h4 className="font-semibold mb-3">Lessons in this module:</h4>
                                            <div className="space-y-3">
                                                {module.lessons.map((lesson, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            {lesson.completed ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{lesson.title}</p>
                                                                <p className="text-sm text-gray-500">{lesson.duration}</p>
                                                            </div>
                                                        </div>
                                                        {!lesson.completed && module.status !== 'locked' && (
                                                            <button className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                                                Start
                                                            </button>
                                                        )}
                                                        {lesson.completed && (
                                                            <span className="text-sm text-green-600">Completed</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Recommended Resources */}
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Award className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold">AI Recommendations</h3>
                        </div>
                        <p className="text-gray-700 mb-3">
                            Based on your performance, we recommend focusing on:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <ChevronRight className="w-4 h-4 text-blue-600" />
                                <span>Time & Work problems - Additional practice needed</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <ChevronRight className="w-4 h-4 text-blue-600" />
                                <span>Data interpretation with mixed charts - Review recommended</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <ChevronRight className="w-4 h-4 text-blue-600" />
                                <span>Speed up calculation techniques - 5 practice sets available</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LearningPathPage;