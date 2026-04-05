import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import { setSidebarOpen } from "./store/slices/uiSlice";
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
  const { theme, fontSize } = useSelector((state) => state.ui);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop, restore saved preference or default to open
        const savedState = localStorage.getItem("sidebarOpen");
        if (savedState === null) {
          dispatch(setSidebarOpen(true));
        }
      } else {
        // On mobile, always close sidebar initially
        dispatch(setSidebarOpen(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Apply theme and font size
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    );
    root.classList.add(`font-size-${fontSize}`);
  }, [theme, fontSize]);

  return (
    <>
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
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
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
