import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Menu, X, User, LogOut, Home, BookOpen, BarChart3 } from 'lucide-react';
import { logout, isAuthenticated } from '../../services/api';

const Navbar = ({ onLoginClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isOnboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    const isAuth = isAuthenticated();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/features', label: 'Features', icon: BookOpen },
        { path: '/pricing', label: 'Pricing', icon: BarChart3 },
    ];

    const authenticatedLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/learning-path', label: 'Learning Path', icon: BookOpen },
    ];

    const displayLinks = isAuth && isOnboardingCompleted ? [...navLinks, ...authenticatedLinks] : navLinks;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Brain className="w-8 h-8 text-blue-600" />
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AptitudeAI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {displayLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-gray-700 hover:text-blue-600 transition ${location.pathname === link.path ? 'text-blue-600 font-semibold' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {!isAuth ? (
                            <button
                                onClick={onLoginClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-gray-700">{user.fullName?.split(' ')[0]}</span>
                                </button>

                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t"
                    >
                        {displayLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.label}
                            </Link>
                        ))}

                        {!isAuth ? (
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onLoginClick();
                                }}
                                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Sign In
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;