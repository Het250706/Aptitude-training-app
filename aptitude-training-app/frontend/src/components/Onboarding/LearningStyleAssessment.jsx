import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Ear, BookOpen, Activity, ChevronRight, Loader } from 'lucide-react';
import { submitLearningStyleAssessment, getLearningStyleQuestions } from '../../services/api';
import toast from 'react-hot-toast';

const LearningStyleAssessment = ({ onComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const styleIcons = {
        visual: { icon: Eye, color: 'blue', label: 'Visual Learner' },
        auditory: { icon: Ear, color: 'green', label: 'Auditory Learner' },
        reading: { icon: BookOpen, color: 'purple', label: 'Reading/Writing Learner' },
        kinesthetic: { icon: Activity, color: 'orange', label: 'Kinesthetic Learner' }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await getLearningStyleQuestions();
            setQuestions(response);
            setAnswers(new Array(response.length).fill(null));
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('Failed to load assessment');
            // Fallback questions if API fails
            setQuestions([
                {
                    id: 1,
                    text: "When learning something new, I prefer to:",
                    options: [
                        { text: "Watch a video or see diagrams", style: "visual" },
                        { text: "Listen to an explanation", style: "auditory" },
                        { text: "Read written instructions", style: "reading" },
                        { text: "Try it hands-on", style: "kinesthetic" }
                    ]
                },
                {
                    id: 2,
                    text: "I remember information best when:",
                    options: [
                        { text: "I see charts and graphs", style: "visual" },
                        { text: "I hear it explained", style: "auditory" },
                        { text: "I read about it", style: "reading" },
                        { text: "I practice it myself", style: "kinesthetic" }
                    ]
                }
            ]);
            setAnswers(new Array(2).fill(null));
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (selectedStyle) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = { questionId: questions[currentQuestion].id, style: selectedStyle };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            submitAssessment(newAnswers);
        }
    };

    const submitAssessment = async (finalAnswers) => {
        setSubmitting(true);
        try {
            const response = await submitLearningStyleAssessment(finalAnswers);
            toast.success('Learning style assessment completed!');
            onComplete(response.learningStyle);
        } catch (error) {
            console.error('Error submitting assessment:', error);
            toast.error('Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading assessment...</p>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>VARK Learning Style Assessment</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-8"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {question.text}
                </h3>

                <div className="space-y-3">
                    {question.options.map((option, idx) => {
                        const styleInfo = styleIcons[option.style];
                        const IconComponent = styleInfo?.icon || Activity;
                        const colorClass = styleInfo?.color || 'gray';

                        return (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(option.style)}
                                className="w-full text-left p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg bg-${colorClass}-100 group-hover:bg-${colorClass}-200 transition`}>
                                        <IconComponent className={`w-5 h-5 text-${colorClass}-600`} />
                                    </div>
                                    <span className="text-gray-700 flex-1">{option.text}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Progress Indicator Dots */}
            <div className="flex justify-center mt-6 space-x-2">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentQuestion
                                ? 'w-6 bg-blue-600'
                                : idx < currentQuestion
                                    ? 'w-2 bg-green-500'
                                    : 'w-2 bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            {submitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-6 text-center max-w-sm mx-4"
                    >
                        <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Analyzing Your Learning Style
                        </h3>
                        <p className="text-gray-600 text-sm">
                            We're determining the best way to present content for your learning preference...
                        </p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LearningStyleAssessment;