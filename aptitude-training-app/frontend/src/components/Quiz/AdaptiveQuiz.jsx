import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Star, Timer, Zap, Heart, Award,
    ChevronRight, CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { startQuiz, submitAnswer, getQuizResults } from '../../services/api';
import toast from 'react-hot-toast';

const AdaptiveQuiz = ({ onComplete }) => {
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        startQuizSession();
    }, []);

    useEffect(() => {
        if (currentQuestion && timeLeft > 0 && !showExplanation) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showExplanation && currentQuestion) {
            handleTimeout();
        }
    }, [timeLeft, currentQuestion]);

    const startQuizSession = async () => {
        try {
            const response = await startQuiz();
            setSessionId(response.sessionId);
            setCurrentQuestion(response.question);
            setTimeLeft(response.question.timeLimit || 60);
        } catch (error) {
            console.error('Error starting quiz:', error);
            toast.error('Failed to start quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer) => {
        setSelectedAnswer(answer);
        setShowExplanation(true);

        const timeTaken = (currentQuestion.timeLimit || 60) - timeLeft;

        try {
            const response = await submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                answer,
                timeTaken
            });

            if (response.isCorrect) {
                setScore(prev => prev + response.pointsEarned);
                setStreak(prev => prev + 1);
                toast.success(`+${response.pointsEarned} points!`);
            } else {
                setStreak(0);
            }

            if (response.nextQuestion) {
                setTimeout(() => {
                    setCurrentQuestion(response.nextQuestion);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    setTimeLeft(response.nextQuestion.timeLimit || 60);
                    setQuestionNumber(prev => prev + 1);
                }, 3000);
            } else if (response.session) {
                // Quiz completed
                setQuizCompleted(true);
                setResults(response.session);
                if (onComplete) onComplete(response.session);

                if (response.session.newBadges?.length) {
                    toast.success(`🎉 New badges unlocked: ${response.session.newBadges.join(', ')}`);
                }
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            toast.error('Failed to submit answer');
        }
    };

    const handleTimeout = () => {
        handleAnswer(null);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-500 bg-green-100';
            case 'intermediate': return 'text-yellow-500 bg-yellow-100';
            case 'advanced': return 'text-orange-500 bg-orange-100';
            case 'expert': return 'text-red-500 bg-red-100';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your adaptive quiz...</p>
                </div>
            </div>
        );
    }

    if (quizCompleted && results) {
        const percentage = Math.round((results.correct_answers / results.questions_answered) * 100);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
                    <Trophy className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-gray-600 mb-6">Great effort! Here's how you performed:</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="text-2xl font-bold text-blue-600">{results.total_points} pts</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="text-2xl font-bold text-green-600">{percentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Correct</p>
                        <p className="text-2xl font-bold text-purple-600">{results.correct_answers}/{results.questions_answered}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Best Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{results.current_streak}</p>
                    </div>
                </div>

                {results.newBadges?.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold mb-2">🎉 New Badges Earned!</h3>
                        <div className="flex flex-wrap gap-2">
                            {results.newBadges.map((badge, idx) => (
                                <span key={idx} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Start New Quiz
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Quiz Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">{score} pts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <span className="font-semibold">{streak} streak</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Timer className="w-5 h-5 text-red-500" />
                        <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                            {timeLeft}s
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Question {questionNumber}/10
                    </div>
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-blue-600 rounded-full h-1.5 transition-all"
                        style={{ width: `${(questionNumber / 10) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion?.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion?.difficulty)}`}>
                            {currentQuestion?.difficulty?.toUpperCase() || 'INTERMEDIATE'}
                        </span>
                        <span className="text-sm text-gray-500">+{currentQuestion?.points || 10} pts</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {currentQuestion?.text}
                    </h3>

                    {currentQuestion?.type === 'mcq' && currentQuestion?.options && (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !showExplanation && handleAnswer(option)}
                                    disabled={showExplanation}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${showExplanation && selectedAnswer === option
                                            ? option === currentQuestion.correctAnswer
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-red-500 bg-red-50'
                                            : showExplanation && option === currentQuestion.correctAnswer
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                        } ${!showExplanation && 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {showExplanation && option === currentQuestion.correctAnswer && (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        )}
                                        {showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-blue-50 rounded-xl"
                        >
                            <p className="text-sm text-blue-800">
                                <strong>Explanation:</strong> {currentQuestion?.explanation}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="mt-6 flex justify-center space-x-2">
                {[...Array(10)].map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${idx < questionNumber
                                ? 'w-4 bg-blue-600'
                                : idx === questionNumber
                                    ? 'w-6 bg-blue-300'
                                    : 'w-2 bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdaptiveQuiz;