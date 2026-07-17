import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Heart,
    Lightbulb,
    Users,
    TrendingUp,
    Globe,
    Award,
    Clock
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const AboutPage = () => {
    const values = [
        {
            icon: Target,
            title: 'Excellence',
            description: 'We strive for excellence in everything we do, from our technology to our customer support.'
        },
        {
            icon: Heart,
            title: 'Empathy',
            description: 'We understand the challenges learners face and design solutions that truly help.'
        },
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We continuously push boundaries to bring cutting-edge AI solutions to education.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We believe in the power of community and collaborative learning.'
        }
    ];

    const milestones = [
        { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize aptitude training' },
        { year: '2021', title: 'First Product Launch', description: 'Released initial version with basic features' },
        { year: '2022', title: 'AI Integration', description: 'Launched AI-powered learning paths' },
        { year: '2023', title: 'Global Expansion', description: 'Reached 50,000+ users worldwide' },
        { year: '2024', title: 'Enterprise Solutions', description: 'Launched enterprise-grade platform' }
    ];

    const team = [
        {
            name: 'Dr. Alex Thompson',
            role: 'CEO & Co-founder',
            bio: 'Former AI researcher at Stanford with 15+ years in ed-tech',
            image: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
            name: 'Dr. Maria Garcia',
            role: 'CTO & Co-founder',
            bio: 'PhD in Machine Learning, ex-Google AI team',
            image: 'https://randomuser.me/api/portraits/women/11.jpg'
        },
        {
            name: 'James Wilson',
            role: 'Head of Product',
            bio: 'Product leader with experience at top ed-tech companies',
            image: 'https://randomuser.me/api/portraits/men/12.jpg'
        },
        {
            name: 'Dr. Lisa Chen',
            role: 'Head of Learning',
            bio: 'Cognitive science expert specializing in adaptive learning',
            image: 'https://randomuser.me/api/portraits/women/12.jpg'
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
                        About AptitudeAI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        We're on a mission to democratize aptitude training through AI-powered personalized learning
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                To empower every professional to achieve their career goals through intelligent,
                                personalized aptitude training that adapts to their unique learning style and pace.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    <span>50K+ Users</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-5 h-5 text-blue-600" />
                                    <span>30+ Countries</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <span>94% Success Rate</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl"
                        >
                            <blockquote className="text-2xl font-serif italic text-gray-800">
                                "Education is not the learning of facts, but the training of the mind to think."
                            </blockquote>
                            <p className="mt-4 text-gray-600">— Albert Einstein</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
                            >
                                <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                                        }`}
                                >
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                            <span className="text-blue-600 font-bold">{milestone.year}</span>
                                            <h3 className="text-xl font-semibold mt-2">{milestone.title}</h3>
                                            <p className="text-gray-600 mt-2">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-4">Meet Our Leadership Team</h2>
                    <p className="text-center text-gray-600 mb-12">
                        Passionate experts dedicated to transforming education through AI
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                    <p className="text-blue-600 mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Be part of the team that's revolutionizing aptitude training
                    </p>
                    <button
                        onClick={() => window.location.href = '/careers'}
                        className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        View Open Positions
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;