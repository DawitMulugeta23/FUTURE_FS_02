// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check if backend server is running.');
        } else if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('userInfo');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                toast.error('Session expired. Please login again.');
            } else {
                const message = error.response.data?.message || 'An error occurred';
                toast.error(message);
            }
        } else if (error.request) {
            toast.error('Cannot connect to server. Please check if backend is running.');
        } else {
            toast.error('Network error. Please try again.');
        }
        
        return Promise.reject(error);
    }
);

export default api;