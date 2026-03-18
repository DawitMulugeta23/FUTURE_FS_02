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
import Login from "./components/Auth/Login"; // Change from VoiceLogin to regular Login
import Register from "./components/Auth/Register";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import { store } from "./store/store";

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

// Main App Content
function AppContent() {
  const dispatch = useDispatch();
  const { theme, fontSize, highContrast, reduceMotion } = useSelector(
    (state) => state.ui,
  );
  const location = useLocation();

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
  }, [theme, fontSize, highContrast, reduceMotion]);

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
              <Login />
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

// Main App
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
