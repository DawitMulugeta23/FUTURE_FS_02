// src/components/Voice/SpeechQueueIndicator.jsx
import { motion } from "framer-motion";
import { FiList, FiLoader, FiVolume2 } from "react-icons/fi";
import { useVoice } from "../../context/VoiceContext";
import HoverSpeak from "./HoverSpeak";

const SpeechQueueIndicator = () => {
  const { isSpeaking, speechQueue, lastSpoken } = useVoice();

  if (!isSpeaking && speechQueue.length === 0) return null;

  return (
    <HoverSpeak
      description={`Speech status. ${isSpeaking ? "Speaking" : "Queue waiting"}. ${speechQueue.length} items in queue.`}
      delay={300}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 max-w-xs cursor-help"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            {isSpeaking ? (
              <FiVolume2 className="h-4 w-4 text-primary-600 animate-pulse" />
            ) : (
              <FiList className="h-4 w-4 text-primary-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isSpeaking && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Speaking now:
                </p>
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  "{lastSpoken}"
                </p>
              </div>
            )}

            {speechQueue.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <FiLoader className="h-3 w-3 mr-1 animate-spin" />
                  Queue ({speechQueue.length})
                </p>
                <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                  {speechQueue.slice(0, 3).map((item, index) => (
                    <p
                      key={index}
                      className="text-xs text-gray-600 dark:text-gray-400 truncate"
                    >
                      • {item.text}
                    </p>
                  ))}
                  {speechQueue.length > 3 && (
                    <p className="text-xs text-gray-500">
                      and {speechQueue.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </HoverSpeak>
  );
};

export default SpeechQueueIndicator;
