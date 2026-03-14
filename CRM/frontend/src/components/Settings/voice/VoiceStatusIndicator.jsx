// src/components/Settings/voice/VoiceStatusIndicator.jsx
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const VoiceStatusIndicator = ({ voiceSupported, voiceContext }) => {
  const { voiceMode, isListening, transcript } = voiceContext;

  if (!voiceSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-400 flex items-center">
          <FiVolumeX className="h-5 w-5 mr-2" />
          Voice recognition is not supported in your browser. Please use Chrome,
          Edge, or Safari for voice features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-full ${voiceMode ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            {voiceMode ? (
              <FiVolume2 className="h-5 w-5 text-green-600" />
            ) : (
              <FiVolumeX className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Voice Mode: {voiceMode ? "Active" : "Inactive"}
            </p>
            {isListening && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                "{transcript || "Listening..."}"
              </p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isListening ? "Listening..." : "Idle"}
        </span>
      </div>
    </div>
  );
};

export default VoiceStatusIndicator;
