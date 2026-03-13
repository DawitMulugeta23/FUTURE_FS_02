// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount - using useCallback to memoize
    const loadUser = useCallback(() => {
        try {
            const userData = authService.getCurrentUser();
            if (userData) {
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success) {
                setUser(response.data);
                toast.success('Registration successful!');
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                setUser(response.data);
                toast.success('Login successful!');
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};