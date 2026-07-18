import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Landing & Onboarding Pages
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';

// Product Pages
import FeaturesPage from './pages/Product/FeaturesPage';
import PricingPage from './pages/Product/PricingPage';
import DemoPage from './pages/Product/DemoPage';
import SuccessStoriesPage from './pages/Product/SuccessStoriesPage';

// Company Pages
import AboutPage from './pages/Company/AboutPage';
import CareersPage from './pages/Company/CareersPage';
import BlogPage from './pages/Company/BlogPage';
import PressPage from './pages/Company/PressPage';

// Resource Pages
import HelpCenterPage from './pages/Resources/HelpCenterPage';
import CommunityPage from './pages/Resources/CommunityPage';
import WebinarsPage from './pages/Resources/WebinarsPage';
import ApiDocsPage from './pages/Resources/ApiDocsPage';

// Legal Pages
import PrivacyPage from './pages/Legal/PrivacyPage';
import TermsPage from './pages/Legal/TermsPage';
import CookiesPage from './pages/Legal/CookiesPage';
import GdprPage from './pages/Legal/GdprPage';

// Dashboard Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import LearningPathPage from './pages/Dashboard/LearningPathPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import QuizPage from './pages/Dashboard/QuizPage';

// Loading Component
import LoadingSpinner from './components/Common/LoadingSpinner';

import './styles/globals.css';

// Page transition wrapper
const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, requireOnboarding = true }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireOnboarding && !user?.onboardingCompleted && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    if (user?.onboardingCompleted && location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Public Route Component (redirects to dashboard if already logged in and onboarded)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated && user?.onboardingCompleted) {
        return <Navigate to="/dashboard" replace />;
    }

    if (isAuthenticated && !user?.onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

// Google OAuth Callback Handler
const AuthCallback = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const error = params.get('error');

        if (error) {
            console.error('Google auth error:', error);
            window.location.href = '/?error=google_auth_failed';
        } else if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/';
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

// Error Page Component
const ErrorPage = ({ code, message }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-900 mb-4">{code}</h1>
                <p className="text-xl text-gray-600 mb-8">{message}</p>
                <a href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
                    Go Back Home
                </a>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                            borderRadius: '12px',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Public Routes - Marketing Pages */}
                        <Route path="/" element={
                            <PublicRoute>
                                <PageTransition><LandingPage /></PageTransition>
                            </PublicRoute>
                        } />

                        {/* Product Routes */}
                        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
                        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
                        <Route path="/demo" element={<PageTransition><DemoPage /></PageTransition>} />
                        <Route path="/stories" element={<PageTransition><SuccessStoriesPage /></PageTransition>} />

                        {/* Company Routes */}
                        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                        <Route path="/careers" element={<PageTransition><CareersPage /></PageTransition>} />
                        <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                        <Route path="/press" element={<PageTransition><PressPage /></PageTransition>} />

                        {/* Resource Routes */}
                        <Route path="/help" element={<PageTransition><HelpCenterPage /></PageTransition>} />
                        <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
                        <Route path="/webinars" element={<PageTransition><WebinarsPage /></PageTransition>} />
                        <Route path="/docs" element={<PageTransition><ApiDocsPage /></PageTransition>} />

                        {/* Legal Routes */}
                        <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
                        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
                        <Route path="/cookies" element={<PageTransition><CookiesPage /></PageTransition>} />
                        <Route path="/gdpr" element={<PageTransition><GdprPage /></PageTransition>} />

                        {/* OAuth Callback Route */}
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Protected Routes - Onboarding */}
                        <Route path="/onboarding" element={
                            <ProtectedRoute requireOnboarding={false}>
                                <PageTransition><OnboardingPage /></PageTransition>
                            </ProtectedRoute>
                        } />

                        {/* Protected Routes - Dashboard */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <PageTransition><DashboardPage /></PageTransition>
                            </ProtectedRoute>
                        } />
                        <Route path="/learning-path" element={
                            <ProtectedRoute>
                                <PageTransition><LearningPathPage /></PageTransition>
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <PageTransition><ProfilePage /></PageTransition>
                            </ProtectedRoute>
                        } />
                        <Route path="/quiz" element={
                            <ProtectedRoute>
                                <PageTransition><QuizPage /></PageTransition>
                            </ProtectedRoute>
                        } />

                        {/* 404 - Not Found */}
                        <Route path="*" element={<ErrorPage code="404" message="Oops! The page you're looking for doesn't exist." />} />
                    </Routes>
                </AnimatePresence>
            </AuthProvider>
        </Router>
    );
}

export default App;