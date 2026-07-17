import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitDiagnosticAssessment } from '../../services/api';
import toast from 'react-hot-toast';

const diagnosticQuestions = [
    {
        id: 1,
        category: 'Quantitative Aptitude',
        question: 'If a train travels 360 km in 4 hours, what is its speed in m/s?',
        options: ['20 m/s', '25 m/s', '30 m/s', '35 m/s'],
        correct: 1,
        difficulty: 'medium',
        explanation: 'Speed = 360/4 = 90 km/h = 90 * 1000/3600 = 25 m/s'
    },
    {
        id: 2,
        category: 'Logical Reasoning',
        question: 'If all Bloops are Razzies, and all Razzies are Lazzies, then which of the following is true?',
        options: [
            'All Bloops are Lazzies',
            'Some Lazzies are Bloops',
            'Both A and B',
            'Neither A nor B'
        ],
        correct: 2,
        difficulty: 'medium',
        explanation: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are Lazzies. Also, some Lazzies must be Bloops.'
    },
    {
        id: 3,
        category: 'Verbal Ability',
        question: 'Choose the word that is most nearly OPPOSITE in meaning to "EPHEMERAL"',
        options: ['Transient', 'Eternal', 'Brief', 'Fleeting'],
        correct: 1,
        difficulty: 'hard',
        explanation: 'Ephemeral means lasting for a very short time. Eternal is its opposite.'
    },
    {
        id: 4,
        category: 'Data Interpretation',
        question: 'If the price of an item increases by 20% and then decreases by 20%, what is the net percentage change?',
        options: ['0%', '4% decrease', '4% increase', '2% decrease'],
        correct: 1,
        difficulty: 'medium',
        explanation: 'Let original price = 100. After 20% increase = 120. After 20% decrease = 120 * 0.8 = 96. Net change = 4% decrease.'
    },
    {
        id: 5,
        category: 'Quantitative Aptitude',
        question: 'What is the next number in the sequence: 2, 6, 12, 20, ?',
        options: ['28', '30', '32', '36'],
        correct: 1,
        difficulty: 'easy',
        explanation: 'Differences: 4,6,8, so next difference is 10, giving 30.'
    },
    {
        id: 6,
        category: 'Logical Reasoning',
        question: 'Find the odd one out: Apple, Mango, Orange, Banana, Potato',
        options: ['Apple', 'Mango', 'Orange', 'Banana', 'Potato'],
        correct: 4,
        difficulty: 'easy',
        explanation: 'Potato is a vegetable, while others are fruits.'
    },
    {
        id: 7,
        category: 'Verbal Ability',
        question: 'Select the synonym of "MAGNANIMOUS"',
        options: ['Petty', 'Generous', 'Stingy', 'Selfish'],
        correct: 1,
        difficulty: 'hard',
        explanation: 'Magnanimous means generous or forgiving.'
    },
    {
        id: 8,
        category: 'Data Interpretation',
        question: 'If 5 workers can complete a task in 12 days, how many workers are needed to complete it in 4 days?',
        options: ['10', '12', '15', '20'],
        correct: 2,
        difficulty: 'medium',
        explanation: 'Work = 5 * 12 = 60 worker-days. For 4 days: 60/4 = 15 workers.'
    }
];

const DiagnosticAssessment = ({ profileData, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeStart] = useState(Date.now());
    const [loading, setLoading] = useState(false);

    const handleAnswer = (selectedOption) => {
        const isCorrect = selectedOption === diagnosticQuestions[currentQuestion].correct;

        setAnswers({
            ...answers,
            [diagnosticQuestions[currentQuestion].id]: {
                selected: selectedOption,
                isCorrect,
                category: diagnosticQuestions[currentQuestion].category,
                difficulty: diagnosticQuestions[currentQuestion].difficulty
            }
        });

        if (currentQuestion < diagnosticQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            submitResults();
        }
    };

    const submitResults = async () => {
        setLoading(true);

        const timeTaken = Math.floor((Date.now() - timeStart) / 1000);

        // Prepare answers array for analysis
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            category: answer.category,
            isCorrect: answer.isCorrect,
            difficulty: answer.difficulty
        }));

        try {
            const response = await submitDiagnosticAssessment({
                answers: answersArray,
                timeTaken
            });

            toast.success('Diagnostic assessment complete! Analyzing your results...');
            onComplete(response);
        } catch (error) {
            console.error('Error submitting diagnostic:', error);
            toast.error('Failed to submit assessment');
        } finally {
            setLoading(false);
        }
    };

    const question = diagnosticQuestions[currentQuestion];
    const progress = ((currentQuestion) / diagnosticQuestions.length) * 100;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-600';
            case 'medium': return 'bg-yellow-100 text-yellow-600';
            case 'hard': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestion + 1} of {diagnosticQuestions.length}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty.toUpperCase()}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mb-8">
                <div className="text-sm text-blue-600 mb-2">{question.category}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {question.question}
                </h3>

                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                        >
                            <span className="text-gray-700">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-sm text-gray-500">
                <p>Take your time to answer each question carefully.</p>
                <p>Your responses will help create your personalized learning path.</p>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Analyzing your responses...</p>
                        <p className="text-gray-500 text-sm mt-2">Creating personalized learning path</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosticAssessment;