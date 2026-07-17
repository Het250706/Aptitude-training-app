import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    CheckCircle,
    Send,
    Filter
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import toast from 'react-hot-toast';

const CareersPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showApplication, setShowApplication] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const departments = ['all', 'Engineering', 'Product', 'Sales', 'Marketing', 'Operations'];

    const jobs = [
        {
            id: 1,
            title: 'Senior Full Stack Developer',
            department: 'Engineering',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$140k - $180k',
            experience: '5+ years',
            description: 'Looking for an experienced full-stack developer to lead our frontend architecture and mentor junior developers.',
            requirements: [
                '5+ years of experience with React and Node.js',
                'Experience with PostgreSQL and cloud platforms',
                'Strong understanding of AI/ML concepts',
                'Leadership experience'
            ]
        },
        {
            id: 2,
            title: 'AI/ML Engineer',
            department: 'Engineering',
            location: 'Remote (US)',
            type: 'Full-time',
            salary: '$150k - $200k',
            experience: '3+ years',
            description: 'Join our AI team to develop cutting-edge learning algorithms and personalization engines.',
            requirements: [
                'MS or PhD in CS/AI/ML',
                'Experience with PyTorch or TensorFlow',
                'Strong background in NLP',
                'Published research is a plus'
            ]
        },
        {
            id: 3,
            title: 'Product Manager',
            department: 'Product',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$130k - $170k',
            experience: '4+ years',
            description: 'Lead product development for our core learning platform and drive user engagement.',
            requirements: [
                'Experience in ed-tech or SaaS',
                'Strong analytical skills',
                'Experience with agile methodologies',
                'User-centric mindset'
            ]
        },
        {
            id: 4,
            title: 'Sales Development Representative',
            department: 'Sales',
            location: 'Remote (Global)',
            type: 'Full-time',
            salary: '$60k - $80k + Commission',
            experience: '1+ years',
            description: 'Drive enterprise sales and build relationships with Fortune 500 companies.',
            requirements: [
                'Experience in B2B sales',
                'Excellent communication skills',
                'Self-motivated and results-driven',
                'Experience with CRM tools'
            ]
        },
        {
            id: 5,
            title: 'Content Marketing Manager',
            department: 'Marketing',
            location: 'Remote (US)',
            type: 'Full-time',
            salary: '$80k - $110k',
            experience: '3+ years',
            description: 'Create compelling content that showcases our platform and helps users succeed.',
            requirements: [
                'Strong writing and editing skills',
                'Experience with SEO',
                'Knowledge of aptitude testing',
                'Video content creation is a plus'
            ]
        }
    ];

    const filteredJobs = selectedDepartment === 'all'
        ? jobs
        : jobs.filter(job => job.department === selectedDepartment);

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplication(true);
    };

    const handleApplicationSubmit = (e) => {
        e.preventDefault();
        toast.success('Application submitted successfully! We\'ll review and get back to you soon.');
        setShowApplication(false);
        setSelectedJob(null);
    };

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
                        Join Our Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Help us revolutionize aptitude training and make a lasting impact on careers worldwide
                    </motion.p>
                </div>
            </section>

            {/* Perks Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Join AptitudeAI?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Competitive Salary', icon: DollarSign, desc: 'Top-tier compensation packages' },
                            { title: 'Remote First', icon: MapPin, desc: 'Work from anywhere in the world' },
                            { title: 'Flexible Hours', icon: Clock, desc: 'Focus on results, not hours' },
                            { title: 'Growth Opportunities', icon: Briefcase, desc: 'Rapid career advancement' }
                        ].map((perk, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6"
                            >
                                <perk.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{perk.title}</h3>
                                <p className="text-gray-600">{perk.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Open Positions</h2>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <Briefcase className="w-4 h-4 mr-1" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {job.type}
                                            </span>
                                            <span className="flex items-center">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {job.salary}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-4">{job.description}</p>
                                <div>
                                    <p className="font-semibold mb-2">Key Requirements:</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {job.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No open positions in this department at the moment.</p>
                            <p className="text-gray-600">Check back soon for new opportunities!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Application Modal */}
            {showApplication && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-2">Apply for {selectedJob.title}</h2>
                            <p className="text-gray-600 mb-6">{selectedJob.department} · {selectedJob.location}</p>

                            <form onSubmit={handleApplicationSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resume/CV *
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cover Letter
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tell us why you're interested in this position..."
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Submit Application
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowApplication(false)}
                                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CareersPage;