// src/App.jsx
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Register from "./components/Auth/Register";
import VoiceLogin from "./components/Auth/VoiceLogin";
import VoiceCommandBar from "./components/Voice/VoiceCommandBar";
import { VoiceProvider, useVoice } from "./context/VoiceContext";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import { store } from "./store/store";

// Add global CSS for accessibility
const accessibilityStyles = `
    /* High contrast mode */
    .high-contrast {
        filter: contrast(1.5);
    }
    
    .high-contrast.dark {
        background-color: #000 !important;
        color: #fff !important;
    }
    
    .high-contrast.light {
        background-color: #fff !important;
        color: #000 !important;
    }
    
    .high-contrast a {
        color: #ffff00 !important;
        text-decoration: underline !important;
    }
    
    .high-contrast button {
        border: 2px solid currentColor !important;
    }
    
    /* Focus indicators for keyboard navigation */
    *:focus-visible {
        outline: 3px solid #ffbf00 !important;
        outline-offset: 2px !important;
    }
    
    /* Reduce motion */
    .reduce-motion * {
        animation: none !important;
        transition: none !important;
    }
    
    /* Font size classes */
    .text-sm {
        font-size: 14px !important;
    }
    
    .text-base {
        font-size: 16px !important;
    }
    
    .text-lg {
        font-size: 18px !important;
    }
    
    .text-xl {
        font-size: 20px !important;
    }
    
    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = accessibilityStyles;
document.head.appendChild(styleSheet);

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return !user ? children : <Navigate to="/dashboard" />;
};

// Main App Content with Voice
function AppContent() {
  const dispatch = useDispatch();
  const { theme, fontSize, highContrast, reduceMotion } = useSelector(
    (state) => state.ui,
  );
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Use voice context safely
  let voiceContext;
  let voiceMode = false;
  let screenReaderMode = false;
  let announcePageChange = () => {};

  try {
    voiceContext = useVoice();
    voiceMode = voiceContext.voiceMode;
    screenReaderMode = voiceContext.screenReaderMode;
    announcePageChange = voiceContext.announcePageChange;
  } catch (error) {
    console.log("Voice context not available yet");
  }

  // Apply theme and accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
    }

    // Apply font size
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    root.classList.add(`text-${fontSize}`);
    document.body.style.fontSize =
      fontSize === "small" ? "14px" : fontSize === "medium" ? "16px" : "18px";

    // Apply high contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply reduce motion
    if (reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    setInitialized(true);
  }, [theme, fontSize, highContrast, reduceMotion]);

  // Announce page changes for screen reader
  useEffect(() => {
    if (initialized && screenReaderMode && announcePageChange) {
      const pageName = location.pathname.replace("/", "") || "dashboard";
      announcePageChange(pageName);
    }
  }, [location.pathname, initialized, screenReaderMode, announcePageChange]);

  // Check if user might be blind (can add a URL parameter for demo)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessibilityMode = urlParams.get("accessibility");

    if (accessibilityMode === "blind" && !voiceMode) {
      // Auto-activate voice mode for blind users
      setTimeout(() => {
        if (voiceContext && voiceContext.toggleVoiceMode) {
          voiceContext.toggleVoiceMode();
        }
      }, 2000);
    }
  }, []);

  // Don't show voice command bar on login/register pages
  const showVoiceBar =
    voiceMode && !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-600 focus:text-white focus:p-4 focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <VoiceLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div
                id="main-content"
                tabIndex="-1"
                className="focus:outline-none"
              >
                <Dashboard />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <div
                id="main-content"
                tabIndex="-1"
                className="focus:outline-none"
              >
                <Leads />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <div
                id="main-content"
                tabIndex="-1"
                className="focus:outline-none"
              >
                <Analytics />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <div
                id="main-content"
                tabIndex="-1"
                className="focus:outline-none"
              >
                <Help />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <div
                id="main-content"
                tabIndex="-1"
                className="focus:outline-none"
              >
                <Settings />
              </div>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>

      {showVoiceBar && <VoiceCommandBar />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === "dark" ? "#1f2937" : "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

// Main App with Providers in correct order
function App() {
  return (
    <Provider store={store}>
      <Router>
        <VoiceProvider>
          <AppContent />
        </VoiceProvider>
      </Router>
    </Provider>
  );
}

export default App;
