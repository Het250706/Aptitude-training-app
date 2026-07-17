import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Terminal,
    Key,
    Lock,
    ChevronDown,
    ChevronRight,
    Copy,
    Check
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';

const ApiDocsPage = () => {
    const [copied, setCopied] = useState(null);
    const [openSection, setOpenSection] = useState('authentication');

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const apiSections = {
        authentication: {
            title: 'Authentication',
            content: `
        # Get API Key
        POST /api/v1/auth/token
        
        # Request Body:
        {
          "api_key": "your_api_key",
          "api_secret": "your_api_secret"
        }
        
        # Response:
        {
          "access_token": "eyJhbGciOiJIUzI1NiIs...",
          "token_type": "bearer",
          "expires_in": 3600
        }
      `,
            code: `curl -X POST https://api.aptitudeai.com/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"api_key":"your_api_key","api_secret":"your_api_secret"}'`
        },
        users: {
            title: 'Users',
            content: `
        # Create User Profile
        POST /api/v1/users
        
        # Request Body:
        {
          "email": "user@example.com",
          "full_name": "John Doe",
          "field_of_expertise": "Engineering",
          "education_level": "bachelors"
        }
        
        # Get User Profile
        GET /api/v1/users/{user_id}
        
        # Update User Profile
        PUT /api/v1/users/{user_id}
      `,
            code: `curl -X POST https://api.aptitudeai.com/v1/users \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","full_name":"John Doe"}'`
        },
        assessments: {
            title: 'Assessments',
            content: `
        # Submit Diagnostic Assessment
        POST /api/v1/assessments/diagnostic
        
        # Request Body:
        {
          "user_id": "123",
          "answers": {
            "q1": "A",
            "q2": "C"
          },
          "time_taken": 1800
        }
        
        # Get Assessment Results
        GET /api/v1/assessments/{assessment_id}/results
      `,
            code: `curl -X POST https://api.aptitudeai.com/v1/assessments/diagnostic \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"user_id":"123","answers":{"q1":"A","q2":"C"}}'`
        },
        learning: {
            title: 'Learning Paths',
            content: `
        # Get Learning Path
        GET /api/v1/learning-paths/{user_id}
        
        # Update Progress
        PUT /api/v1/learning-paths/{user_id}/progress
        
        # Request Body:
        {
          "module_id": "mod_456",
          "completion_percentage": 75,
          "time_spent": 1200
        }
      `,
            code: `curl -X GET https://api.aptitudeai.com/v1/learning-paths/123 \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
        }
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
                        API Documentation
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Integrate AptitudeAI's powerful learning capabilities into your applications
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setOpenSection('authentication')}
                                            className={`text-left w-full px-3 py-2 rounded-lg transition ${openSection === 'authentication' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            Authentication
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenSection('users')}
                                            className={`text-left w-full px-3 py-2 rounded-lg transition ${openSection === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            Users
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenSection('assessments')}
                                            className={`text-left w-full px-3 py-2 rounded-lg transition ${openSection === 'assessments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            Assessments
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenSection('learning')}
                                            className={`text-left w-full px-3 py-2 rounded-lg transition ${openSection === 'learning' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            Learning Paths
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                                    <Key className="w-4 h-4" />
                                    <span>API Base URL</span>
                                </div>
                                <code className="block bg-gray-100 p-3 rounded-lg text-sm">
                                    https://api.aptitudeai.com/v1
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="mb-8">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Lock className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold">{apiSections[openSection].title}</h2>
                                </div>

                                {/* API Content */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <pre className="text-sm overflow-x-auto">
                                            <code>{apiSections[openSection].content}</code>
                                        </pre>
                                    </div>

                                    {/* Code Example */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold">Example Request</h3>
                                            <button
                                                onClick={() => copyToClipboard(apiSections[openSection].code, openSection)}
                                                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
                                            >
                                                {copied === openSection ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <pre className="text-green-400 text-sm overflow-x-auto">
                                                <code>{apiSections[openSection].code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rate Limits */}
                            <div className="border-t pt-8">
                                <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium mb-2">Free Tier</p>
                                        <p className="text-sm text-gray-600">100 requests per hour</p>
                                        <p className="text-sm text-gray-600">10 concurrent requests</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium mb-2">Pro Tier</p>
                                        <p className="text-sm text-gray-600">10,000 requests per hour</p>
                                        <p className="text-sm text-gray-600">100 concurrent requests</p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Codes */}
                            <div className="border-t pt-8 mt-8">
                                <h3 className="text-lg font-semibold mb-4">Error Codes</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="font-mono text-sm bg-red-100 text-red-600 px-2 py-1 rounded">400</span>
                                        <span>Bad Request - Invalid parameters</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="font-mono text-sm bg-red-100 text-red-600 px-2 py-1 rounded">401</span>
                                        <span>Unauthorized - Invalid API key</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="font-mono text-sm bg-red-100 text-red-600 px-2 py-1 rounded">403</span>
                                        <span>Forbidden - Insufficient permissions</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="font-mono text-sm bg-red-100 text-red-600 px-2 py-1 rounded">404</span>
                                        <span>Not Found - Resource doesn't exist</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="font-mono text-sm bg-red-100 text-red-600 px-2 py-1 rounded">429</span>
                                        <span>Too Many Requests - Rate limit exceeded</span>
                                    </div>
                                </div>
                            </div>

                            {/* SDKs */}
                            <div className="border-t pt-8 mt-8">
                                <h3 className="text-lg font-semibold mb-4">SDKs & Libraries</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['Python', 'JavaScript', 'Java', 'Ruby', 'Go', 'PHP'].map(lang => (
                                        <div key={lang} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-blue-600 cursor-pointer">
                                            <Terminal className="w-4 h-4 text-blue-600" />
                                            <span>{lang} SDK</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ApiDocsPage;