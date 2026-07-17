import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Shield, Users, CreditCard } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const TermsPage = () => {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using AptitudeAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.'
        },
        {
            title: '2. Account Registration',
            content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and for all activities that occur under your account.'
        },
        {
            title: '3. Subscription and Billing',
            content: 'Some features require paid subscriptions. Fees are billed in advance on a monthly or annual basis. Subscriptions automatically renew unless cancelled. Refunds are handled according to our refund policy.'
        },
        {
            title: '4. User Content',
            content: 'You retain ownership of any content you submit. By submitting content, you grant us a license to use, modify, and display it for the purpose of providing our services.'
        },
        {
            title: '5. Prohibited Conduct',
            content: 'You agree not to: violate any laws, infringe on intellectual property rights, share account credentials, attempt to hack or disrupt the service, or use the service for any unauthorized purpose.'
        },
        {
            title: '6. Intellectual Property',
            content: 'The platform, including its code, design, content, and algorithms, is owned by AptitudeAI and protected by copyright and other intellectual property laws.'
        },
        {
            title: '7. Termination',
            content: 'We may terminate or suspend your account immediately for violations of these terms. You may cancel your account at any time through your account settings.'
        },
        {
            title: '8. Limitation of Liability',
            content: 'AptitudeAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, to the maximum extent permitted by law.'
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
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Please read these terms carefully before using our platform
                    </motion.p>
                    <p className="text-sm text-blue-200 mt-4">Effective Date: March 15, 2024</p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
                        <div>
                            <p className="text-yellow-800">
                                These Terms of Service constitute a legally binding agreement between you and AptitudeAI.
                                By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.content}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Box */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mt-8">
                    <h2 className="text-xl font-semibold mb-4">Key Points Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <span>Free 14-day trial available</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                            <span>Monthly or annual billing options</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <span>Your data is protected and private</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                            <span>Cancel anytime with no penalties</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsPage;