// src/App.jsx
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Auth/Login";
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
  const { theme, fontSize } = useSelector((state) => state.ui);

  // Apply theme and font size
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply font size - remove existing classes first
    root.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    );
    root.classList.add(`font-size-${fontSize}`);
  }, [theme, fontSize]);

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
