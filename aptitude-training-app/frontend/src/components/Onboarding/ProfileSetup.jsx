import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createProfile } from '../../services/api';
import toast from 'react-hot-toast';

const fieldsOfExpertise = [
    'Engineering & Technology',
    'Business & Management',
    'Arts & Humanities',
    'Science & Research',
    'Healthcare & Medicine',
    'Finance & Accounting',
    'Law & Legal',
    'Education & Training'
];

const aptitudeAreas = [
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Verbal Ability',
    'Data Interpretation',
    'Abstract Reasoning',
    'Spatial Reasoning'
];

const ProfileSetup = ({ onComplete }) => {
    // Load saved draft on initial render
    const savedData = localStorage.getItem('onboardingProfileDraft');
    const defaultValues = savedData ? JSON.parse(savedData) : {};

    const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues });
    const [loading, setLoading] = useState(false);

    // Watch all fields and save draft to localStorage
    const formValues = watch();
    useEffect(() => {
        if (formValues && Object.keys(formValues).length > 0) {
            localStorage.setItem('onboardingProfileDraft', JSON.stringify(formValues));
        }
    }, [formValues]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Handle multiple select - ensure it's an array
            let targetAreas = data.targetAptitudeAreas;
            if (!Array.isArray(targetAreas)) {
                targetAreas = [targetAreas];
            }

            const profileData = {
                fieldOfExpertise: data.fieldOfExpertise,
                educationLevel: data.educationLevel,
                jobTitle: data.currentRole,
                yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
                targetAptitudeAreas: targetAreas,
                learningStyle: data.learningStyle,
                weeklyHoursAvailable: data.weeklyHoursAvailable,
                preferredDifficultyLevel: data.preferredDifficultyLevel
            };

            console.log('Submitting profile data:', profileData);

            const response = await createProfile(profileData);
            console.log('Profile creation response:', response);

            if (response.success) {
                localStorage.removeItem('onboardingProfileDraft'); // Clear draft on success
                toast.success('Profile saved successfully!');
                // Call the onComplete callback to move to next step
                onComplete(response.profile);
            } else {
                throw new Error(response.message || 'Failed to save profile');
            }
        } catch (error) {
            console.error('Profile creation error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Expertise *
                </label>
                <select
                    {...register('fieldOfExpertise', { required: 'Field is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select your field</option>
                    {fieldsOfExpertise.map(field => (
                        <option key={field} value={field}>{field}</option>
                    ))}
                </select>
                {errors.fieldOfExpertise && (
                    <p className="text-red-500 text-sm mt-1">{errors.fieldOfExpertise.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level
                    </label>
                    <select
                        {...register('educationLevel')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="high_school">High School</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                    </label>
                    <input
                        type="number"
                        {...register('yearsOfExperience')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Job Title
                </label>
                <input
                    type="text"
                    {...register('currentRole')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Aptitude Areas *
                </label>
                <select
                    multiple
                    {...register('targetAptitudeAreas', { required: 'Select at least one area' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    size="4"
                >
                    {aptitudeAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
                <p className="text-gray-500 text-sm mt-1">Hold Ctrl/Cmd to select multiple</p>
                {errors.targetAptitudeAreas && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetAptitudeAreas.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Learning Style Preference
                    </label>
                    <select
                        {...register('learningStyle')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="visual">Visual (prefer diagrams & charts)</option>
                        <option value="reading">Reading/Writing</option>
                        <option value="auditory">Auditory (prefer explanations)</option>
                        <option value="kinesthetic">Kinesthetic (practice-based)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weekly Hours Available for Practice
                    </label>
                    <select
                        {...register('weeklyHoursAvailable')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="2-5">2-5 hours</option>
                        <option value="5-10">5-10 hours</option>
                        <option value="10-15">10-15 hours</option>
                        <option value="15+">15+ hours</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Difficulty Level
                </label>
                <select
                    {...register('preferredDifficultyLevel')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="adaptive">Adaptive (AI-recommended)</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? 'Saving Profile...' : 'Continue to Assessment'}
            </button>
        </form>
    );
};

export default ProfileSetup;