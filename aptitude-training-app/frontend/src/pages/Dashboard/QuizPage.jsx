import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import AdaptiveQuiz from '../../components/Quiz/AdaptiveQuiz';

const QuizPage = () => {
    const location = useLocation();
    const topic = location.state?.topic;

    const handleQuizComplete = (results) => {
        console.log('Quiz Completed:', results);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
            <Navbar />
            <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 mt-16">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                    <AdaptiveQuiz topic={topic} onComplete={handleQuizComplete} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QuizPage;
