import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import LoginModal from '../../components/Common/LoginModal';

const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const plans = [
        {
            name: 'Basic',
            icon: Star,
            price: { monthly: 29, annual: 290 },
            description: 'Perfect for individuals starting their journey',
            features: [
                'Access to basic aptitude modules',
                '50 practice questions per month',
                'Basic performance analytics',
                'Email support',
                'Mobile access'
            ],
            notIncluded: [
                'Advanced modules',
                'Mock tests',
                'Priority support'
            ],
            cta: 'Start Free Trial',
            popular: false
        },
        {
            name: 'Pro',
            icon: Zap,
            price: { monthly: 79, annual: 790 },
            description: 'Most popular for serious professionals',
            features: [
                'All Basic features',
                'Unlimited practice questions',
                'Advanced AI learning paths',
                'Mock tests with analytics',
                'Priority email & chat support',
                'Downloadable reports',
                'Peer comparison'
            ],
            notIncluded: [],
            cta: 'Get Started',
            popular: true
        },
        {
            name: 'Enterprise',
            icon: Crown,
            price: { monthly: 199, annual: 1990 },
            description: 'For teams and organizations',
            features: [
                'All Pro features',
                'Custom learning paths',
                'Team management dashboard',
                'API access',
                'Dedicated account manager',
                'SSO integration',
                'Custom reporting',
                '24/7 phone support'
            ],
            notIncluded: [],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const handleGetStarted = (planName) => {
        if (planName === 'Enterprise') {
            window.location.href = 'mailto:sales@aptitudeai.com';
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onLoginClick={() => setShowLoginModal(true)} />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-4"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
                    >
                        Choose the plan that best fits your needs. All plans include a 14-day free trial.
                    </motion.p>

                    {/* Billing Toggle */}
                    <div className="flex justify-center items-center space-x-4">
                        <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-blue-200'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-16 h-8 bg-white rounded-full transition duration-300 focus:outline-none"
                        >
                            <div
                                className={`absolute top-1 w-6 h-6 bg-blue-600 rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-lg ${isAnnual ? 'text-white' : 'text-blue-200'}`}>
                            Annually <span className="text-sm text-green-300">Save 20%</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                                            <p className="text-gray-600 mt-1">{plan.description}</p>
                                        </div>
                                        <plan.icon className="w-8 h-8 text-blue-600" />
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                                        <span className="text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
                                        {isAnnual && (
                                            <p className="text-sm text-green-600 mt-1">Billed annually (2 months free)</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleGetStarted(plan.name)}
                                        className={`w-full py-3 rounded-lg font-semibold transition mb-6 ${plan.popular
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>

                                    <div className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, idx) => (
                                            <div key={idx} className="flex items-center opacity-50">
                                                <div className="w-5 h-5 mr-3" />
                                                <span className="text-gray-500 line-through">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Can I switch plans later?",
                                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                            },
                            {
                                q: "Is there a free trial?",
                                a: "All plans come with a 14-day free trial. No credit card required to start."
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
                            },
                            {
                                q: "Can I cancel anytime?",
                                a: "Yes, you can cancel your subscription at any time. No hidden fees or penalties."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="border-b border-gray-200 pb-4"
                            >
                                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

export default PricingPage;