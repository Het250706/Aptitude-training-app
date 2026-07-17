import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, Info, Check, X } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const CookiesPage = () => {
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false
    });

    const cookieTypes = [
        {
            id: 'necessary',
            name: 'Necessary Cookies',
            description: 'These cookies are essential for the website to function properly. They enable core functionality like security, network management, and accessibility.',
            required: true,
            icon: Shield
        },
        {
            id: 'functional',
            name: 'Functional Cookies',
            description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
            required: false,
            icon: Settings
        },
        {
            id: 'analytics',
            name: 'Analytics Cookies',
            description: 'These cookies help us understand how visitors interact with our website, allowing us to improve performance and user experience.',
            required: false,
            icon: Info
        },
        {
            id: 'marketing',
            name: 'Marketing Cookies',
            description: 'These cookies track your browsing habits to deliver targeted advertisements relevant to your interests.',
            required: false,
            icon: Cookie
        }
    ];

    const handlePreferenceChange = (type) => {
        if (type === 'necessary') return;
        setCookiePreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const savePreferences = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
        alert('Cookie preferences saved!');
    };

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
                        Cookie Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Learn how we use cookies to enhance your experience
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Cookie className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold">What Are Cookies?</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                        They are widely used to make websites work more efficiently and provide information to the website owners.
                        This Cookie Policy explains how AptitudeAI uses cookies and similar technologies.
                    </p>
                </div>

                {/* Cookie Preferences Manager */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Manage Your Cookie Preferences</h2>
                    <div className="space-y-6">
                        {cookieTypes.map((cookie) => (
                            <div key={cookie.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <cookie.icon className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-semibold">{cookie.name}</h3>
                                        {cookie.required && (
                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Required</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{cookie.description}</p>
                                </div>
                                <div className="ml-4">
                                    {cookie.required ? (
                                        <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-gray-600">On</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handlePreferenceChange(cookie.id)}
                                            className={`relative w-12 h-6 rounded-full transition ${cookiePreferences[cookie.id] ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${cookiePreferences[cookie.id] ? 'right-1' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={savePreferences}
                        className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Save Preferences
                    </button>
                </div>

                {/* Detailed Cookie Information */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold mb-6">Cookies We Use</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3">Cookie Name</th>
                                    <th className="text-left p-3">Purpose</th>
                                    <th className="text-left p-3">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="p-3 font-mono text-sm">session_id</td>
                                    <td className="p-3">Maintain user session</td>
                                    <td className="p-3">Session</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-sm">user_preferences</td>
                                    <td className="p-3">Store user settings</td>
                                    <td className="p-3">1 year</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-sm">_ga</td>
                                    <td className="p-3">Google Analytics tracking</td>
                                    <td className="p-3">2 years</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-sm">_gid</td>
                                    <td className="p-3">Google Analytics tracking</td>
                                    <td className="p-3">24 hours</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* How to Control Cookies */}
                <div className="bg-gray-100 rounded-xl p-8 mt-8">
                    <h2 className="text-xl font-semibold mb-4">How to Control Cookies</h2>
                    <p className="text-gray-700 mb-4">
                        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer
                        and set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust
                        some preferences every time you visit a site, and some services and functionalities may not work.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 hover:underline">Chrome Instructions</a>
                        <a href="#" className="text-blue-600 hover:underline">Firefox Instructions</a>
                        <a href="#" className="text-blue-600 hover:underline">Safari Instructions</a>
                        <a href="#" className="text-blue-600 hover:underline">Edge Instructions</a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CookiesPage;