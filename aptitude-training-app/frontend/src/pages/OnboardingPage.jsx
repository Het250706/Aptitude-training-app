import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProfileSetup from '../components/Onboarding/ProfileSetup';
import DiagnosticAssessment from '../components/Onboarding/DiagnosticAssessment';
import LearningStyleAssessment from '../components/Onboarding/LearningStyleAssessment';
import OnboardingProgress from '../components/Onboarding/OnboardingProgress';
import { completeOnboarding, getMe, generateLearningPath } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OnboardingPage = () => {
    const [step, setStep] = useState(1);
    const [profileData, setProfileData] = useState(null);
    const [diagnosticResults, setDiagnosticResults] = useState(null);
    const [learningStyleResults, setLearningStyleResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    // Check if user is already onboarded
    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const response = await getMe();
                if (response.user.onboarding_completed) {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            }
        };
        checkOnboardingStatus();
    }, [navigate]);

    const handleProfileComplete = (data) => {
        console.log('Profile completed:', data);
        setProfileData(data);
        setStep(2);
        toast.success('Profile saved! Now let\'s assess your skills.');
    };

    const handleDiagnosticComplete = (results) => {
        console.log('Diagnostic completed:', results);
        setDiagnosticResults(results);
        setStep(3);
        toast.success('Diagnostic complete! Now let\'s understand your learning style.');
    };

    const handleLearningStyleComplete = async (learningStyle) => {
        console.log('Learning style completed:', learningStyle);
        setLearningStyleResults(learningStyle);
        setStep(4);
        setLoading(true);

        try {
            // Generate personalized learning path based on all assessments
            toast.loading('Creating your personalized learning path...', { id: 'generating' });

            const response = await generateLearningPath();
            console.log('Learning path generated:', response);

            // Complete onboarding process
            const completeResponse = await completeOnboarding();
            console.log('Onboarding completion response:', completeResponse);

            // Update user context
            if (completeResponse.user) {
                setUser(completeResponse.user);
            }

            // Update local storage
            localStorage.setItem('onboardingCompleted', 'true');
            localStorage.setItem('learningPathGenerated', 'true');

            toast.success('Your personalized learning path is ready!', { id: 'generating' });

            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Failed to generate learning path:', error);
            toast.error(error.response?.data?.message || 'Failed to generate learning path', { id: 'generating' });
            setStep(3); // Go back to learning style assessment
        } finally {
            setLoading(false);
        }
    };

    // Get step title and description
    const getStepInfo = () => {
        switch (step) {
            case 1:
                return {
                    title: 'Create Your Profile',
                    description: 'Tell us about yourself and your learning goals'
                };
            case 2:
                return {
                    title: 'Diagnostic Assessment',
                    description: 'Let\'s assess your current skill level'
                };
            case 3:
                return {
                    title: 'Learning Style Assessment',
                    description: 'Help us understand how you learn best'
                };
            case 4:
                return {
                    title: 'Creating Your Learning Path',
                    description: 'Our AI is personalizing your learning journey'
                };
            default:
                return {
                    title: 'Welcome',
                    description: 'Let\'s get started'
                };
        }
    };

    const stepInfo = getStepInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                        <span className="text-3xl font-bold text-white">AI</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        AptitudeAI
                    </h1>
                    <p className="text-gray-600 mt-2">Personalized AI-powered aptitude training</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Progress Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-1">{stepInfo.title}</h2>
                        <p className="text-blue-100">{stepInfo.description}</p>
                    </div>

                    <div className="p-8">
                        {/* Progress Indicator */}
                        <OnboardingProgress currentStep={step} />

                        {/* Step Content */}
                        <div className="mt-8">
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <ProfileSetup onComplete={handleProfileComplete} />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <DiagnosticAssessment
                                        profileData={profileData}
                                        onComplete={handleDiagnosticComplete}
                                    />
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <LearningStyleAssessment onComplete={handleLearningStyleComplete} />
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="relative">
                                        {/* Animated circles */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                        <div className="relative inline-block">
                                            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto"></div>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Creating Your Personalized Learning Path
                                        </h3>
                                        <p className="text-gray-600">
                                            Our AI is analyzing your profile, diagnostic results, and learning style
                                        </p>
                                        <div className="max-w-md mx-auto mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>✓ Profile analysis complete</span>
                                                <span className="text-green-500">100%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>✓ Diagnostic assessment processed</span>
                                                <span className="text-green-500">100%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>✓ Learning style identified</span>
                                                <span className="text-green-500">100%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-blue-600 font-medium">
                                                <span>⟳ Generating learning path</span>
                                                <span>In progress...</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Help Text */}
                        {step < 4 && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-start space-x-2 text-sm text-gray-500">
                                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>
                                        {step === 1 && "This information helps us create a personalized learning path tailored to your goals."}
                                        {step === 2 && "Answer each question to the best of your ability. This helps us identify your strengths and areas for improvement."}
                                        {step === 3 && "Choose the option that best describes your preference. There are no right or wrong answers."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Security Note */}
                <div className="text-center mt-6 text-xs text-gray-400">
                    <p>Your data is secure and will only be used to personalize your learning experience</p>
                </div>
            </div>

            {/* Loading Overlay for Path Generation */}
            {loading && step === 4 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Personalizing Your Journey
                        </h3>
                        <p className="text-gray-600">
                            Our AI is creating a custom learning path based on your unique profile...
                        </p>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 rounded-full h-2 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingPage;