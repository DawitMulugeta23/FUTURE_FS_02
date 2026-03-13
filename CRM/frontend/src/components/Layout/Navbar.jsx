// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <FiBarChart2 className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-xl text-gray-900">CRM System</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100">
                            <FiUser className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {user?.name}
                            </span>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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