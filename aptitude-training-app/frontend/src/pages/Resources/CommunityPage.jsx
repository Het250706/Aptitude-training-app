import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MessageCircle,
    ThumbsUp,
    Share2,
    Award,
    TrendingUp,
    Filter,
    Plus,
    Search,
    Crown
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const CommunityPage = () => {
    const [activeTab, setActiveTab] = useState('discussions');
    const [showNewPost, setShowNewPost] = useState(false);

    const discussions = [
        {
            id: 1,
            title: 'Tips for mastering data interpretation quickly?',
            author: 'Sarah Johnson',
            authorLevel: 'Expert',
            avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
            content: 'I\'ve been struggling with data interpretation questions, especially those with complex charts. Any strategies that worked for you?',
            likes: 45,
            comments: 23,
            tags: ['Data Interpretation', 'Tips'],
            timeAgo: '2 hours ago'
        },
        {
            id: 2,
            title: 'How I improved my quantitative score from 60% to 90%',
            author: 'Michael Chen',
            authorLevel: 'Top Contributor',
            avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
            content: 'After 3 months of dedicated practice using AptitudeAI, I finally cracked the 90% mark. Here\'s what worked for me...',
            likes: 128,
            comments: 56,
            tags: ['Success Story', 'Quantitative'],
            timeAgo: '1 day ago'
        },
        {
            id: 3,
            title: 'Logical reasoning: Best resources for practice?',
            author: 'Priya Patel',
            authorLevel: 'Member',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            content: 'Looking for additional practice resources beyond the platform. Any recommendations?',
            likes: 34,
            comments: 18,
            tags: ['Logical Reasoning', 'Resources'],
            timeAgo: '3 days ago'
        }
    ];

    const topContributors = [
        { name: 'Dr. Alex Thompson', contributions: 234, avatar: 'https://randomuser.me/api/portraits/men/23.jpg', badge: 'Expert' },
        { name: 'Maria Garcia', contributions: 187, avatar: 'https://randomuser.me/api/portraits/women/24.jpg', badge: 'Top Contributor' },
        { name: 'James Wilson', contributions: 156, avatar: 'https://randomuser.me/api/portraits/men/25.jpg', badge: 'Rising Star' }
    ];

    const trendingTopics = [
        { topic: 'Quantitative Aptitude', posts: 234, trending: '+12%' },
        { topic: 'Interview Preparation', posts: 187, trending: '+8%' },
        { topic: 'Time Management', posts: 156, trending: '+15%' },
        { topic: 'Mock Test Strategies', posts: 134, trending: '+5%' }
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
                        Community Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Connect with learners worldwide, share insights, and grow together
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Community Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { icon: Users, value: '25,000+', label: 'Active Members' },
                        { icon: MessageCircle, value: '5,000+', label: 'Discussions' },
                        { icon: ThumbsUp, value: '50,000+', label: 'Solutions' },
                        { icon: Award, value: '1,000+', label: 'Daily Posts' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 text-center shadow-sm"
                        >
                            <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        {['discussions', 'questions', 'success-stories'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search discussions..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowNewPost(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Post
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Discussions */}
                    <div className="lg:col-span-2 space-y-4">
                        {discussions.map((discussion, index) => (
                            <motion.div
                                key={discussion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={discussion.avatar}
                                        alt={discussion.author}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold hover:text-blue-600">
                                                    {discussion.title}
                                                </h3>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <span>{discussion.author}</span>
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                                        {discussion.authorLevel}
                                                    </span>
                                                    <span>{discussion.timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">{discussion.content}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                {discussion.tags.map(tag => (
                                                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex space-x-4 text-gray-500">
                                                <button className="flex items-center space-x-1 hover:text-blue-600">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>{discussion.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-1 hover:text-blue-600">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{discussion.comments}</span>
                                                </button>
                                                <button className="flex items-center space-x-1 hover:text-blue-600">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Contributors */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Top Contributors</h3>
                                <Crown className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="space-y-4">
                                {topContributors.map((contributor, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <img src={contributor.avatar} alt={contributor.name} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-medium">{contributor.name}</p>
                                            <p className="text-sm text-gray-500">{contributor.contributions} contributions</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                            {contributor.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center space-x-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Trending Topics</h3>
                            </div>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className="font-medium">{topic.topic}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">{topic.posts} posts</span>
                                            <span className="text-sm text-green-600">{topic.trending}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Community Guidelines */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Community Guidelines</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>✓ Be respectful and constructive</li>
                                <li>✓ No spam or self-promotion</li>
                                <li>✓ Help others learn and grow</li>
                                <li>✓ Share your success stories</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full p-8"
                    >
                        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="What's your question or topic?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Share your thoughts, questions, or experiences..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., quantitative, tips, success-story"
                                />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Post to Community
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewPost(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CommunityPage;