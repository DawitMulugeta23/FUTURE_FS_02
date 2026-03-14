// src/components/Auth/VoiceLogin.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiHelpCircle,
  FiLock,
  FiLogIn,
  FiMail,
  FiMic,
  FiVolume2,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useVoice } from "../../context/VoiceContext";
import { login } from "../../store/slices/authSlice";

const VoiceLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    voiceMode,
    isListening,
    transcript,
    speak,
    startListening,
    stopListening,
  } = useVoice();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEmail, setVoiceEmail] = useState("");
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  // Handle voice commands
  useEffect(() => {
    if (voiceMode && transcript) {
      const lowerTranscript = transcript.toLowerCase();

      // Extract email from voice
      if (lowerTranscript.includes("email") || lowerTranscript.includes("at")) {
        const emailMatch = transcript.match(/\b[\w\.-]+@[\w\.-]+\.\w+\b/);
        if (emailMatch) {
          setVoiceEmail(emailMatch[0]);
          setEmail(emailMatch[0]);
          speak(`Email set to ${emailMatch[0]}`);
        }
      }

      // Extract password from voice (simulated)
      if (
        lowerTranscript.includes("password") ||
        lowerTranscript.includes("pass")
      ) {
        toast.success("Password received via voice");
        speak("Password received");
      }

      // Login command
      if (
        lowerTranscript.includes("login") ||
        lowerTranscript.includes("sign in")
      ) {
        if (email && password) {
          handleVoiceLogin();
        } else {
          speak("Please provide email and password");
        }
      }

      // Help command
      if (lowerTranscript.includes("help")) {
        setShowVoiceHelp(true);
        speak("Say your email, then your password, then say login");
        setTimeout(() => setShowVoiceHelp(false), 5000);
      }
    }
  }, [transcript, voiceMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin();
  };

  const handleVoiceLogin = async () => {
    if (!email || !password) {
      speak("Please provide both email and password");
      return;
    }
    await performLogin();
  };

  const performLogin = async () => {
    setLoading(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result) {
        toast.success("Login successful!");
        speak("Login successful! Welcome to CRM");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error || "Login failed");
      speak("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      speak("Please say your email address");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* Voice Mode Indicator */}
      <AnimatePresence>
        {voiceMode && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-primary-600 text-white py-2 px-4 z-50 flex items-center justify-center"
          >
            <FiVolume2 className="mr-2" />
            <span>
              Voice Mode Active -{" "}
              {isListening ? "Listening..." : "Click mic to speak"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl relative">
        {/* Voice Help Button */}
        <button
          onClick={() => setShowVoiceHelp(!showVoiceHelp)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <FiHelpCircle className="h-5 w-5" />
        </button>

        {/* Voice Help Tooltip */}
        <AnimatePresence>
          {showVoiceHelp && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-4 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-600 z-10"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                🎤 Voice Commands:
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                <li>• "my email is [email]"</li>
                <li>• "my password is [password]"</li>
                <li>• "login" or "sign in"</li>
                <li>• "help" for this menu</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-20 w-20 bg-primary-600 rounded-2xl flex items-center justify-center">
                <FiLogIn className="h-10 w-10 text-white" />
              </div>
              {/* Voice Input Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg transition-colors ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <FiMic className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {voiceMode
              ? "🎤 Voice mode active - speak your credentials"
              : "Sign in to your account"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field with Voice Preview */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
                {voiceEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FiVolume2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Voice Status */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-center text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 py-2 rounded-lg"
              >
                {transcript || "Listening... Speak now"}
              </motion.div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoiceLogin;
