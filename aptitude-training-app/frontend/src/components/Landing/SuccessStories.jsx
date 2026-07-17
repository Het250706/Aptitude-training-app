import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const stories = [
    {
        name: 'Sarah Johnson',
        role: 'Software Engineer at Google',
        story: 'The AI-powered learning path helped me identify my weak areas and improve my quantitative skills dramatically.',
        score: '92%',
        image: 'https://via.placeholder.com/100'
    },
    {
        name: 'Michael Chen',
        role: 'MBA Candidate',
        story: 'The diagnostic assessment was spot-on. The personalized recommendations saved me months of preparation time.',
        score: '88%',
        image: 'https://via.placeholder.com/100'
    },
    {
        name: 'Priya Patel',
        role: 'Data Scientist',
        story: 'Finally found a platform that adapts to my learning style. The progress tracking kept me motivated throughout.',
        score: '95%',
        image: 'https://via.placeholder.com/100'
    }
];

const SuccessStories = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Success Stories
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join thousands who have achieved their goals
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={story.image}
                                    alt={story.name}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{story.name}</h3>
                                    <p className="text-gray-600 text-sm">{story.role}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4">{story.story}</p>
                            <div className="border-t pt-3">
                                <span className="text-2xl font-bold text-blue-600">{story.score}</span>
                                <span className="text-gray-600 ml-2">improvement</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;