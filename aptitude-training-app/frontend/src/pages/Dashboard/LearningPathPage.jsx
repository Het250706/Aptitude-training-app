import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    Lock,
    Play,
    ChevronRight,
    Award,
    Clock,
    Target,
    TrendingUp,
    X,
    Sparkles,
    Brain,
    CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import { getLearningContent } from '../../services/api';
import toast from 'react-hot-toast';

const LearningPathPage = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [aiContent, setAiContent] = useState(null);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const navigate = useNavigate();

    const handleRevise = async (lessonTitle) => {
        setLoadingContent(true);
        try {
            const response = await getLearningContent({
                topic: lessonTitle,
                contentType: 'lesson'
            });
            setAiContent(response.content);
            setShowLessonModal(true);
        } catch (error) {
            console.error('Error fetching lesson for revision:', error);
            toast.error('Failed to load lesson content. Please try again.');
        } finally {
            setLoadingContent(false);
        }
    };

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
                                                            <button 
                                                                onClick={() => navigate('/quiz', { state: { topic: lesson.title } })}
                                                                className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                                            >
                                                                Start
                                                            </button>
                                                        )}
                                                        {lesson.completed && (
                                                            <button 
                                                                onClick={() => handleRevise(lesson.title)}
                                                                disabled={loadingContent}
                                                                className="px-3 py-1 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm font-semibold transition flex items-center gap-1 cursor-pointer"
                                                            >
                                                                {loadingContent ? 'Loading...' : 'Revise 🔄'}
                                                            </button>
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

            {/* Study Lesson Modal */}
            {showLessonModal && aiContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                            <div>
                                <span className="text-xs uppercase tracking-widest font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    Interactive Lesson Revision
                                </span>
                                <h2 className="text-2xl font-bold mt-2">{aiContent.title}</h2>
                                <p className="text-purple-100 text-sm mt-1">{aiContent.description}</p>
                            </div>
                            <button
                                onClick={() => setShowLessonModal(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition cursor-pointer text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 overflow-y-auto flex-1 space-y-6">
                            {/* Introduction */}
                            <div className="prose max-w-none text-gray-700 leading-relaxed bg-blue-50/50 rounded-xl p-5 border-l-4 border-blue-500">
                                <div dangerouslySetInnerHTML={{ __html: aiContent.content?.introduction || '' }} />
                            </div>

                            {/* Key Concepts */}
                            {aiContent.content?.keyConcepts && (
                                <div className="space-y-6 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        Core Learning Objectives
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {aiContent.content.keyConcepts.map((concept, idx) => (
                                            <div key={idx} className="bg-gray-50 border border-gray-150 rounded-xl p-5 hover:shadow-sm transition">
                                                <h4 className="font-bold text-purple-700 mb-2">{concept.concept}</h4>
                                                <p className="text-gray-600 text-sm mb-4">{concept.explanation}</p>
                                                {concept.example && (
                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <span className="text-[10px] tracking-wider uppercase font-bold text-purple-600 block mb-1">
                                                            Practical Example
                                                        </span>
                                                        <p className="text-sm text-gray-800 font-medium italic">{concept.example}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="prose max-w-none text-gray-700 border-t border-gray-100 pt-6">
                                <div dangerouslySetInnerHTML={{ __html: aiContent.content?.summary || '' }} />
                            </div>

                            {/* Resources */}
                            {aiContent.content?.resources && (
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-5 mt-6">
                                    <h4 className="font-semibold text-purple-950 mb-2 flex items-center gap-1.5">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        Suggested Learning Materials
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {aiContent.content.resources.map((res, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-purple-200 text-purple-800 rounded-full text-xs font-semibold">
                                                📚 {res}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                Estimated Read: {aiContent.estimatedTime} minutes
                            </span>
                            <button
                                onClick={() => {
                                    setShowLessonModal(false);
                                    toast.success('📚 Lesson revision completed!');
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Done Revising
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default LearningPathPage;