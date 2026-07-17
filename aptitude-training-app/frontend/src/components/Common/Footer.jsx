import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Brain,
    Twitter,
    Linkedin,
    Github,
    Mail,
    Phone,
    MapPin,
    Facebook
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        product: {
            title: 'Product',
            links: [
                { label: 'Features', path: '/features' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Demo', path: '/demo' },
                { label: 'Success Stories', path: '/stories' },
            ]
        },
        company: {
            title: 'Company',
            links: [
                { label: 'About Us', path: '/about' },
                { label: 'Careers', path: '/careers' },
                { label: 'Blog', path: '/blog' },
                { label: 'Press', path: '/press' },
            ]
        },
        resources: {
            title: 'Resources',
            links: [
                { label: 'Help Center', path: '/help' },
                { label: 'Community', path: '/community' },
                { label: 'Webinars', path: '/webinars' },
                { label: 'API Documentation', path: '/docs' },
            ]
        },
        legal: {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Cookie Policy', path: '/cookies' },
                { label: 'GDPR', path: '/gdpr' },
            ]
        }
    };

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Brain className="w-8 h-8 text-blue-400" />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AptitudeAI
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Empowering professionals with AI-driven aptitude training to accelerate their career growth.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-gray-400 hover:text-white transition"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {Object.values(footerSections).map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-white transition"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Info */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 text-gray-400">
                            <Mail className="w-5 h-5" />
                            <span>support@aptitudeai.com</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-400">
                            <Phone className="w-5 h-5" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-400">
                            <MapPin className="w-5 h-5" />
                            <span>San Francisco, CA</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} AptitudeAI. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                            Terms
                        </Link>
                        <Link to="/cookies" className="text-gray-400 hover:text-white text-sm">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="font-semibold text-lg">Subscribe to our newsletter</h3>
                            <p className="text-gray-400 text-sm">Get the latest updates and learning tips</p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;