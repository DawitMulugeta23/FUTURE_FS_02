// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// Handle environment variables safely
const getBaseURL = () => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        // Try to get from window.env or use default
        return window?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';
    }
    return 'http://localhost:5000/api';
};

const API_URL = getBaseURL();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const { token } = JSON.parse(userInfo);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
            // Only redirect if we're in a browser environment
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            toast.error('Session expired. Please login again.');
        }
        
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
    }
);

export default api;