// src/components/Profile/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, 
    FiMail, 
    FiSettings, 
    FiLogOut, 
    FiVolume2, 
    FiVolumeX,
    FiMoon,
    FiSun,
    FiHelpCircle,
    FiBell,
    FiShield,
    FiDatabase,
    FiChevronDown,
    FiMic,
    FiHeadphones
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { setTheme } from '../../store/slices/uiSlice';
import { useVoice } from '../../context/VoiceContext';
import ProfileAvatar from './ProfileAvatar';
import toast from 'react-hot-toast';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showVoiceMenu, setShowVoiceMenu] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.ui);
    
    // Safely use voice context
    let voiceContext;
    try {
        voiceContext = useVoice();
    } catch (error) {
        voiceContext = {
            voiceMode: false,
            isListening: false,
            voiceSupported: false,
            toggleVoiceMode: () => {},
            speak: () => {},
            voiceSettings: { wakeWord: 'hey crm' }
        };
    }
    
    const { 
        voiceMode, 
        isListening, 
        voiceSupported, 
        toggleVoiceMode, 
        speak,
        voiceSettings 
    } = voiceContext;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowVoiceMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
        if (voiceMode) {
            speak('Logging out. Goodbye!');
        }
    };

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        toast.success(`Switched to ${newTheme} mode`);
        if (voiceMode) {
            speak(`Switching to ${newTheme} mode`);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
        if (voiceMode) {
            speak(`Navigating to ${path.replace('/', '')}`);
        }
    };

    const handleVoiceTest = () => {
        speak('This is a test of the voice system. Your voice settings are working properly.');
        toast.success('Voice test initiated');
    };

    const menuItems = [
        { icon: FiUser, label: 'My Profile', path: '/settings?tab=profile', color: 'text-blue-500' },
        { icon: FiSettings, label: 'Settings', path: '/settings', color: 'text-purple-500' },
        { icon: FiBell, label: 'Notifications', path: '/settings?tab=notifications', color: 'text-yellow-500' },
        { icon: FiShield, label: 'Privacy', path: '/settings?tab=privacy', color: 'text-green-500' },
        { icon: FiDatabase, label: 'Data', path: '/settings?tab=data', color: 'text-orange-500' },
        { icon: FiHelpCircle, label: 'Help & Support', path: '/help', color: 'text-indigo-500' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
                <ProfileAvatar user={user} size="sm" />
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {user?.email}
                    </p>
                </div>
                <FiChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                
                {/* Voice Mode Indicator */}
                {voiceMode && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                            <div className="flex items-center space-x-3">
                                <ProfileAvatar user={user} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">
                                        {user?.name}
                                    </h3>
                                    <p className="text-sm text-white/80 truncate flex items-center">
                                        <FiMail className="h-3 w-3 mr-1" />
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Voice Mode Toggle - Prominent Position */}
                        {voiceSupported && (
                            <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-2 rounded-lg ${voiceMode ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                            {voiceMode ? (
                                                <FiVolume2 className={`h-4 w-4 ${voiceMode ? 'text-green-600' : 'text-gray-600'}`} />
                                            ) : (
                                                <FiVolumeX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Voice Mode
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {voiceMode 
                                                    ? isListening ? 'Listening...' : 'Active' 
                                                    : 'Off'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleVoiceMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            voiceMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                voiceMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Quick Voice Actions */}
                                {voiceMode && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <button
                                            onClick={handleVoiceTest}
                                            className="flex-1 text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <FiHeadphones className="h-3 w-3" />
                                            <span>Test Voice</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowVoiceMenu(!showVoiceMenu);
                                                speak('Voice settings menu');
                                            }}
                                            className="flex-1 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <FiSettings className="h-3 w-3" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Voice Settings Submenu */}
                        <AnimatePresence>
                            {showVoiceMenu && voiceMode && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-3"
                                >
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        Voice Settings
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Wake Word</span>
                                            <span className="text-primary-600 font-medium">"{voiceSettings.wakeWord}"</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Language</span>
                                            <span className="text-primary-600 font-medium">{voiceSettings.language}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Available Commands</span>
                                            <button
                                                onClick={() => {
                                                    speak('Available commands: go to dashboard, leads, analytics, settings, dark mode, light mode, create lead, search');
                                                }}
                                                className="text-xs text-primary-600 hover:text-primary-700"
                                            >
                                                Listen
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Menu Items */}
                        <div className="py-2">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                >
                                    <item.icon className={`h-5 w-5 ${item.color}`} />
                                    <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
                                        {item.label}
                                    </span>
                                    {voiceMode && (
                                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Say "{item.label.toLowerCase()}"
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <div className="border-t dark:border-gray-700 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {theme === 'light' ? (
                                        <FiSun className="h-4 w-4 text-yellow-500" />
                                    ) : (
                                        <FiMoon className="h-4 w-4 text-blue-500" />
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleThemeToggle}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600"
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="border-t dark:border-gray-700 p-2">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 flex items-center space-x-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                            >
                                <FiLogOut className="h-5 w-5" />
                                <span className="flex-1 text-left text-sm font-medium">
                                    Logout
                                </span>
                                {voiceMode && (
                                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Say "logout"
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                            <span>Version 2.0.0</span>
                            {voiceMode && (
                                <span className="flex items-center">
                                    <FiMic className="h-3 w-3 mr-1 text-green-500" />
                                    Voice active
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;