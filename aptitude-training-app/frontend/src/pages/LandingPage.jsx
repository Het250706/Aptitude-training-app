import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import SuccessStories from '../components/Landing/SuccessStories';
import CTASection from '../components/Landing/CTASection';
import LoginModal from '../components/Common/LoginModal';

const LandingPage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar onLoginClick={() => setShowLoginModal(true)} />
            <Hero onGetStarted={() => setShowLoginModal(true)} />
            <Features />
            <SuccessStories />
            <CTASection onGetStarted={() => setShowLoginModal(true)} />
            <Footer />

            {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} />
            )}
        </div>
    );
};

export default LandingPage;