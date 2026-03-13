// src/services/authService.js
import api from './api';

const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('userInfo');
    },

    getCurrentUser() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
};

export default authService;