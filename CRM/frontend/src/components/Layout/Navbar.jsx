// src/components/Layout/Navbar.jsx - Updated version
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiLogOut, FiUser, FiBarChart2 } from 'react-icons/fi';
import ThemeToggle from '../UI/ThemeToggle';
import VoiceSearch from '../Search/VoiceSearch';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <FiBarChart2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                            <span className="font-bold text-xl text-gray-900 dark:text-white">
                                CRM System
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <FiUser className="text-gray-600 dark:text-gray-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {user?.name}
                            </span>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;