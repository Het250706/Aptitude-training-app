import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
    withCredentials: false,
});

// Queue for handling token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('accessToken', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('accessToken');
    }
};

// Helper to normalize and save user to localStorage
export const saveUserToLocalStorage = (user) => {
    if (!user) {
        localStorage.removeItem('user');
        localStorage.removeItem('onboardingCompleted');
        return null;
    }
    const onboardingCompleted = user.onboardingCompleted !== undefined 
        ? user.onboardingCompleted 
        : (user.onboarding_completed !== undefined ? user.onboarding_completed : false);
        
    const normalizedUser = {
        ...user,
        fullName: user.fullName || user.full_name || '',
        onboardingCompleted: onboardingCompleted,
        onboarding_completed: onboardingCompleted
    };
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('onboardingCompleted', onboardingCompleted ? 'true' : 'false');
    return normalizedUser;
};

// Remove auth token
export const removeAuthToken = () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('user');
};

// Get current auth token
export const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => {
        // Log responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while token is being refreshed
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token, force logout
                removeAuthToken();
                isRefreshing = false;
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                const response = await api.post('/auth/refresh-token', { refreshToken });
                const { accessToken } = response.data;

                if (accessToken) {
                    setAuthToken(accessToken);
                    processQueue(null, accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeAuthToken();
                isRefreshing = false;

                // Redirect to login on refresh failure
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other errors
        if (error.response) {
            console.error('[API Error Response]', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            console.error('[API No Response]', error.request);
        } else {
            console.error('[API Error]', error.message);
        }

        return Promise.reject(error);
    }
);

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * Register a new user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @returns {Promise} API response
 */
export const register = async (email, password, fullName) => {
    const response = await api.post('/auth/register', { email, password, fullName });
    if (response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        if (response.data.user) {
            response.data.user = saveUserToLocalStorage(response.data.user);
        }
    }
    return response.data;
};

/**
 * Login existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} API response
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        if (response.data.user) {
            response.data.user = saveUserToLocalStorage(response.data.user);
        }
    }
    return response.data;
};

/**
 * Get current user information
 * @returns {Promise} API response with user data and profile
 */
export const getMe = async () => {
    const response = await api.get('/auth/me');
    if (response.data.user) {
        response.data.user = saveUserToLocalStorage(response.data.user);
    }
    return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        response.data.user = saveUserToLocalStorage({ ...currentUser, ...response.data.user });
    }
    return response.data;
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
};

/**
 * Deactivate user account
 * @param {string} password - User's password for confirmation
 * @returns {Promise} API response
 */
export const deactivateAccount = async (password) => {
    const response = await api.post('/auth/deactivate-account', { password });
    return response.data;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} API response
 */
export const refreshAccessToken = async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    if (response.data.accessToken) {
        setAuthToken(response.data.accessToken);
    }
    return response.data;
};

/**
 * Logout user
 * @returns {Promise} API response
 */
export const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    removeAuthToken();
    return { success: true };
};

// ==================== USER PROFILE ENDPOINTS ====================

/**
 * Create or update user profile
 * @param {Object} profileData - User profile data
 * @returns {Promise} API response
 */
export const createProfile = async (profileData) => {
    const response = await api.post('/user/profile', profileData);
    return response.data;
};

/**
 * Get user profile
 * @returns {Promise} API response with profile data
 */
export const getProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} API response
 */
export const updateUserProfile = async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
};

// ==================== DIAGNOSTIC ASSESSMENT ENDPOINTS ====================

/**
 * Submit diagnostic assessment results
 * @param {Object} results - Diagnostic assessment results
 * @returns {Promise} API response with learning path
 */
export const submitDiagnostic = async (results) => {
    const response = await api.post('/user/diagnostic', results);
    return response.data;
};

/**
 * Get diagnostic assessment results
 * @returns {Promise} API response with diagnostic results
 */
export const getDiagnosticResults = async () => {
    const response = await api.get('/user/diagnostic-results');
    return response.data;
};

// ==================== ONBOARDING ENDPOINTS ====================

/**
 * Complete onboarding process
 * @returns {Promise} API response
 */
export const completeOnboarding = async () => {
    const response = await api.post('/user/complete-onboarding');
    if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        response.data.user = saveUserToLocalStorage({ ...currentUser, ...response.data.user, onboardingCompleted: true });
    }
    return response.data;
};

/**
 * Check onboarding status
 * @returns {Promise} API response with onboarding status
 */
export const getOnboardingStatus = async () => {
    const response = await api.get('/user/onboarding-status');
    return response.data;
};

// ==================== LEARNING PATH ENDPOINTS ====================

/**
 * Get user's learning path
 * @returns {Promise} API response with learning path data
 */
export const getLearningPath = async () => {
    const response = await api.get('/user/learning-path');
    return response.data;
};

/**
 * Update learning path progress
 * @param {Object} progressData - Progress data
 * @returns {Promise} API response
 */
export const updateLearningProgress = async (progressData) => {
    const response = await api.put('/user/learning-progress', progressData);
    return response.data;
};

/**
 * Complete a module
 * @param {string} moduleId - Module ID
 * @returns {Promise} API response
 */
export const completeModule = async (moduleId) => {
    const response = await api.post('/user/complete-module', { moduleId });
    return response.data;
};

// ==================== LEARNING STYLE ASSESSMENT ENDPOINTS ====================

/**
 * Get learning style assessment questions
 * @returns {Promise} API response with VARK questions
 */
export const getLearningStyleQuestions = async () => {
    const response = await api.get('/learning/learning-style/questions');
    return response.data;
};

/**
 * Submit learning style assessment
 * @param {Array} answers - Assessment answers
 * @returns {Promise} API response
 */
export const submitLearningStyleAssessment = async (answers) => {
    const response = await api.post('/learning/learning-style', { answers });
    return response.data;
};

// ==================== DIAGNOSTIC ASSESSMENT (NEW) ====================

/**
 * Submit full diagnostic assessment
 * @param {Object} data - Assessment data including answers and time taken
 * @returns {Promise} API response
 */
export const submitDiagnosticAssessment = async (data) => {
    const response = await api.post('/learning/diagnostic', data);
    return response.data;
};

// ==================== LEARNING PATH GENERATION ====================

/**
 * Generate personalized learning path
 * @returns {Promise} API response with generated path
 */
export const generateLearningPath = async () => {
    const response = await api.post('/learning/generate-path');
    return response.data;
};

/**
 * Get detailed learning path with nodes
 * @returns {Promise} API response
 */
export const getDetailedLearningPath = async () => {
    const response = await api.get('/learning/learning-path');
    return response.data;
};

/**
 * Update node progress in learning path
 * @param {number} nodeId - Node ID
 * @param {number} progress - Progress percentage
 * @param {number} timeSpent - Time spent in seconds
 * @returns {Promise} API response
 */
export const updateNodeProgress = async (nodeId, progress, timeSpent) => {
    const response = await api.put('/learning/node-progress', { nodeId, progress, timeSpent });
    return response.data;
};

// ==================== QUIZ ENDPOINTS ====================

/**
 * Start a new adaptive quiz session
 * @returns {Promise} API response with session ID and first question
 */
export const startQuiz = async (data) => {
    const response = await api.post('/quiz/start', data);
    return response.data;
};

/**
 * Submit answer for current question
 * @param {Object} data - Answer data including sessionId, questionId, answer, timeTaken
 * @returns {Promise} API response with next question and points
 */
export const submitAnswer = async (data) => {
    const response = await api.post('/quiz/submit', data);
    return response.data;
};

/**
 * Get quiz results for a session
 * @param {string} sessionId - Quiz session ID
 * @returns {Promise} API response with results
 */
export const getQuizResults = async (sessionId) => {
    const response = await api.get(`/quiz/results/${sessionId}`);
    return response.data;
};

// ==================== REAL-WORLD CHALLENGES ENDPOINTS ====================

/**
 * Get all challenges with optional filters
 * @param {string} category - Challenge category (optional)
 * @param {string} difficulty - Difficulty level (optional)
 * @returns {Promise} API response with challenges list
 */
export const getChallenges = async (category = null, difficulty = null) => {
    const params = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    const response = await api.get('/challenges', { params });
    return response.data;
};

/**
 * Get specific challenge by ID
 * @param {number} challengeId - Challenge ID
 * @returns {Promise} API response with challenge details
 */
export const getChallenge = async (challengeId) => {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
};

/**
 * Start a challenge
 * @param {number} challengeId - Challenge ID
 * @returns {Promise} API response
 */
export const startChallenge = async (challengeId) => {
    const response = await api.post(`/challenges/${challengeId}/start`);
    return response.data;
};

/**
 * Submit challenge solution
 * @param {number} challengeId - Challenge ID
 * @param {string} solution - User's solution
 * @param {number} timeSpent - Time spent in seconds
 * @returns {Promise} API response with score and feedback
 */
export const submitChallenge = async (challengeId, solution, timeSpent) => {
    const response = await api.post(`/challenges/${challengeId}/submit`, { solution, timeSpent });
    return response.data;
};

/**
 * Get user's completed challenges
 * @returns {Promise} API response with user challenges
 */
export const getUserChallenges = async () => {
    const response = await api.get('/challenges/user');
    return response.data;
};

// ==================== GAMIFICATION ENDPOINTS ====================

/**
 * Get leaderboard rankings
 * @param {number} limit - Number of entries to return (default: 100)
 * @returns {Promise} API response with leaderboard and user rank
 */
export const getLeaderboard = async (limit = 100) => {
    const response = await api.get('/gamification/leaderboard', { params: { limit } });
    return response.data;
};

/**
 * Get user's earned badges
 * @returns {Promise} API response with badges list
 */
export const getUserBadges = async () => {
    const response = await api.get('/gamification/badges');
    return response.data;
};

/**
 * Get user's points and stats
 * @returns {Promise} API response with points, rank, and badges count
 */
export const getUserPoints = async () => {
    const response = await api.get('/gamification/points');
    return response.data;
};

// ==================== ANALYTICS & PROGRESS ENDPOINTS ====================

/**
 * Get user performance analytics
 * @param {string} period - Time period (week, month, year)
 * @returns {Promise} API response with analytics data
 */
export const getPerformanceAnalytics = async (period = 'week') => {
    try {
        const response = await api.get('/user/analytics', { params: { period } });
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
};

/**
 * Get detailed progress report
 * @returns {Promise} API response with progress report
 */
export const getProgressReport = async () => {
    const response = await api.get('/user/progress-report');
    return response.data;
};

/**
 * Get strengths and weaknesses analysis
 * @returns {Promise} API response with analysis
 */
export const getStrengthsWeaknesses = async () => {
    const response = await api.get('/user/strengths-weaknesses');
    return response.data;
};

/**
 * Get user achievements
 * @returns {Promise} API response with achievements
 */
export const getAchievements = async () => {
    try {
        const response = await api.get('/user/achievements');
        return response.data;
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return null;
    }
};

// ==================== PRACTICE QUESTIONS ENDPOINTS ====================

/**
 * Get practice questions for a module
 * @param {string} moduleId - Module ID
 * @param {number} limit - Number of questions
 * @returns {Promise} API response with questions
 */
export const getPracticeQuestions = async (moduleId, limit = 10) => {
    const response = await api.get(`/user/practice-questions/${moduleId}`, {
        params: { limit }
    });
    return response.data;
};

/**
 * Submit quiz answers
 * @param {Object} quizData - Quiz submission data
 * @returns {Promise} API response with score and feedback
 */
export const submitQuiz = async (quizData) => {
    const response = await api.post('/user/submit-quiz', quizData);
    return response.data;
};

/**
 * Get mock tests
 * @param {string} category - Test category
 * @returns {Promise} API response with mock tests
 */
export const getMockTests = async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/user/mock-tests', { params });
    return response.data;
};

/**
 * Submit mock test
 * @param {Object} testData - Mock test submission data
 * @returns {Promise} API response with results
 */
export const submitMockTest = async (testData) => {
    const response = await api.post('/user/submit-mock-test', testData);
    return response.data;
};

// ==================== NOTIFICATIONS ENDPOINTS ====================

/**
 * Get user notifications
 * @param {boolean} unreadOnly - Get only unread notifications
 * @returns {Promise} API response with notifications
 */
export const getNotifications = async (unreadOnly = false) => {
    const response = await api.get('/user/notifications', {
        params: { unreadOnly }
    });
    return response.data;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const markNotificationRead = async (notificationId) => {
    const response = await api.put(`/user/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise} API response
 */
export const markAllNotificationsRead = async () => {
    const response = await api.put('/user/notifications/read-all');
    return response.data;
};

// ==================== COMMUNITY ENDPOINTS ====================

/**
 * Get community posts
 * @param {number} page - Page number
 * @param {number} limit - Posts per page
 * @returns {Promise} API response with posts
 */
export const getCommunityPosts = async (page = 1, limit = 20) => {
    const response = await api.get('/community/posts', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Create a community post
 * @param {Object} postData - Post data
 * @returns {Promise} API response
 */
export const createCommunityPost = async (postData) => {
    const response = await api.post('/community/posts', postData);
    return response.data;
};

/**
 * Like a community post
 * @param {string} postId - Post ID
 * @returns {Promise} API response
 */
export const likePost = async (postId) => {
    const response = await api.post(`/community/posts/${postId}/like`);
    return response.data;
};

/**
 * Add comment to post
 * @param {string} postId - Post ID
 * @param {string} comment - Comment text
 * @returns {Promise} API response
 */
export const addComment = async (postId, comment) => {
    const response = await api.post(`/community/posts/${postId}/comments`, { comment });
    return response.data;
};

// ==================== WEBINAR ENDPOINTS ====================

/**
 * Get upcoming webinars
 * @returns {Promise} API response with webinars
 */
export const getUpcomingWebinars = async () => {
    const response = await api.get('/webinars/upcoming');
    return response.data;
};

/**
 * Get past webinars recordings
 * @returns {Promise} API response with recordings
 */
export const getPastWebinars = async () => {
    const response = await api.get('/webinars/past');
    return response.data;
};

/**
 * Register for a webinar
 * @param {string} webinarId - Webinar ID
 * @returns {Promise} API response
 */
export const registerForWebinar = async (webinarId) => {
    const response = await api.post(`/webinars/${webinarId}/register`);
    return response.data;
};

// ==================== SUPPORT ENDPOINTS ====================

/**
 * Submit support ticket
 * @param {Object} ticketData - Support ticket data
 * @returns {Promise} API response
 */
export const submitSupportTicket = async (ticketData) => {
    const response = await api.post('/support/tickets', ticketData);
    return response.data;
};

/**
 * Get support tickets
 * @returns {Promise} API response with tickets
 */
export const getSupportTickets = async () => {
    const response = await api.get('/support/tickets');
    return response.data;
};

/**
 * Get FAQ categories and articles
 * @returns {Promise} API response with FAQs
 */
export const getFaqs = async () => {
    const response = await api.get('/support/faqs');
    return response.data;
};

// ==================== CONTACT & NEWSLETTER ENDPOINTS ====================

/**
 * Submit contact form
 * @param {Object} contactData - Contact form data
 * @returns {Promise} API response
 */
export const submitContactForm = async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
};

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 * @returns {Promise} API response
 */
export const subscribeNewsletter = async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
};

/**
 * Unsubscribe from newsletter
 * @param {string} email - Email address
 * @returns {Promise} API response
 */
export const unsubscribeNewsletter = async (email) => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
};

// ==================== DEMO REQUEST ENDPOINT ====================

/**
 * Request a product demo
 * @param {Object} demoData - Demo request data
 * @returns {Promise} API response
 */
export const requestDemo = async (demoData) => {
    const response = await api.post('/demo/request', demoData);
    return response.data;
};

// ==================== JOB APPLICATION ENDPOINTS ====================

/**
 * Get job listings
 * @param {string} department - Filter by department
 * @returns {Promise} API response with jobs
 */
export const getJobs = async (department = null) => {
    const params = department ? { department } : {};
    const response = await api.get('/careers/jobs', { params });
    return response.data;
};

/**
 * Submit job application
 * @param {FormData} applicationData - Job application form data
 * @returns {Promise} API response
 */
export const submitJobApplication = async (applicationData) => {
    const response = await api.post('/careers/apply', applicationData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Dashboard endpoints
export const getDashboardData = async () => {
    const response = await api.get('/dashboard/data');
    return response.data;
};

export const getLearningContent = async (params) => {
    const response = await api.get('/dashboard/learning-content', { params });
    return response.data;
};

export const generateAIContent = async (data) => {
    const response = await api.post('/dashboard/generate-content', data);
    return response.data;
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get authentication headers for external API calls
 * @returns {Object} Authorization header object
 */
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    return {
        isValid: hasMinLength && hasNumber && hasLetter,
        errors: {
            minLength: !hasMinLength,
            number: !hasNumber,
            letter: !hasLetter,
        },
    };
};

export default api;