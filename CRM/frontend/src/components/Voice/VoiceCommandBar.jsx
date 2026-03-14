// src/components/Voice/VoiceCommandBar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMic, 
    FiMicOff, 
    FiVolume2, 
    FiVolumeX,
    FiHelpCircle,
    FiSettings,
    FiX 
} from 'react-icons/fi';
import { useVoice } from '../../context/VoiceContext';

const VoiceCommandBar = () => {
    const { 
        voiceMode, 
        isListening, 
        transcript, 
        wakeWordDetected,
        toggleVoiceMode,
        stopListening,
        speak,
        voiceSettings
    } = useVoice();

    const [showHelp, setShowHelp] = useState(false);
    const [commands, setCommands] = useState([
        { command: "Go to dashboard", description: "Navigate to dashboard" },
        { command: "Go to leads", description: "Open leads page" },
        { command: "Go to analytics", description: "View analytics" },
        { command: "Go to settings", description: "Open settings" },
        { command: "Dark mode", description: "Switch to dark theme" },
        { command: "Light mode", description: "Switch to light theme" },
        { command: "Create lead", description: "Add new lead" },
        { command: "Search for [term]", description: "Search leads" },
        { command: "My profile", description: "View profile" },
        { command: "Help", description: "Show this menu" },
        { command: "Stop listening", description: "Deactivate voice mode" }
    ]);

    // Auto-hide help after 10 seconds
    useEffect(() => {
        if (showHelp) {
            const timer = setTimeout(() => setShowHelp(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [showHelp]);

    if (!voiceMode) return null;

    return (
        <>
            {/* Voice Command Bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 flex items-center space-x-4">
                        {/* Mic Button */}
                        <button
                            onClick={toggleVoiceMode}
                            className={`relative p-3 rounded-full transition-all ${
                                isListening 
                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 animate-pulse' 
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            {isListening ? (
                                <FiMic className="h-5 w-5" />
                            ) : (
                                <FiMicOff className="h-5 w-5" />
                            )}
                            {isListening && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>

                        {/* Status Text */}
                        <div className="min-w-[300px]">
                            {wakeWordDetected && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="text-green-600 dark:text-green-400 font-medium text-sm mb-1"
                                >
                                    Wake word detected! 🎤
                                </motion.div>
                            )}
                            <div className="text-gray-900 dark:text-white font-medium">
                                {isListening ? (
                                    transcript ? (
                                        <span className="text-primary-600 dark:text-primary-400">
                                            "{transcript}"
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <span className="animate-pulse">Listening...</span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                Say "{voiceSettings.wakeWord}" or a command
                                            </span>
                                        </span>
                                    )
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Voice mode active - Click mic to start
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Volume Toggle */}
                        <button
                            onClick={() => speak('This is a test of the voice feedback system')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Test voice"
                        >
                            <FiVolume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Help Button */}
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Voice commands help"
                        >
                            <FiHelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => {
                                window.location.href = '/settings?tab=voice';
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Voice settings"
                        >
                            <FiSettings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={stopListening}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Deactivate voice mode"
                        >
                            <FiX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-96"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                                <h3 className="font-semibold flex items-center">
                                    <FiHelpCircle className="mr-2" />
                                    Voice Commands
                                </h3>
                                <p className="text-sm text-white/80 mt-1">
                                    Say these commands while in voice mode
                                </p>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                <div className="space-y-2">
                                    {commands.map((cmd, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                "{cmd.command}"
                                            </span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {cmd.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        💡 Tip: Say "{voiceSettings.wakeWord}" to activate voice mode
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceCommandBar;