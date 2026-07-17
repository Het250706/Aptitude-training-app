import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { setAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token) {
            setAuthToken(token);
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
                setIsAuthenticated(true);

                // Check onboarding status
                const onboardingCompleted = response.data.user.onboarding_completed;
                localStorage.setItem('onboardingCompleted', onboardingCompleted);

            } catch (error) {
                console.error('Auth check failed:', error);
                // Try to refresh token
                if (refreshToken) {
                    try {
                        const refreshResponse = await api.post('/auth/refresh-token', { refreshToken });
                        if (refreshResponse.data.accessToken) {
                            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                            setAuthToken(refreshResponse.data.accessToken);
                            const userResponse = await api.get('/auth/me');
                            setUser(userResponse.data.user);
                            setIsAuthenticated(true);
                        } else {
                            handleLogout();
                        }
                    } catch (refreshError) {
                        handleLogout();
                    }
                } else {
                    handleLogout();
                }
            }
        }
        setLoading(false);
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setAuthToken(accessToken);

            setUser(user);
            setIsAuthenticated(true);

            toast.success(`Welcome back, ${user.fullName}!`);

            if (user.onboardingCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const handleRegister = async (email, password, fullName) => {
        try {
            const response = await api.post('/auth/register', { email, password, fullName });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setAuthToken(accessToken);

            setUser(user);
            setIsAuthenticated(true);

            toast.success('Account created successfully!');
            navigate('/onboarding');

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        // This will be handled by the Google OAuth redirect
        console.log('Google login success:', credentialResponse);
    };

    const handleGoogleFailure = (error) => {
        console.error('Google login failed:', error);
        toast.error('Google login failed. Please try again.');
    };

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('onboardingCompleted');
        removeAuthToken();

        setUser(null);
        setIsAuthenticated(false);

        toast.success('Logged out successfully');
        navigate('/');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsAuthenticated(true);
    };

    // Make sure the value includes this method
    const value = {
        user,
        setUser: updateUser,  // Make sure this is exposed
        loading,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        googleLogin: handleGoogleSuccess,
        googleFailure: handleGoogleFailure,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};