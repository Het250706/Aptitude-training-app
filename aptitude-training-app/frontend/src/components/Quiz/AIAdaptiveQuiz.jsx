import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Brain, Trophy, Timer, Zap, TrendingUp,
    Lightbulb, BookOpen, ChevronRight, CheckCircle, XCircle
} from 'lucide-react';
import { startQuiz, submitAnswer } from '../../services/api';
import toast from 'react-hot-toast';

const AIAdaptiveQuiz = ({ topic, difficulty, onComplete }) => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [nextQuestionData, setNextQuestionData] = useState(null);
    const [sessionResultsData, setSessionResultsData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [results, setResults] = useState(null);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        startQuizSession();
    }, []);

    useEffect(() => {
        if (currentQuestion && timeLeft > 0 && !showAnalysis) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showAnalysis && currentQuestion) {
            handleTimeout();
        }
    }, [timeLeft, currentQuestion]);

    const startQuizSession = async () => {
        try {
            setLoading(true);
            const response = await startQuiz({ topic, difficulty });
            setSessionId(response.sessionId);
            setCurrentQuestion(response.firstQuestion);
            setTotalQuestions(response.totalQuestions || 10);
            setTimeLeft(response.firstQuestion.timeLimit || 60);
        } catch (error) {
            console.error('Error starting quiz:', error);
            toast.error('Failed to start quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (nextQuestionData) {
            setCurrentQuestion(nextQuestionData);
            setSelectedAnswer(null);
            setShowAnalysis(false);
            setShowHint(false);
            setAnalysis(null);
            setCorrectAnswer(null);
            setTimeLeft(nextQuestionData.timeLimit || 60);
            setQuestionNumber(prev => prev + 1);
            setNextQuestionData(null);
        } else if (sessionResultsData) {
            setQuizCompleted(true);
            setResults(sessionResultsData);
            if (onComplete) onComplete(sessionResultsData);
            if (sessionResultsData.newBadges?.length) {
                toast.success(`🎉 New badges unlocked: ${sessionResultsData.newBadges.join(', ')}`);
            }
        }
    };

    const handleAnswer = async (answer) => {
        setSelectedAnswer(answer);
        setShowAnalysis(true);

        const timeTaken = (currentQuestion.timeLimit || 60) - timeLeft;

        try {
            const response = await submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                answer,
                timeTaken
            });

            setAnalysis(response.analysis);
            setCorrectAnswer(response.correctAnswer);
            setScore(prev => prev + response.pointsEarned);

            if (response.analysis.isCorrect) {
                toast.success(`+${response.pointsEarned} points! ${response.analysis.feedback}`);
            } else {
                toast.info(response.analysis.feedback);
            }

            if (response.nextQuestion) {
                setNextQuestionData(response.nextQuestion);
            } else if (response.session) {
                setSessionResultsData(response.session);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            toast.error('Failed to submit answer');
        }
    };

    const handleTimeout = () => {
        handleAnswer(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is generating your personalized quiz...</p>
                    <p className="text-sm text-gray-400 mt-2">Questions tailored to your skill level</p>
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
                className="bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-gray-600">AI Analysis of Your Performance</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">Total Score</p>
                        <p className="text-2xl font-bold text-blue-600">{results.total_points} pts</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="text-2xl font-bold text-green-600">{percentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">Correct Answers</p>
                        <p className="text-2xl font-bold text-purple-600">{results.correct_answers}/{results.questions_answered}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">AI Confidence</p>
                        <p className="text-2xl font-bold text-orange-600">{results.ai_confidence || 85}%</p>
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

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">AI Recommendations</h3>
                            <p className="text-sm text-blue-800">
                                Based on your performance, focus on improving in these areas:
                            </p>
                            <ul className="mt-2 space-y-1">
                                {results.recommendations?.map((rec, idx) => (
                                    <li key={idx} className="text-sm text-blue-700 flex items-center">
                                        <ChevronRight className="w-3 h-3 mr-1" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex-1 cursor-pointer"
                    >
                        Start New AI-Powered Quiz
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="py-3 bg-gray-100 text-gray-700 border border-gray-250 rounded-lg font-semibold hover:bg-gray-200 transition flex-1 cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
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
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <span className="font-semibold">AI-Adaptive</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">{score} pts</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Timer className="w-5 h-5 text-red-500" />
                            <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                                {timeLeft}s
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Q{questionNumber}/{totalQuestions}
                        </div>
                    </div>
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full h-1.5 transition-all"
                        style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
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
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-2">
                                <Brain className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-500">AI-Generated Question</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {currentQuestion?.hints && !showHint && (
                                    <button
                                        onClick={() => setShowHint(true)}
                                        className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                                    >
                                        <Lightbulb className="w-4 h-4" />
                                        <span>Hint</span>
                                    </button>
                                )}
                                <span className="text-sm text-gray-500">+{currentQuestion?.points} pts</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            {currentQuestion?.text}
                        </h3>

                        {showHint && currentQuestion?.hints && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-purple-50 rounded-lg"
                            >
                                <p className="text-sm text-purple-800">
                                    <strong>💡 Hint:</strong> {currentQuestion.hints[0]}
                                </p>
                            </motion.div>
                        )}

                        <div className="space-y-3">
                            {currentQuestion?.options?.map((option, idx) => (
                                <button
                                     key={idx}
                                     onClick={() => !showAnalysis && handleAnswer(option)}
                                     disabled={showAnalysis}
                                     className={`w-full text-left p-4 rounded-xl border-2 transition-all ${showAnalysis && selectedAnswer === option
                                             ? option === correctAnswer
                                                 ? 'border-green-500 bg-green-50'
                                                 : 'border-red-500 bg-red-50'
                                             : showAnalysis && option === correctAnswer
                                                 ? 'border-green-500 bg-green-50'
                                                 : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                         } ${!showAnalysis && 'cursor-pointer'}`}
                                 >
                                     <div className="flex items-center justify-between">
                                         <span>{option}</span>
                                         {showAnalysis && option === correctAnswer && (
                                             <CheckCircle className="w-5 h-5 text-green-500" />
                                         )}
                                         {showAnalysis && selectedAnswer === option && option !== correctAnswer && (
                                             <XCircle className="w-5 h-5 text-red-500" />
                                         )}
                                     </div>
                                 </button>
                            ))}
                        </div>

                        {showAnalysis && analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 space-y-4"
                            >
                                <div className={`p-4 rounded-xl ${analysis.isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}>
                                    <p className={`font-medium ${analysis.isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                                        {analysis.feedback}
                                    </p>
                                </div>

                                {analysis.conceptExplanation && (
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-semibold text-blue-900 mb-2">📚 Concept Explanation</h4>
                                        <p className="text-sm text-blue-800">{analysis.conceptExplanation}</p>
                                    </div>
                                )}

                                {analysis.suggestedResources && analysis.suggestedResources.length > 0 && (
                                    <div className="p-4 bg-purple-50 rounded-xl">
                                        <h4 className="font-semibold text-purple-900 mb-2">📖 Recommended Resources</h4>
                                        <ul className="space-y-1">
                                            {analysis.suggestedResources.map((resource, idx) => (
                                                <li key={idx} className="text-sm text-purple-800 flex items-center">
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    {resource}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysis.nextSteps && (
                                    <div className="p-4 bg-teal-50 rounded-xl">
                                        <h4 className="font-semibold text-teal-900 mb-2">🎯 Next Steps</h4>
                                        <p className="text-sm text-teal-800">{analysis.nextSteps}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition cursor-pointer flex justify-center items-center gap-2 mt-4"
                                >
                                    {nextQuestionData ? 'Next Question ➡️' : 'View Results 🏆'}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="mt-6 flex justify-center space-x-2">
                {[...Array(totalQuestions)].map((_, idx) => (
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

export default AIAdaptiveQuiz;