// src/components/Search/VoiceSearch.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiLoader, FiMic, FiSearch, FiX } from "react-icons/fi";

// Check if browser supports speech recognition
const isBrowser = typeof window !== "undefined";
const hasSpeechRecognition =
  isBrowser &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const VoiceSearch = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [browserSupportsSpeechRecognition] = useState(hasSpeechRecognition);

  useEffect(() => {
    if (isBrowser && hasSpeechRecognition) {
      // Initialize speech recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        setTranscript(text);
        handleSearch(text);
        setListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
      };

      recognitionInstance.onend = () => {
        setListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript("");
      setListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        setListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const handleSearch = (query) => {
    // Simulate search results
    const results = [
      { id: 1, name: "John Doe", type: "lead", match: "Name match" },
      { id: 2, name: "Jane Smith", type: "lead", match: "Email match" },
      { id: 3, name: "Acme Corp", type: "company", match: "Company match" },
    ].filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.match.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResults(results);
    onSearch && onSearch(query, results);
  };

  const clearSearch = () => {
    setTranscript("");
    setSearchResults([]);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="relative">
        <button
          onClick={() =>
            alert(
              "Speech recognition is not supported in your browser. Try Chrome or Edge.",
            )
          }
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-50"
          title="Voice Search (Not Supported)"
        >
          <FiMic className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Voice Search"
      >
        <FiMic className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={transcript}
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search by voice or type..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-primary-500
                               dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  onClick={listening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors ${
                    listening
                      ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {listening ? (
                    <FiLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <FiMic className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    clearSearch();
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {listening && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Listening... Speak now
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y dark:divide-gray-700">
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {result.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {result.type} • {result.match}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Match
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : transcript ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No results found for "{transcript}"
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-600 text-4xl mb-3">
                    🎤
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Click the mic and start speaking to search
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceSearch;
