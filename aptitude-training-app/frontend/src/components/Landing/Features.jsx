import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    BarChart3,
    Clock,
    Users,
    Zap,
    Shield
} from 'lucide-react';

const features = [
    {
        icon: Target,
        title: 'Personalized Learning Paths',
        description: 'AI creates custom learning paths based on your field of expertise and skill level.'
    },
    {
        icon: BarChart3,
        title: 'Detailed Analytics',
        description: 'Track your progress with comprehensive performance metrics and insights.'
    },
    {
        icon: Clock,
        title: 'Adaptive Difficulty',
        description: 'Questions automatically adjust difficulty based on your performance.'
    },
    {
        icon: Users,
        title: 'Peer Comparison',
        description: 'See how you rank against others in your field.'
    },
    {
        icon: Zap,
        title: 'Real-time Feedback',
        description: 'Instant explanations and tips for each question.'
    },
    {
        icon: Shield,
        title: 'Mock Tests',
        description: 'Practice with realistic test simulations.'
    }
];

const Features = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features for Success
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to excel in aptitude tests
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;