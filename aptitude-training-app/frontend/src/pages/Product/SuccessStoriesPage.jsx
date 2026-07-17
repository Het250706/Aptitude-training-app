import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const SuccessStoriesPage = () => {
    const [currentStory, setCurrentStory] = useState(0);

    const stories = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            role: "Software Engineer at Google",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
            story: "AptitudeAI completely transformed my interview preparation. The personalized learning path identified my weak areas in data structures and algorithms, and within 3 months, I was able to crack Google's technical interviews. The real-time feedback and adaptive difficulty kept me challenged but not overwhelmed.",
            achievement: "Placed at Google with 40% salary increase",
            score: "95%",
            beforeScore: "65%",
            improvement: "30%",
            category: "tech"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "MBA Candidate at Harvard",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            story: "As a non-traditional student, I was worried about the quantitative section of the GMAT. AptitudeAI's AI-driven approach helped me build confidence and skills systematically. The platform's analytics showed my progress in real-time, keeping me motivated throughout my preparation journey.",
            achievement: "Scored 730 on GMAT, admitted to Harvard",
            score: "92%",
            beforeScore: "58%",
            improvement: "34%",
            category: "education"
        },
        {
            id: 3,
            name: "Priya Patel",
            role: "Data Scientist at Amazon",
            image: "https://randomuser.me/api/portraits/women/3.jpg",
            story: "The platform's focus on data interpretation and logical reasoning was exactly what I needed for Amazon's assessment process. The mock tests simulated the real exam environment perfectly, and the detailed explanations helped me understand the underlying concepts, not just the answers.",
            achievement: "Promoted to Senior Data Scientist",
            score: "98%",
            beforeScore: "72%",
            improvement: "26%",
            category: "tech"
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Management Consultant at McKinsey",
            image: "https://randomuser.me/api/portraits/men/4.jpg",
            story: "McKinsey's problem-solving test is notoriously difficult, but AptitudeAI's case-based approach and analytical modules prepared me perfectly. The platform's ability to simulate real consulting scenarios was invaluable.",
            achievement: "Joined McKinsey as Associate",
            score: "96%",
            beforeScore: "70%",
            improvement: "26%",
            category: "business"
        },
        {
            id: 5,
            name: "Dr. Emily Rodriguez",
            role: "Medical Researcher",
            image: "https://randomuser.me/api/portraits/women/5.jpg",
            story: "I used AptitudeAI to prepare for my medical residency entrance exam. The platform's verbal ability and logical reasoning modules were exceptional. The AI adapted to my learning pace and focused on areas where I needed the most improvement.",
            achievement: "Top 1% in residency entrance exam",
            score: "99%",
            beforeScore: "75%",
            improvement: "24%",
            category: "healthcare"
        }
    ];

    const categories = ["all", "tech", "business", "education", "healthcare"];
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredStories = selectedCategory === "all"
        ? stories
        : stories.filter(story => story.category === selectedCategory);

    const nextStory = () => {
        setCurrentStory((prev) => (prev + 1) % filteredStories.length);
    };

    const prevStory = () => {
        setCurrentStory((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
    };

    const StatsCard = ({ title, value, change }) => (
        <div className="text-center p-4">
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-3xl font-bold text-blue-600">{value}</p>
            {change && <p className="text-green-600 text-sm">{change}</p>}
        </div>
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
                        Success Stories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Join thousands of professionals who have transformed their careers with AptitudeAI
                    </motion.p>
                </div>
            </section>

            {/* Global Statistics */}
            <section className="py-16 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatsCard title="Happy Users" value="50,000+" change="+500% YoY" />
                        <StatsCard title="Success Rate" value="94%" change="Average improvement" />
                        <StatsCard title="Companies Hired" value="2,500+" change="Global companies" />
                        <StatsCard title="Practice Hours" value="2M+" change="Collective learning" />
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setCurrentStory(0);
                                }}
                                className={`px-6 py-2 rounded-full capitalize transition ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Story Carousel */}
            {filteredStories.length > 0 && (
                <section className="py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            key={currentStory}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left side - Image & Stats */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex flex-col justify-center">
                                    <img
                                        src={filteredStories[currentStory].image}
                                        alt={filteredStories[currentStory].name}
                                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
                                    />
                                    <h3 className="text-2xl font-bold text-center mb-2">
                                        {filteredStories[currentStory].name}
                                    </h3>
                                    <p className="text-gray-600 text-center mb-6">
                                        {filteredStories[currentStory].role}
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center">
                                            <p className="text-gray-600 text-sm">Final Score</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {filteredStories[currentStory].score}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 text-sm">Before</p>
                                            <p className="text-2xl font-bold text-gray-600">
                                                {filteredStories[currentStory].beforeScore}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 text-sm">Improvement</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {filteredStories[currentStory].improvement}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-green-800 font-semibold text-center">
                                            {filteredStories[currentStory].achievement}
                                        </p>
                                    </div>
                                </div>

                                {/* Right side - Story */}
                                <div className="p-8 flex flex-col justify-between">
                                    <div>
                                        <Quote className="w-12 h-12 text-blue-200 mb-4" />
                                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                            "{filteredStories[currentStory].story}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={prevStory}
                                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextStory}
                                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* All Stories Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">More Success Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => setCurrentStory(index)}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={story.image}
                                        alt={story.name}
                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{story.name}</h3>
                                        <p className="text-gray-600 text-sm">{story.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                                    "{story.story.substring(0, 120)}..."
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-green-600 font-semibold text-sm">
                                        +{story.improvement}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Write Your Success Story?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of successful professionals who achieved their goals with AptitudeAI
                    </p>
                    <button
                        onClick={() => window.location.href = '/pricing'}
                        className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Start Your Journey Today
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SuccessStoriesPage;