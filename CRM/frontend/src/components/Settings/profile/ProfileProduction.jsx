// src/components/Settings/profile/ProfilePassword.jsx
import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ProfilePassword = ({ profileForm, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center">
                    <FiAlertCircle className="h-5 w-5 mr-2" />
                    Change your password regularly to keep your account secure
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                </label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        onChange={onChange}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter current password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                </label>
                <input
                    type="password"
                    name="newPassword"
                    value={profileForm.newPassword}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary-500
                             dark:bg-gray-700 dark:text-white"
                    placeholder="Enter new password"
                    minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters long
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={profileForm.confirmPassword}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary-500
                             dark:bg-gray-700 dark:text-white"
                    placeholder="Confirm new password"
                />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                    Password Requirements
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li className="flex items-center">
                        <FiCheck className="h-3 w-3 mr-1" />
                        At least 6 characters
                    </li>
                    <li className="flex items-center">
                        <FiCheck className="h-3 w-3 mr-1" />
                        Include uppercase and lowercase letters
                    </li>
                    <li className="flex items-center">
                        <FiCheck className="h-3 w-3 mr-1" />
                        Include at least one number
                    </li>
                    <li className="flex items-center">
                        <FiCheck className="h-3 w-3 mr-1" />
                        Include at least one special character
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfilePassword;