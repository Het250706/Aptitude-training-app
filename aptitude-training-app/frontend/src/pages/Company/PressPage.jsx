import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Newspaper, Award, Users, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const PressPage = () => {
    const pressReleases = [
        {
            id: 1,
            title: 'AptitudeAI Raises $25M Series B to Expand AI-Powered Learning Platform',
            date: 'February 10, 2024',
            source: 'TechCrunch',
            excerpt: 'The company plans to use the funding to enhance its AI algorithms and expand globally...',
            link: '#',
            image: 'https://picsum.photos/800/400?random=10'
        },
        {
            id: 2,
            title: 'AptitudeAI Launches Enterprise Solution for Fortune 500 Companies',
            date: 'January 15, 2024',
            source: 'Forbes',
            excerpt: 'New platform features include team analytics, custom learning paths, and API access...',
            link: '#',
            image: 'https://picsum.photos/800/400?random=11'
        },
        {
            id: 3,
            title: 'Study Shows 94% Improvement in Aptitude Scores Using AI-Powered Learning',
            date: 'December 5, 2023',
            source: 'EdTech Magazine',
            excerpt: 'Research demonstrates significant impact of personalized learning on test performance...',
            link: '#',
            image: 'https://picsum.photos/800/400?random=12'
        }
    ];

    const mediaMentions = [
        {
            id: 1,
            title: 'Best AI-Powered Learning Platforms of 2024',
            source: 'Forbes',
            date: 'March 1, 2024',
            link: '#'
        },
        {
            id: 2,
            title: 'How AptitudeAI is Changing Career Preparation',
            source: 'Fast Company',
            date: 'February 20, 2024',
            link: '#'
        },
        {
            id: 3,
            title: 'Top 50 EdTech Companies to Watch',
            source: 'Tech & Learning',
            date: 'January 30, 2024',
            link: '#'
        }
    ];

    const awards = [
        { name: 'Best AI Application in Education', year: '2024', organization: 'EdTech Awards' },
        { name: 'Top 100 Most Innovative Companies', year: '2023', organization: 'Fast Company' },
        { name: 'Best Workplace for Innovators', year: '2023', organization: 'Great Place to Work' },
        { name: 'Product of the Year', year: '2023', organization: 'EdTech Digest' }
    ];

    const stats = [
        { icon: Users, value: '50,000+', label: 'Active Users' },
        { icon: Newspaper, value: '200+', label: 'Media Mentions' },
        { icon: Award, value: '15+', label: 'Industry Awards' },
        { icon: TrendingUp, value: '300%', label: 'Year-over-Year Growth' }
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
                        Press & Media
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        News, announcements, and media coverage about AptitudeAI
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press Releases */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12">Latest Press Releases</h2>
                    <div className="space-y-8">
                        {pressReleases.map((release, index) => (
                            <motion.div
                                key={release.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="md:col-span-1">
                                        <img
                                            src={release.image}
                                            alt={release.title}
                                            className="w-full h-48 md:h-full object-cover"
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-600 flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {release.date}
                                            </span>
                                            <span className="text-sm font-semibold text-blue-600">{release.source}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{release.title}</h3>
                                        <p className="text-gray-600 mb-4">{release.excerpt}</p>
                                        <a
                                            href={release.link}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Read Full Release
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Mentions */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12">Media Mentions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mediaMentions.map((mention, index) => (
                            <motion.a
                                key={mention.id}
                                href={mention.link}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-lg p-6 hover:shadow-md transition group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-semibold text-blue-600">{mention.source}</span>
                                    <span className="text-sm text-gray-500">{mention.date}</span>
                                </div>
                                <p className="text-gray-800 group-hover:text-blue-600 transition">{mention.title}</p>
                                <ExternalLink className="w-4 h-4 text-gray-400 mt-3 group-hover:text-blue-600" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Awards Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12">Awards & Recognition</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {awards.map((award, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
                            >
                                <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">{award.name}</h3>
                                <p className="text-sm text-gray-600">{award.organization}</p>
                                <p className="text-sm text-blue-600 mt-2">{award.year}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press Kit */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Press Kit</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Download our media kit including logos, screenshots, and brand guidelines
                    </p>
                    <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                        Download Press Kit
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
                    <p className="text-gray-600 mb-8">
                        For press inquiries, interview requests, or additional information, please contact our media relations team.
                    </p>
                    <div className="bg-gray-100 rounded-lg p-6 inline-block">
                        <p className="text-gray-800">
                            📧 <a href="mailto:press@aptitudeai.com" className="text-blue-600 hover:underline">press@aptitudeai.com</a>
                        </p>
                        <p className="text-gray-800 mt-2">
                            📞 <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 (555) 123-4567</a>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PressPage;