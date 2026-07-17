import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTASection = ({ onGetStarted }) => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Accelerate Your Career?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of professionals who have improved their aptitude scores with our AI-powered platform
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Get Started Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;