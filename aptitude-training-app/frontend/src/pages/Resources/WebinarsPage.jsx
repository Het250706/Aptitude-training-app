import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Video,
    Play,
    Calendar as CalendarIcon,
    Filter,
    ChevronRight,
    Download
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const WebinarsPage = () => {
    const [filter, setFilter] = useState('upcoming');

    const upcomingWebinars = [
        {
            id: 1,
            title: 'Mastering Quantitative Aptitude: Advanced Techniques',
            speaker: 'Dr. Sarah Johnson',
            speakerTitle: 'Head of Learning, AptitudeAI',
            date: 'March 25, 2024',
            time: '2:00 PM EST',
            duration: '90 min',
            description: 'Learn advanced strategies for solving complex quantitative problems quickly and accurately.',
            image: 'https://picsum.photos/800/400?random=30',
            seatsLeft: 124,
            level: 'Advanced'
        },
        {
            id: 2,
            title: 'Cracking Data Interpretation for Competitive Exams',
            speaker: 'Michael Chen',
            speakerTitle: 'Senior Data Scientist',
            date: 'March 28, 2024',
            time: '11:00 AM EST',
            duration: '60 min',
            description: 'Master the art of analyzing complex charts, graphs, and data sets under time pressure.',
            image: 'https://picsum.photos/800/400?random=31',
            seatsLeft: 87,
            level: 'Intermediate'
        },
        {
            id: 3,
            title: 'Logical Reasoning: From Basics to Expert Level',
            speaker: 'Priya Patel',
            speakerTitle: 'Cognitive Psychology Expert',
            date: 'April 2, 2024',
            time: '3:00 PM EST',
            duration: '120 min',
            description: 'Comprehensive guide to solving all types of logical reasoning questions efficiently.',
            image: 'https://picsum.photos/800/400?random=32',
            seatsLeft: 245,
            level: 'All Levels'
        }
    ];

    const pastWebinars = [
        {
            id: 4,
            title: 'Time Management Strategies for Aptitude Tests',
            speaker: 'James Wilson',
            date: 'March 10, 2024',
            duration: '75 min',
            views: 2340,
            recordingUrl: '#'
        },
        {
            id: 5,
            title: 'Verbal Ability: Reading Comprehension Mastery',
            speaker: 'Dr. Lisa Chen',
            date: 'March 5, 2024',
            duration: '60 min',
            views: 1870,
            recordingUrl: '#'
        },
        {
            id: 6,
            title: 'Mock Test Analysis: Common Mistakes to Avoid',
            speaker: 'Alex Thompson',
            date: 'February 28, 2024',
            duration: '90 min',
            views: 1450,
            recordingUrl: '#'
        }
    ];

    const handleRegister = (webinarId) => {
        alert(`Registered for webinar ${webinarId}! We'll send you a calendar invite.`);
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
                        Live & On-Demand Webinars
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Learn from industry experts and accelerate your aptitude preparation
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Tabs */}
                <div className="flex justify-center space-x-4 mb-12">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-8 py-3 rounded-lg font-semibold transition ${filter === 'upcoming'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Upcoming Webinars
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-8 py-3 rounded-lg font-semibold transition ${filter === 'past'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Recorded Sessions
                    </button>
                </div>

                {/* Upcoming Webinars */}
                {filter === 'upcoming' && (
                    <div className="space-y-8">
                        {upcomingWebinars.map((webinar, index) => (
                            <motion.div
                                key={webinar.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3">
                                    <div className="lg:col-span-1">
                                        <img
                                            src={webinar.image}
                                            alt={webinar.title}
                                            className="w-full h-64 lg:h-full object-cover"
                                        />
                                    </div>
                                    <div className="lg:col-span-2 p-8">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                                                LIVE
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {webinar.seatsLeft} seats left
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3">{webinar.title}</h2>
                                        <p className="text-gray-600 mb-4">{webinar.description}</p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-gray-700">
                                                <User className="w-4 h-4 mr-2" />
                                                <span>{webinar.speaker} - {webinar.speakerTitle}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>{webinar.date} at {webinar.time}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>{webinar.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                                Level: {webinar.level}
                                            </span>
                                            <button
                                                onClick={() => handleRegister(webinar.id)}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                                            >
                                                Register Now
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Past Webinars - Recordings */}
                {filter === 'past' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastWebinars.map((webinar, index) => (
                            <motion.div
                                key={webinar.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                            >
                                <div className="relative">
                                    <div className="bg-gray-800 h-48 flex items-center justify-center">
                                        <Video className="w-16 h-16 text-gray-600" />
                                    </div>
                                    <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
                                        <Play className="w-12 h-12 text-white" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2">{webinar.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">with {webinar.speaker}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="flex items-center">
                                            <CalendarIcon className="w-4 h-4 mr-1" />
                                            {webinar.date}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {webinar.duration}
                                        </span>
                                        <span>{webinar.views} views</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                                            Watch Recording
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Newsletter Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Never Miss a Webinar</h3>
                    <p className="text-blue-100 mb-6">Subscribe to get notified about upcoming webinars and events</p>
                    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                        />
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default WebinarsPage;