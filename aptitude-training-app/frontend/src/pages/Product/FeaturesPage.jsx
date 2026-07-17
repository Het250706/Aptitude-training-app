import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Target,
    BarChart3,
    Clock,
    Users,
    Zap,
    Shield,
    Award,
    TrendingUp,
    BookOpen,
    CheckCircle,
    Sparkles,
    Globe,
    Lock,
    Headphones
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const FeaturesPage = () => {
    const mainFeatures = [
        {
            icon: Brain,
            title: 'AI-Powered Learning',
            description: 'Advanced machine learning algorithms adapt to your learning style and pace.',
            benefits: ['Personalized content recommendations', 'Smart difficulty adjustment', 'Real-time performance analytics']
        },
        {
            icon: Target,
            title: 'Personalized Learning Paths',
            description: 'Custom curriculum designed based on your field of expertise and skill level.',
            benefits: ['Tailored to your career goals', 'Focus on weak areas', 'Industry-specific modules']
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Comprehensive insights into your progress and performance metrics.',
            benefits: ['Detailed performance reports', 'Strengths & weaknesses analysis', 'Progress tracking over time']
        },
        {
            icon: Clock,
            title: 'Adaptive Difficulty',
            description: 'Questions automatically adjust difficulty based on your performance.',
            benefits: ['Optimal challenge level', 'Gradual skill progression', 'Reduced frustration']
        },
        {
            icon: Users,
            title: 'Peer Comparison',
            description: 'Benchmark your performance against others in your field.',
            benefits: ['Ranking system', 'Industry benchmarks', 'Motivational insights']
        },
        {
            icon: Zap,
            title: 'Real-time Feedback',
            description: 'Instant explanations and tips for every question.',
            benefits: ['Immediate learning', 'Detailed explanations', 'Concept reinforcement']
        },
        {
            icon: Shield,
            title: 'Mock Tests',
            description: 'Realistic test simulations with time constraints.',
            benefits: ['Exam simulation', 'Time management practice', 'Performance prediction']
        },
        {
            icon: Award,
            title: 'Certification Prep',
            description: 'Specialized preparation for industry certifications.',
            benefits: ['Exam-specific content', 'Practice questions', 'Success strategies']
        }
    ];

    const additionalFeatures = [
        { icon: TrendingUp, title: 'Progress Tracking', description: 'Monitor your improvement over time' },
        { icon: BookOpen, title: 'Study Materials', description: 'Access to curated learning resources' },
        { icon: Sparkles, title: 'Daily Challenges', description: 'Bite-sized practice exercises' },
        { icon: Globe, title: 'Multi-language Support', description: 'Content in multiple languages' },
        { icon: Lock, title: 'Secure Platform', description: 'Enterprise-grade security' },
        { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance' }
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
                        Powerful Features for Success
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Everything you need to master aptitude tests and advance your career
                    </motion.p>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mainFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="p-8">
                                    <div className="flex items-center mb-4">
                                        <feature.icon className="w-12 h-12 text-blue-600" />
                                        <h3 className="text-2xl font-bold ml-4">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{feature.description}</p>
                                    <ul className="space-y-2">
                                        {feature.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">More Amazing Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition"
                            >
                                <feature.icon className="w-10 h-10 text-blue-600 mb-3" />
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FeaturesPage;