const { body, param, query, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

const userValidationRules = {
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    password: body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage('Password must contain at least one letter and one number'),

    fullName: body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),

    fieldOfExpertise: body('fieldOfExpertise')
        .isIn([
            'Engineering & Technology',
            'Business & Management',
            'Arts & Humanities',
            'Science & Research',
            'Healthcare & Medicine',
            'Finance & Accounting',
            'Law & Legal',
            'Education & Training'
        ])
        .withMessage('Invalid field of expertise'),

    yearsOfExperience: body('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Years of experience must be between 0 and 50'),

    weeklyHoursAvailable: body('weeklyHoursAvailable')
        .optional()
        .isIn(['2-5', '5-10', '10-15', '15+'])
        .withMessage('Invalid weekly hours range')
};

module.exports = {
    validate,
    userValidationRules
};