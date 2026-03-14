// src/App.jsx
import { useEffect } from "react";
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
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import { setTheme } from "./store/slices/uiSlice";
import { store } from "./store/store";
import Help from "./pages/Help";

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
  const theme = useSelector((state) => state.ui?.theme || "light");
  const location = useLocation();

  // Use voice context safely - it will be defined because we're inside VoiceProvider
  let voiceMode = false;
  try {
    const voice = useVoice();
    voiceMode = voice.voiceMode;
  } catch (error) {
    console.log("Voice context not available yet");
  }

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        dispatch(setTheme(e.matches ? "dark" : "light"));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  // Don't show voice command bar on login/register pages
  const showVoiceBar =
    voiceMode && !["/login", "/register"].includes(location.pathname);

  return (
    <>
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
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <Leads />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route path="/help" element={
            <PrivateRoute>
                <Help />
            </PrivateRoute>
        } />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
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
