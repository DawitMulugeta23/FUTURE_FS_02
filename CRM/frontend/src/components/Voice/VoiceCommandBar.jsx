// src/components/Voice/VoiceCommandBar.jsx (updated with hover descriptions)
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiHelpCircle,
  FiList,
  FiMic,
  FiMicOff,
  FiSettings,
  FiVolume2,
  FiX,
} from "react-icons/fi";
import { useVoice } from "../../context/VoiceContext";
import HoverSpeak from "./HoverSpeak";

const VoiceCommandBar = () => {
  const {
    voiceMode,
    isListening,
    transcript,
    wakeWordDetected,
    toggleVoiceMode,
    stopListening,
    speak,
    voiceSettings,
    isSpeaking,
    speechQueue,
  } = useVoice();

  const [showHelp, setShowHelp] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [commands] = useState([
    { command: "Go to dashboard", description: "Navigate to dashboard" },
    { command: "Go to leads", description: "Open leads page" },
    { command: "Go to analytics", description: "View analytics" },
    { command: "Go to settings", description: "Open settings" },
    { command: "Dark mode", description: "Switch to dark theme" },
    { command: "Light mode", description: "Switch to light theme" },
    { command: "Create lead", description: "Add new lead" },
    { command: "Search for [term]", description: "Search leads" },
    { command: "My profile", description: "View profile" },
    { command: "Describe", description: "Enable hover descriptions" },
    { command: "Stop describing", description: "Disable hover descriptions" },
    { command: "Help", description: "Show this menu" },
    { command: "Stop listening", description: "Deactivate voice mode" },
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
      <HoverSpeak
        description="Voice command bar. Use this to control the application with your voice."
        delay={300}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 flex items-center space-x-4">
              {/* Mic Button */}
              <HoverSpeak
                description={
                  isListening
                    ? "Stop listening"
                    : "Start listening. Click to activate voice commands."
                }
                delay={200}
              >
                <button
                  onClick={toggleVoiceMode}
                  className={`relative p-3 rounded-full transition-all ${
                    isListening
                      ? "bg-red-100 dark:bg-red-900/20 text-red-600 animate-pulse"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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
              </HoverSpeak>

              {/* Status Text */}
              <HoverSpeak
                description={
                  isListening
                    ? "Listening for voice commands"
                    : "Voice mode active. Click mic to start listening."
                }
                delay={200}
              >
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
              </HoverSpeak>

              {/* Volume Toggle */}
              <HoverSpeak
                description="Test voice. Click to hear a sample of the current voice settings."
                delay={200}
              >
                <button
                  onClick={() =>
                    speak(
                      "This is a test of the voice feedback system. Hover over any element to hear its description.",
                      { priority: "high" },
                    )
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Test voice"
                >
                  <FiVolume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </HoverSpeak>

              {/* Queue Button */}
              <HoverSpeak
                description={`Speech queue. ${speechQueue.length} items waiting. Click to view queue.`}
                delay={200}
              >
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className={`p-2 rounded-lg transition-colors relative ${
                    showQueue
                      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                  title="Speech queue"
                >
                  <FiList className="h-5 w-5" />
                  {speechQueue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {speechQueue.length}
                    </span>
                  )}
                  {isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </button>
              </HoverSpeak>

              {/* Help Button */}
              <HoverSpeak
                description="Voice commands help. Click to see available voice commands."
                delay={200}
              >
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Voice commands help"
                >
                  <FiHelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </HoverSpeak>

              {/* Settings Button */}
              <HoverSpeak
                description="Voice settings. Click to open voice settings page."
                delay={200}
              >
                <button
                  onClick={() => {
                    window.location.href = "/settings?tab=voice";
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Voice settings"
                >
                  <FiSettings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </HoverSpeak>

              {/* Close Button */}
              <HoverSpeak
                description="Deactivate voice mode. Click to turn off voice commands."
                delay={200}
              >
                <button
                  onClick={stopListening}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Deactivate voice mode"
                >
                  <FiX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </HoverSpeak>
            </div>
          </div>
        </motion.div>
      </HoverSpeak>

      {/* Queue Modal */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-96"
          >
            <HoverSpeak
              description="Speech queue. Shows all pending voice announcements."
              delay={200}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                  <h3 className="font-semibold flex items-center">
                    <FiList className="mr-2" />
                    Speech Queue
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {speechQueue.length} items waiting
                  </p>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {speechQueue.length > 0 ? (
                    <div className="space-y-2">
                      {speechQueue.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-2 rounded-lg ${
                            index === 0 && isSpeaking
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                              : "bg-gray-50 dark:bg-gray-700/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {item.text}
                            </span>
                            {index === 0 && isSpeaking && (
                              <span className="text-xs text-green-600 flex items-center">
                                <FiVolume2 className="h-3 w-3 mr-1 animate-pulse" />
                                Speaking
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="capitalize">{item.priority}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        Queue is empty
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </HoverSpeak>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-96"
          >
            <HoverSpeak
              description="Voice commands help. Lists all available voice commands."
              delay={200}
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
                      <HoverSpeak
                        key={index}
                        description={`Command: ${cmd.command}. ${cmd.description}`}
                        delay={300}
                      >
                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-help">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            "{cmd.command}"
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {cmd.description}
                          </span>
                        </div>
                      </HoverSpeak>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Tip: Say "{voiceSettings.wakeWord}" to activate voice
                      mode, then hover over any element to hear its description.
                    </p>
                  </div>
                </div>
              </div>
            </HoverSpeak>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech Queue Indicator (small floating version) */}
      <SpeechQueueIndicator />
    </>
  );
};

export default VoiceCommandBar;
