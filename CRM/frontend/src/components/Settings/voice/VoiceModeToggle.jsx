// src/components/Settings/voice/VoiceModeToggle.jsx
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const VoiceModeToggle = ({ voiceContext }) => {
  const { voiceMode, isListening, toggleVoiceMode } = voiceContext;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-4 rounded-full ${voiceMode ? "bg-white/20 animate-pulse" : "bg-white/10"}`}
          >
            {voiceMode ? (
              <FiVolume2 className="h-8 w-8" />
            ) : (
              <FiVolumeX className="h-8 w-8" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              {voiceMode ? "Voice Mode Active" : "Voice Mode Inactive"}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {voiceMode
                ? isListening
                  ? "Listening for commands..."
                  : "Click the mic to start listening"
                : "Enable voice mode to control the CRM with your voice"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleVoiceMode}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            voiceMode
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white text-primary-600 hover:bg-white/90"
          }`}
        >
          {voiceMode ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
};

export default VoiceModeToggle;
