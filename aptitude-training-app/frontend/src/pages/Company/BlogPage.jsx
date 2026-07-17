import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const BlogPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'Aptitude Tips', 'Career Advice', 'Industry News', 'Success Stories', 'Product Updates'];

    const posts = [
        {
            id: 1,
            title: '10 Essential Tips to Master Quantitative Aptitude',
            excerpt: 'Learn proven strategies to improve your quantitative skills and ace aptitude tests...',
            category: 'Aptitude Tips',
            author: 'Dr. Sarah Johnson',
            date: 'March 15, 2024',
            readTime: '8 min read',
            image: 'https://picsum.photos/800/400?random=1',
            tags: ['quantitative', 'tips', 'mathematics']
        },
        {
            id: 2,
            title: 'How AI is Transforming Career Assessments',
            excerpt: 'Discover how artificial intelligence is revolutionizing the way we prepare for aptitude tests...',
            category: 'Industry News',
            author: 'Michael Chen',
            date: 'March 10, 2024',
            readTime: '6 min read',
            image: 'https://picsum.photos/800/400?random=2',
            tags: ['AI', 'technology', 'future']
        },
        {
            id: 3,
            title: 'From 60% to 95%: A Success Story of Dedication',
            excerpt: 'Read how one professional transformed their aptitude scores using personalized learning...',
            category: 'Success Stories',
            author: 'Priya Patel',
            date: 'March 5, 2024',
            readTime: '10 min read',
            image: 'https://picsum.photos/800/400?random=3',
            tags: ['success', 'motivation', 'case-study']
        },
        {
            id: 4,
            title: 'The Ultimate Guide to Logical Reasoning',
            excerpt: 'Master logical reasoning with these comprehensive strategies and practice techniques...',
            category: 'Aptitude Tips',
            author: 'Dr. James Wilson',
            date: 'February 28, 2024',
            readTime: '12 min read',
            image: 'https://picsum.photos/800/400?random=4',
            tags: ['logical-reasoning', 'guide', 'practice']
        },
        {
            id: 5,
            title: 'What Recruiters Look for in Aptitude Tests',
            excerpt: 'Insider perspective on how companies use aptitude tests in their hiring process...',
            category: 'Career Advice',
            author: 'Lisa Rodriguez',
            date: 'February 20, 2024',
            readTime: '7 min read',
            image: 'https://picsum.photos/800/400?random=5',
            tags: ['recruitment', 'career', 'hiring']
        },
        {
            id: 6,
            title: 'New Feature: Personalized Learning Paths 2.0',
            excerpt: 'Introducing our enhanced AI algorithm that creates even more accurate learning paths...',
            category: 'Product Updates',
            author: 'Alex Thompson',
            date: 'February 15, 2024',
            readTime: '5 min read',
            image: 'https://picsum.photos/800/400?random=6',
            tags: ['product', 'update', 'features']
        }
    ];

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPost = posts[0];

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
                        AptitudeAI Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Insights, tips, and stories to help you succeed in your career journey
                    </motion.p>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1 rounded-full text-sm transition ${selectedCategory === category
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {searchTerm === '' && selectedCategory === 'all' && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="h-64 lg:h-full">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {featuredPost.date}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {featuredPost.author}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                            {featuredPost.category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                                    <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                                    <button className="text-blue-600 font-semibold inline-flex items-center hover:text-blue-700">
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.slice(searchTerm || selectedCategory !== 'all' ? 0 : 1).map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {post.author.split(' ')[0]}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
                                        <a href={`/blog/${post.id}`}>{post.title}</a>
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">{post.readTime}</span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Get the latest articles, tips, and updates delivered to your inbox
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPage;