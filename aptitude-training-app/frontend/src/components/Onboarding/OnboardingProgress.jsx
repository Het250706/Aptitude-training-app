import React from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Brain, Sparkles } from 'lucide-react';

const OnboardingProgress = ({ currentStep }) => {
    const steps = [
        { number: 1, title: 'Profile', icon: User },
        { number: 2, title: 'Diagnostic', icon: FileText },
        { number: 3, title: 'Learning Style', icon: Brain },
        { number: 4, title: 'Your Path', icon: Sparkles }
    ];

    return (
        <div className="mb-8">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <motion.div
                        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;
                        const Icon = step.icon;

                        return (
                            <div key={step.number} className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : isCurrent
                                                ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-md'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </motion.div>

                                <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OnboardingProgress;