// src/components/Settings/SettingsHeader.jsx
import { motion } from "framer-motion";
import { FiSettings, FiVolume2, FiVolumeX } from "react-icons/fi";

const SettingsHeader = ({ voiceContext, isListening, transcript }) => {
  const { voiceMode, toggleVoiceMode, voiceSupported } = voiceContext;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <FiSettings className="mr-3 h-8 w-8 text-primary-600 animate-spin-slow" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Voice Status Indicator */}
      {voiceSupported && (
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={toggleVoiceMode}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              voiceMode
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {voiceMode ? (
              <>
                <FiVolume2 className="h-4 w-4" />
                <span>Voice Mode: {isListening ? "Listening" : "Active"}</span>
                {isListening && (
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </>
            ) : (
              <>
                <FiVolumeX className="h-4 w-4" />
                <span>Voice Mode Off</span>
              </>
            )}
          </button>
          {isListening && (
            <div className="text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
              "{transcript || "Listening..."}"
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SettingsHeader;
