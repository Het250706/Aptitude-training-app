import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Briefcase,
    GraduationCap,
    Clock,
    Edit,
    Save,
    X,
    Camera,
    Award,
    Calendar,
    TrendingUp,
    Lock,
    AlertCircle,
    CheckCircle,
    Settings,
    Bell,
    Moon,
    Globe,
    Key,
    Trash2
} from 'lucide-react';
import Navbar from '../../components/Common/Navbar';
import Footer from '../../components/Common/Footer';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateUserProfile, changePassword, deactivateAccount } from '../../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, setUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [deactivatePassword, setDeactivatePassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfileData(response.profile);
            setFormData(response.profile || {});
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await updateUserProfile(formData);
            setProfileData(response.profile);
            setIsEditing(false);
            toast.success('Profile updated successfully');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully! Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleDeactivateAccount = async () => {
        try {
            await deactivateAccount(deactivatePassword);
            toast.success('Account deactivated successfully');
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to deactivate account');
        }
    };

    const preferences = [
        { key: 'email_notifications', label: 'Email Notifications', icon: Mail, value: true },
        { key: 'study_reminders', label: 'Study Reminders', icon: Bell, value: true },
        { key: 'dark_mode', label: 'Dark Mode', icon: Moon, value: false },
        { key: 'language', label: 'Language', icon: Globe, value: 'English' },
    ];

    const stats = [
        { icon: Award, label: 'Modules Completed', value: profileData?.modules_completed || '8/15' },
        { icon: TrendingUp, label: 'Average Score', value: profileData?.average_score || '85%' },
        { icon: Clock, label: 'Study Time', value: profileData?.total_study_time || '42 hours' },
        { icon: Calendar, label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString() || 'Jan 2024' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
                        <div className="relative px-6 pb-6">
                            <div className="flex justify-between items-start">
                                <div className="relative -mt-16">
                                    <div className="w-32 h-32 bg-white rounded-full p-1">
                                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-16 h-16 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                                <p className="text-gray-600">{profileData?.current_role || 'Add your role'}</p>
                                {user?.google_id && (
                                    <span className="inline-flex items-center mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                        Connected with Google
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'profile', label: 'Profile Information', icon: User },
                                    { id: 'preferences', label: 'Preferences', icon: Settings },
                                    { id: 'security', label: 'Security', icon: Lock },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition ${activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Profile Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.full_name || user?.fullName}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{user?.fullName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <p className="text-gray-900">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Briefcase className="w-4 h-4 inline mr-1" />
                                            Job Title
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.job_title || ''}
                                                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Software Engineer"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{profileData?.job_title || 'Not specified'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Field of Expertise
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={formData.field_of_expertise || ''}
                                                onChange={(e) => setFormData({ ...formData, field_of_expertise: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                <option value="Engineering & Technology">Engineering & Technology</option>
                                                <option value="Business & Management">Business & Management</option>
                                                <option value="Arts & Humanities">Arts & Humanities</option>
                                                <option value="Science & Research">Science & Research</option>
                                                <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                                                <option value="Finance & Accounting">Finance & Accounting</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">{profileData?.field_of_expertise || 'Not specified'}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Education Level
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    value={formData.education_level || ''}
                                                    onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="high_school">High School</option>
                                                    <option value="bachelors">Bachelor's Degree</option>
                                                    <option value="masters">Master's Degree</option>
                                                    <option value="phd">PhD</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-900">{profileData?.education_level || 'Not specified'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Years of Experience
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={formData.years_of_experience || ''}
                                                    onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{profileData?.years_of_experience || 'Not specified'} years</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Learning Style
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={formData.learning_style || ''}
                                                onChange={(e) => setFormData({ ...formData, learning_style: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                <option value="visual">Visual (prefer diagrams & charts)</option>
                                                <option value="reading">Reading/Writing</option>
                                                <option value="auditory">Auditory (prefer explanations)</option>
                                                <option value="kinesthetic">Kinesthetic (practice-based)</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 capitalize">{profileData?.learning_style || 'Not specified'}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    {preferences.map((pref, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <pref.icon className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium">{pref.label}</p>
                                                </div>
                                            </div>
                                            {typeof pref.value === 'boolean' ? (
                                                <button
                                                    className={`relative w-12 h-6 rounded-full transition ${pref.value ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${pref.value ? 'right-1' : 'left-1'
                                                            }`}
                                                    />
                                                </button>
                                            ) : (
                                                <select className="px-3 py-1 border border-gray-300 rounded-lg">
                                                    <option>English</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                    <option>German</option>
                                                </select>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    {/* Change Password */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Update Password
                                            </button>
                                        </form>
                                    </div>

                                    {/* Deactivate Account */}
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                                        <p className="text-gray-600 mb-4">
                                            Once you deactivate your account, all your data will be permanently deleted.
                                        </p>
                                        {!showDeactivateConfirm ? (
                                            <button
                                                onClick={() => setShowDeactivateConfirm(true)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Deactivate Account
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-red-800 font-medium">Are you absolutely sure?</p>
                                                            <p className="text-red-600 text-sm mt-1">
                                                                This action cannot be undone. All your data will be permanently deleted.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password to confirm"
                                                    value={deactivatePassword}
                                                    onChange={(e) => setDeactivatePassword(e.target.value)}
                                                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                                />
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={handleDeactivateAccount}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                    >
                                                        Yes, Deactivate My Account
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDeactivateConfirm(false);
                                                            setDeactivatePassword('');
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;