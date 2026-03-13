// src/pages/Settings.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiBell,
    FiDatabase,
    FiEye,
    FiEyeOff,
    FiLock,
    FiLogOut,
    FiMail,
    FiMoon,
    FiSave,
    FiShield,
    FiSun,
    FiTrash2,
    FiUser
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import { logout } from '../store/slices/authSlice';
import { setTheme } from '../store/slices/uiSlice';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.ui);
    
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        leadUpdates: true,
        marketingEmails: false,
        weeklyReports: true,
        taskReminders: true
    });
    const [privacy, setPrivacy] = useState({
        showEmail: false,
        showPhone: false,
        allowDataCollection: true,
        twoFactorAuth: false
    });

    const tabs = [
        { id: 'profile', name: 'Profile', icon: FiUser },
        { id: 'notifications', name: 'Notifications', icon: FiBell },
        { id: 'appearance', name: 'Appearance', icon: FiMoon },
        { id: 'privacy', name: 'Privacy & Security', icon: FiShield },
        { id: 'data', name: 'Data Management', icon: FiDatabase }
    ];

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        
        if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        // Simulate API call
        toast.success('Profile updated successfully');
    };

    const handleNotificationChange = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key]
        });
        toast.success('Notification preferences updated');
    };

    const handlePrivacyChange = (key) => {
        setPrivacy({
            ...privacy,
            [key]: !privacy[key]
        });
        toast.success('Privacy settings updated');
    };

    const handleThemeToggle = () => {
        dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
        toast.success(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleExportData = () => {
        toast.success('Data export started. You will receive an email when ready.');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.success('Account deletion requested');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            
            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage your account settings and preferences
                            </p>
                        </div>

                        {/* Settings Navigation */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="flex border-b dark:border-gray-700 overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleProfileSubmit}>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Profile Information
                                        </h2>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={profileForm.name}
                                                        onChange={handleProfileChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={profileForm.email}
                                                        onChange={handleProfileChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t dark:border-gray-700 pt-6">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                    Change Password
                                                </h3>
                                                
                                                <div className="space-y-4">
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
                                                                onChange={handleProfileChange}
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
                                                        <div className="relative">
                                                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="password"
                                                                name="newPassword"
                                                                value={profileForm.newPassword}
                                                                onChange={handleProfileChange}
                                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
                                                                placeholder="Enter new password"
                                                                minLength="6"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Confirm New Password
                                                        </label>
                                                        <div className="relative">
                                                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={profileForm.confirmPassword}
                                                                onChange={handleProfileChange}
                                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
                                                                placeholder="Confirm new password"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="btn-primary flex items-center space-x-2"
                                                >
                                                    <FiSave className="h-4 w-4" />
                                                    <span>Save Changes</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === 'notifications' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Notification Preferences
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            {Object.entries(notifications).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={() => handleNotificationChange(key)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                                                      peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 
                                                                      rounded-full peer dark:bg-gray-700 
                                                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                                      after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                                                                      peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Appearance Tab */}
                                {activeTab === 'appearance' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Appearance Settings
                                        </h2>
                                        
                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                            Theme Mode
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Choose between light and dark theme
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleThemeToggle}
                                                        className="relative inline-flex items-center px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-600"
                                                    >
                                                        <div className={`absolute left-1 top-1 w-10 h-10 rounded-lg bg-white shadow-lg transform transition-transform duration-200 ${
                                                            theme === 'dark' ? 'translate-x-12' : 'translate-x-0'
                                                        }`} />
                                                        <div className="relative flex items-center space-x-8">
                                                            <FiSun className={`h-5 w-5 ${theme === 'light' ? 'text-yellow-600' : 'text-gray-400'}`} />
                                                            <FiMoon className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                    Language
                                                </h3>
                                                <select
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                             focus:outline-none focus:ring-2 focus:ring-primary-500
                                                             dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="es">Spanish</option>
                                                    <option value="fr">French</option>
                                                    <option value="de">German</option>
                                                    <option value="zh">Chinese</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Privacy Tab */}
                                {activeTab === 'privacy' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Privacy & Security
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            {Object.entries(privacy).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {key === 'twoFactorAuth' && 'Enable two-factor authentication for extra security'}
                                                            {key === 'allowDataCollection' && 'Allow anonymous usage data collection'}
                                                            {key === 'showEmail' && 'Show email address on profile'}
                                                            {key === 'showPhone' && 'Show phone number on profile'}
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={() => handlePrivacyChange(key)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                                                      peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 
                                                                      rounded-full peer dark:bg-gray-700 
                                                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                                      after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                                                                      peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Data Management Tab */}
                                {activeTab === 'data' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Data Management
                                        </h2>
                                        
                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    Export Your Data
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    Download a copy of all your leads, notes, and account information
                                                </p>
                                                <button
                                                    onClick={handleExportData}
                                                    className="btn-primary flex items-center space-x-2"
                                                >
                                                    <FiSave className="h-4 w-4" />
                                                    <span>Export Data</span>
                                                </button>
                                            </div>

                                            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                                <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
                                                    Delete Account
                                                </h3>
                                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                </p>
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                    <span>Delete Account</span>
                                                </button>
                                            </div>

                                            <div className="pt-6 border-t dark:border-gray-700">
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                                             rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                                                             transition-colors flex items-center space-x-2"
                                                >
                                                    <FiLogOut className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;