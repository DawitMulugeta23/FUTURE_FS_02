// src/pages/Help.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiHelpCircle, 
    FiMic, 
    FiCommand, 
    FiVolume2, 
    FiSettings,
    FiUser,
    FiMail,
    FiShield,
    FiDatabase
} from 'react-icons/fi';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

const Help = () => {
    const voiceCommands = [
        { command: "Hey CRM", description: "Activate voice mode" },
        { command: "Go to dashboard", description: "Navigate to dashboard" },
        { command: "Go to leads", description: "Open leads page" },
        { command: "Go to analytics", description: "View analytics" },
        { command: "Go to settings", description: "Open settings" },
        { command: "Dark mode", description: "Switch to dark theme" },
        { command: "Light mode", description: "Switch to light theme" },
        { command: "Create lead", description: "Add new lead" },
        { command: "Search for [term]", description: "Search leads" },
        { command: "My profile", description: "View profile" },
        { command: "Logout", description: "Sign out" },
        { command: "Stop listening", description: "Deactivate voice mode" },
        { command: "Help", description: "Show this help page" },
    ];

    const faqs = [
        {
            question: "How do I activate voice mode?",
            answer: "Click the voice icon in the navbar or say 'Hey CRM' when voice mode is enabled."
        },
        {
            question: "How do I change my profile picture?",
            answer: "Click on your profile picture in the navbar, then click on it again in the dropdown to upload a new photo or use Gravatar."
        },
        {
            question: "What voice commands are available?",
            answer: "You can use commands for navigation, theme switching, lead management, and more. Check the voice commands list below."
        },
        {
            question: "How do I customize voice settings?",
            answer: "Go to Settings > Voice Settings or click on the voice menu in the profile dropdown."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                <FiHelpCircle className="mr-3 h-8 w-8 text-primary-600" />
                                Help & Support
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Learn how to use the CRM system and its voice features
                            </p>
                        </motion.div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white"
                            >
                                <FiMic className="h-8 w-8 mb-3" />
                                <h3 className="font-semibold text-lg">Voice Commands</h3>
                                <p className="text-sm text-white/80">Control the CRM with your voice</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                            >
                                <FiUser className="h-8 w-8 mb-3" />
                                <h3 className="font-semibold text-lg">Profile Settings</h3>
                                <p className="text-sm text-white/80">Manage your account and photo</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                            >
                                <FiSettings className="h-8 w-8 mb-3" />
                                <h3 className="font-semibold text-lg">Customize</h3>
                                <p className="text-sm text-white/80">Adjust settings to your needs</p>
                            </motion.div>
                        </div>

                        {/* FAQs */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Voice Commands List */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FiCommand className="mr-2 h-5 w-5 text-primary-500" />
                                Voice Commands
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {voiceCommands.map((cmd, index) => (
                                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <FiVolume2 className="h-4 w-4 text-primary-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                "{cmd.command}"
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {cmd.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Help;