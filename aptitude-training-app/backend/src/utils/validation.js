const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 6 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const validateFieldOfExpertise = (field) => {
    const validFields = [
        'Engineering & Technology',
        'Business & Management',
        'Arts & Humanities',
        'Science & Research',
        'Healthcare & Medicine',
        'Finance & Accounting',
        'Law & Legal',
        'Education & Training'
    ];
    return validFields.includes(field);
};

const validateAptitudeAreas = (areas) => {
    const validAreas = [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Data Interpretation',
        'Abstract Reasoning',
        'Spatial Reasoning'
    ];
    return Array.isArray(areas) && areas.every(area => validAreas.includes(area));
};

const validateLearningStyle = (style) => {
    const validStyles = ['visual', 'reading', 'auditory', 'kinesthetic'];
    return validStyles.includes(style);
};

const validateDifficultyLevel = (level) => {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'adaptive'];
    return validLevels.includes(level);
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
    validateUrl,
    sanitizeInput,
    validateFieldOfExpertise,
    validateAptitudeAreas,
    validateLearningStyle,
    validateDifficultyLevel
};