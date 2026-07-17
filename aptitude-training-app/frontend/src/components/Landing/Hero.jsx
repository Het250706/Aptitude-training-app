import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Award } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
    return (
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Master Aptitude Tests
                        <br />
                        with AI-Powered Learning
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                        Personalized aptitude training powered by advanced AI. Get customized learning paths,
                        real-time feedback, and boost your career opportunities.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                        >
                            Start Free Trial
                        </button>
                        <button className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 transition">
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Brain, title: 'AI-Powered', description: 'Smart adaptive learning paths' },
                        { icon: TrendingUp, title: 'Track Progress', description: 'Real-time performance analytics' },
                        { icon: Award, title: 'Career Focus', description: 'Industry-specific training' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="text-center p-6"
                        >
                            <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                            <p className="text-gray-600">{stat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;