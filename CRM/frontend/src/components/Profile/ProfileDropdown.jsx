// src/components/Profile/ProfileDropdown.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBell,
  FiChevronDown,
  FiDatabase,
  FiHelpCircle,
  FiLogOut,
  FiMail,
  FiMoon,
  FiSettings,
  FiShield,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { setTheme } from "../../store/slices/uiSlice";
import ProfileAvatar from "./ProfileAvatar";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: FiUser,
      label: "My Profile",
      path: "/settings?tab=profile",
      color: "text-blue-500",
    },
    {
      icon: FiSettings,
      label: "Settings",
      path: "/settings",
      color: "text-purple-500",
    },
    {
      icon: FiBell,
      label: "Notifications",
      path: "/settings?tab=notifications",
      color: "text-yellow-500",
    },
    {
      icon: FiShield,
      label: "Privacy",
      path: "/settings?tab=privacy",
      color: "text-green-500",
    },
    {
      icon: FiDatabase,
      label: "Data",
      path: "/settings?tab=data",
      color: "text-orange-500",
    },
    {
      icon: FiHelpCircle,
      label: "Help & Support",
      path: "/help",
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
      >
        <ProfileAvatar user={user} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
            {user?.email}
          </p>
        </div>
        <FiChevronDown
          className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex items-center space-x-3">
                <ProfileAvatar user={user} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-white/80 truncate flex items-center">
                    <FiMail className="h-3 w-3 mr-1" />
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === "light" ? (
                    <FiSun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <FiMoon className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </span>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  style={{
                    backgroundColor: theme === "dark" ? "#4f46e5" : "#d1d5db",
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 p-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center space-x-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="flex-1 text-left text-sm font-medium">
                  Logout
                </span>
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Version 2.0.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
