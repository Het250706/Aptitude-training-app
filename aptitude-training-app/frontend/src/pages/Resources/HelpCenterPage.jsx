import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    HelpCircle,
    BookOpen,
    Video,
    FileText,
    MessageCircle,
    ChevronDown,
    ChevronRight,
    Mail,
    Phone,
    Clock,
    ExternalLink
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const HelpCenterPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openCategories, setOpenCategories] = useState({});

    const toggleCategory = (categoryId) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const helpCategories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: BookOpen,
            articles: [
                { title: 'How to create an account', views: 12450, helpful: 98 },
                { title: 'Setting up your profile', views: 8750, helpful: 95 },
                { title: 'Understanding the dashboard', views: 6230, helpful: 92 },
                { title: 'First diagnostic assessment guide', views: 5430, helpful: 96 }
            ]
        },
        {
            id: 'learning-paths',
            title: 'Learning Paths',
            icon: HelpCircle,
            articles: [
                { title: 'How AI creates your learning path', views: 9870, helpful: 94 },
                { title: 'Customizing your learning preferences', views: 6540, helpful: 91 },
                { title: 'Tracking your progress', views: 5430, helpful: 93 },
                { title: 'Resetting or modifying your path', views: 3210, helpful: 88 }
            ]
        },
        {
            id: 'assessments',
            title: 'Assessments & Tests',
            icon: FileText,
            articles: [
                { title: 'Types of aptitude tests available', views: 11230, helpful: 96 },
                { title: 'Tips for taking mock tests', views: 8760, helpful: 94 },
                { title: 'Understanding your scores', views: 6540, helpful: 92 },
                { title: 'Time management strategies', views: 5430, helpful: 95 }
            ]
        },
        {
            id: 'account',
            title: 'Account Management',
            icon: HelpCircle,
            articles: [
                { title: 'Upgrading your subscription', views: 7650, helpful: 97 },
                { title: 'Billing and payment methods', views: 5430, helpful: 94 },
                { title: 'Changing account settings', views: 4320, helpful: 91 },
                { title: 'Canceling your subscription', views: 3210, helpful: 89 }
            ]
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: HelpCircle,
            articles: [
                { title: 'Common login issues', views: 8760, helpful: 93 },
                { title: 'Technical requirements', views: 6540, helpful: 95 },
                { title: 'Browser compatibility', views: 4320, helpful: 92 },
                { title: 'Reporting bugs', views: 3210, helpful: 90 }
            ]
        }
    ];

    const popularArticles = [
        { title: 'How to improve your quantitative score', views: 15670 },
        { title: 'Understanding adaptive difficulty', views: 12450 },
        { title: 'Tips for logical reasoning section', views: 11230 },
        { title: 'Mobile app features guide', views: 9870 }
    ];

    const videoTutorials = [
        { title: 'Platform Overview', duration: '5:23', views: 23450 },
        { title: 'Setting Up Your Profile', duration: '3:45', views: 18760 },
        { title: 'Taking Your First Test', duration: '4:12', views: 16540 },
        { title: 'Analyzing Your Results', duration: '6:30', views: 14320 }
    ];

    const filteredCategories = helpCategories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.articles.some(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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
                        How Can We Help You?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
                    >
                        Search our help center for answers to common questions
                    </motion.p>

                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for articles, guides, and tutorials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {filteredCategories.map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center space-x-3">
                                        <category.icon className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-xl font-semibold">{category.title}</h2>
                                    </div>
                                    {openCategories[category.id] ?
                                        <ChevronDown className="w-5 h-5 text-gray-500" /> :
                                        <ChevronRight className="w-5 h-5 text-gray-500" />
                                    }
                                </button>

                                {openCategories[category.id] && (
                                    <div className="border-t border-gray-100">
                                        {category.articles.map((article, idx) => (
                                            <div key={idx} className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <span>{article.views.toLocaleString()} views</span>
                                                            <span>{article.helpful}% found helpful</span>
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular Articles */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
                            <div className="space-y-3">
                                {popularArticles.map((article, idx) => (
                                    <div key={idx} className="cursor-pointer hover:text-blue-600 transition">
                                        <p className="font-medium">{article.title}</p>
                                        <p className="text-sm text-gray-500">{article.views.toLocaleString()} views</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video Tutorials */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Video className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Video Tutorials</h3>
                            </div>
                            <div className="space-y-3">
                                {videoTutorials.map((video, idx) => (
                                    <div key={idx} className="cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                                        <p className="font-medium">{video.title}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                            <span>{video.duration}</span>
                                            <span>{video.views.toLocaleString()} views</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Still Need Help?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <MessageCircle className="w-5 h-5 text-blue-600" />
                                    <span>Live Chat (24/7)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <span>support@aptitudeai.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span>Response within 24 hours</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HelpCenterPage;