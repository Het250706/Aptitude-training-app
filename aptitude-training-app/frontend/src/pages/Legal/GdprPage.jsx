import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, Trash2, Edit, Mail, FileText } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const GdprPage = () => {
    const rights = [
        {
            icon: FileText,
            title: 'Right to Access',
            description: 'You have the right to request a copy of the personal data we hold about you.'
        },
        {
            icon: Edit,
            title: 'Right to Rectification',
            description: 'You have the right to correct inaccurate or incomplete personal data.'
        },
        {
            icon: Trash2,
            title: 'Right to Erasure',
            description: 'You have the right to request deletion of your personal data (Right to be forgotten).'
        },
        {
            icon: Download,
            title: 'Right to Data Portability',
            description: 'You have the right to receive your data in a structured, commonly used format.'
        },
        {
            icon: Mail,
            title: 'Right to Restrict Processing',
            description: 'You have the right to restrict how we process your data under certain circumstances.'
        },
        {
            icon: Shield,
            title: 'Right to Object',
            description: 'You have the right to object to processing of your data for direct marketing purposes.'
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
                        GDPR Compliance
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Your data protection rights under the General Data Protection Regulation
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Your Rights Under GDPR</h2>
                    <p className="text-gray-700 leading-relaxed">
                        AptitudeAI is committed to protecting your personal data and respecting your privacy rights.
                        Under the General Data Protection Regulation (GDPR), you have several important rights that we
                        are committed to upholding. This page explains how you can exercise these rights.
                    </p>
                </div>

                {/* Your Rights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {rights.map((right, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-start space-x-3">
                                <right.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{right.title}</h3>
                                    <p className="text-gray-600 text-sm">{right.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How to Exercise Rights */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">How to Exercise Your Rights</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold mb-2">To make a request:</h3>
                            <p className="text-gray-700 mb-3">
                                Contact our Data Protection Officer (DPO) at <strong>dpo@aptitudeai.com</strong>
                                or use our Data Subject Request Portal.
                            </p>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Access Request Portal
                            </button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">What to include in your request:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Your full name and email address associated with your account</li>
                                <li>The specific right you wish to exercise</li>
                                <li>Any additional information to help us locate your data</li>
                                <li>Proof of identity (for security purposes)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Data Processing Information */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Data Processing Information</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Legal Basis for Processing</h3>
                            <p className="text-gray-700">
                                We process your data based on your consent, contractual necessity, legal obligations,
                                and legitimate interests as outlined in our Privacy Policy.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Data Retention Period</h3>
                            <p className="text-gray-700">
                                We retain your data for as long as your account is active or as needed to provide services.
                                You can request deletion at any time.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">International Data Transfers</h3>
                            <p className="text-gray-700">
                                Your data may be transferred to and processed in countries outside the EEA. We ensure
                                appropriate safeguards are in place for such transfers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complaint Process */}
                <div className="bg-yellow-50 rounded-xl p-8">
                    <h2 className="text-xl font-semibold mb-3">Right to Lodge a Complaint</h2>
                    <p className="text-gray-700 mb-3">
                        If you believe your data protection rights have been violated, you have the right to lodge a complaint
                        with a supervisory authority, particularly in the EU member state of your residence, workplace, or
                        where the alleged infringement occurred.
                    </p>
                    <p className="text-gray-700">
                        <strong>Lead Supervisory Authority:</strong> Irish Data Protection Commission<br />
                        <strong>Website:</strong> <a href="#" className="text-blue-600 hover:underline">www.dataprotection.ie</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default GdprPage;