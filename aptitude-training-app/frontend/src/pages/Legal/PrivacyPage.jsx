import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, Cookie, Lock, Bell } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const PrivacyPage = () => {
    const sections = [
        {
            icon: Database,
            title: 'Information We Collect',
            content: `We collect information that you provide directly to us, including:
        • Account information (name, email, password)
        • Profile information (field of expertise, education, experience)
        • Assessment data and test results
        • Learning progress and preferences
        • Communication with our support team`
        },
        {
            icon: Eye,
            title: 'How We Use Your Information',
            content: `We use your information to:
        • Personalize your learning experience
        • Generate AI-powered learning paths
        • Track and analyze your progress
        • Improve our platform and algorithms
        • Communicate important updates
        • Provide customer support`
        },
        {
            icon: Shield,
            title: 'Data Security',
            content: `We implement industry-standard security measures including:
        • 256-bit SSL encryption for all data transmission
        • Encrypted database storage
        • Regular security audits and penetration testing
        • Two-factor authentication options
        • Secure API endpoints with rate limiting`
        },
        {
            icon: Cookie,
            title: 'Cookies & Tracking',
            content: `We use cookies and similar technologies to:
        • Remember your preferences
        • Analyze platform usage
        • Improve performance
        • Personalize content
        You can control cookie settings through your browser preferences.`
        },
        {
            icon: Lock,
            title: 'Data Retention',
            content: `We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your data at any time. Some data may be retained for legal compliance or legitimate business purposes.`
        },
        {
            icon: Bell,
            title: 'Your Rights',
            content: `You have the right to:
        • Access your personal data
        • Correct inaccurate data
        • Request data deletion
        • Opt-out of marketing communications
        • Data portability
        • Lodge a complaint with supervisory authorities`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-4"
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Your privacy is important to us. Learn how we protect and handle your data.
                    </motion.p>
                    <p className="text-sm text-blue-200 mt-4">Last Updated: March 15, 2024</p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <p className="text-gray-700 leading-relaxed">
                        At AptitudeAI, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully.
                        If you do not agree with the terms of this privacy policy, please do not access the platform.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <section.icon className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold">{section.title}</h2>
                                </div>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Information */}
                <div className="bg-gray-100 rounded-xl p-8 mt-8">
                    <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                    <p className="text-gray-700 mb-2">
                        If you have questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <div className="space-y-1 text-gray-700">
                        <p>Email: privacy@aptitudeai.com</p>
                        <p>Address: 123 AI Street, San Francisco, CA 94105</p>
                        <p>Phone: +1 (555) 123-4567</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPage;