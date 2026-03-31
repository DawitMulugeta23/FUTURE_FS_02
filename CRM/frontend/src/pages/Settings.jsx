// src/pages/Settings.jsx
import { AnimatePresence, motion } from "framer-motion";
import md5 from "md5";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiBell,
  FiCheck,
  FiDatabase,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogOut,
  FiMoon,
  FiRefreshCw,
  FiSave,
  FiSettings as FiSettingsIcon,
  FiShield,
  FiSun,
  FiTrash2,
  FiUpload,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import ProfileAvatar from "../components/Profile/ProfileAvatar";
import { logout } from "../store/slices/authSlice";
import { setTheme } from "../store/slices/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  // Get tab from URL or default to 'profile'
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("general");

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    position: user?.position || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    leadUpdates: true,
    taskReminders: true,
    weeklyReports: true,
    monthlyReports: false,
    marketingEmails: false,
    productUpdates: false,
    securityAlerts: true,
    loginAlerts: true,
    desktopNotifications: true,
    mobileNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showCompany: true,
    showPosition: true,
    allowDataCollection: true,
    allowAnalytics: true,
    allowCookies: true,
    twoFactorAuth: false,
    loginNotifications: true,
    deviceHistory: true,
  });

  const [appearance, setAppearance] = useState({
    theme: theme,
    fontSize: "medium",
    density: "comfortable",
    animations: true,
    reduceMotion: false,
    highContrast: false,
    sidebarCollapsed: false,
    showAvatars: true,
    showGravatars: true,
    defaultView: "dashboard",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: "monday",
    colorScheme: "default",
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: "monday",
    notificationsEnabled: true,
    autoSave: true,
    autoRefresh: true,
    refreshInterval: "30",
    debugMode: false,
    analyticsTracking: true,
    errorReporting: true,
  });

  const [dataManagement, setDataManagement] = useState({
    autoBackup: true,
    backupFrequency: "weekly",
    dataRetention: "1year",
    exportFormat: "csv",
    includeNotes: true,
    includeActivities: true,
    includeAttachments: false,
    anonymizeData: false,
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: FiUser, color: "blue" },
    {
      id: "notifications",
      name: "Notifications",
      icon: FiBell,
      color: "yellow",
    },
    { id: "appearance", name: "Appearance", icon: FiMoon, color: "indigo" },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: FiShield,
      color: "green",
    },
    { id: "system", name: "System", icon: FiSettingsIcon, color: "purple" },
    { id: "data", name: "Data Management", icon: FiDatabase, color: "orange" },
  ];

  // Sub-tabs for complex sections
  const profileSubTabs = [
    { id: "general", name: "General Info", icon: FiUser },
    { id: "password", name: "Password", icon: FiLock },
  ];

  const notificationSubTabs = [
    { id: "general", name: "General", icon: FiBell },
    { id: "leads", name: "Leads", icon: FiUsers },
    { id: "system", name: "System", icon: FiSettingsIcon },
  ];

  // Set active tab from URL
  useEffect(() => {
    if (tabFromUrl && tabs.some((tab) => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Generate Gravatar URL
  useEffect(() => {
    if (profileForm.email) {
      const hash = md5(profileForm.email.toLowerCase().trim());
      setGravatarUrl(`https://www.gravatar.com/avatar/${hash}?d=404&s=256`);
    }
  }, [profileForm.email]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (
      profileForm.newPassword &&
      profileForm.newPassword !== profileForm.confirmPassword
    ) {
      toast.error("New passwords do not match");
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsSaving(false);
    }, 1500);
  };

  // Handle notification toggles
  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success(
      `${key.replace(/([A-Z])/g, " $1").trim()} ${
        !notifications[key] ? "enabled" : "disabled"
      }`,
    );
  };

  // Handle system setting changes
  const handleSystemChange = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    toast.success(`${key.replace(/([A-Z])/g, " $1").trim()} updated`);
  };

  // Handle privacy toggles
  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
    toast.success("Privacy settings updated");
  };

  // Handle appearance changes
  const handleAppearanceChange = (key, value) => {
    setAppearance((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "theme") {
      dispatch(setTheme(value));
    }

    toast.success("Appearance settings updated");
  };

  // Handle data export
  const handleExportData = () => {
    toast.loading("Preparing your data export...", { id: "export" });

    setTimeout(() => {
      const data = {
        profile: profileForm,
        notifications,
        privacy,
        appearance,
        systemSettings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `crm-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();

      toast.success("Data exported successfully!", { id: "export" });
    }, 2000);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    toast.loading("Deleting account...", { id: "delete" });

    setTimeout(() => {
      localStorage.clear();
      dispatch(logout());
      navigate("/login");
      toast.success("Account deleted successfully", { id: "delete" });
    }, 2000);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (activeTab === "appearance") {
      setAppearance({
        theme: "light",
        fontSize: "medium",
        density: "comfortable",
        animations: true,
        reduceMotion: false,
        highContrast: false,
        sidebarCollapsed: false,
        showAvatars: true,
        showGravatars: true,
        defaultView: "dashboard",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        firstDayOfWeek: "monday",
        colorScheme: "default",
      });
      dispatch(setTheme("light"));
    } else if (activeTab === "system") {
      setSystemSettings({
        language: "en",
        timezone: "UTC",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        firstDayOfWeek: "monday",
        notificationsEnabled: true,
        autoSave: true,
        autoRefresh: true,
        refreshInterval: "30",
        debugMode: false,
        analyticsTracking: true,
        errorReporting: true,
      });
    }
    toast.success("Reset to default settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FiSettingsIcon className="mr-3 h-8 w-8 text-primary-600 animate-spin-slow" />
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </motion.div>

            {/* Settings Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b dark:border-gray-700 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const colors = {
                    blue: "text-blue-600 border-blue-600",
                    yellow: "text-yellow-600 border-yellow-600",
                    purple: "text-purple-600 border-purple-600",
                    indigo: "text-indigo-600 border-indigo-600",
                    green: "text-green-600 border-green-600",
                    orange: "text-orange-600 border-orange-600",
                  };

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                        isActive
                          ? `${colors[tab.color]} bg-${tab.color}-50 dark:bg-${tab.color}-900/10`
                          : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? colors[tab.color].split(" ")[0] : ""
                        }`}
                      />
                      <span>{tab.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                            colors[tab.color].split(" ")[1]
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 pb-2">
                      {profileSubTabs.map((subTab) => (
                        <button
                          key={subTab.id}
                          onClick={() => setActiveSubTab(subTab.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeSubTab === subTab.id
                              ? "bg-primary-600 text-white"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <subTab.icon className="h-4 w-4" />
                          <span>{subTab.name}</span>
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                      {activeSubTab === "general" && (
                        <div className="space-y-6">
                          <div className="flex items-center space-x-6">
                            <ProfileAvatar user={user} size="2xl" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Profile Picture
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Click on the avatar to upload a new photo or use
                                Gravatar
                              </p>
                              {gravatarUrl && (
                                <p className="text-xs text-primary-600 mt-2">
                                  Gravatar detected for this email
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="john@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="+1 234 567 890"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company
                              </label>
                              <input
                                type="text"
                                name="company"
                                value={profileForm.company}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Acme Inc."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Job Position
                              </label>
                              <input
                                type="text"
                                name="position"
                                value={profileForm.position}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Product Manager"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={profileForm.location}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="New York, NY"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              value={profileForm.bio}
                              onChange={handleProfileChange}
                              rows="4"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Tell us about yourself..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Website
                            </label>
                            <input
                              type="url"
                              name="website"
                              value={profileForm.website}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      )}

                      {activeSubTab === "password" && (
                        <div className="space-y-6">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center">
                              <FiAlertCircle className="h-5 w-5 mr-2" />
                              Change your password regularly to keep your
                              account secure
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="currentPassword"
                                value={profileForm.currentPassword}
                                onChange={handleProfileChange}
                                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={profileForm.newPassword}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Enter new password"
                              minLength="6"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 6 characters long
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={profileForm.confirmPassword}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                        >
                          {isSaving ? (
                            <>
                              <FiRefreshCw className="h-4 w-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <FiSave className="h-4 w-4" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 pb-2">
                      {notificationSubTabs.map((subTab) => (
                        <button
                          key={subTab.id}
                          onClick={() => setActiveSubTab(subTab.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeSubTab === subTab.id
                              ? "bg-primary-600 text-white"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <subTab.icon className="h-4 w-4" />
                          <span>{subTab.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-6">
                      {activeSubTab === "general" && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            General Notifications
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(notifications).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Receive notifications for{" "}
                                      {key
                                        .replace(/([A-Z])/g, " $1")
                                        .toLowerCase()}
                                    </p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={value}
                                      onChange={() =>
                                        handleNotificationChange(key)
                                      }
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                                  </label>
                                </div>
                              ),
                            )}
                          </div>
                        </>
                      )}

                      {activeSubTab === "leads" && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Lead Notifications
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    New Lead Created
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Get notified when a new lead is added
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                                </label>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    Lead Status Changed
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Get notified when lead status changes
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                                </label>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    Lead Converted
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Get notified when a lead converts
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                                </label>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    Follow-up Reminders
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Get reminded to follow up with leads
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeSubTab === "system" && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            System Notifications
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  System Updates
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Get notified about system updates and
                                  maintenance
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Security Alerts
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Get notified about security events
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* System Tab */}
                {activeTab === "system" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Language & Region */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Language & Region
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={systemSettings.language}
                            onChange={(e) =>
                              handleSystemChange("language", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timezone
                          </label>
                          <select
                            value={systemSettings.timezone}
                            onChange={(e) =>
                              handleSystemChange("timezone", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">
                              Eastern Time
                            </option>
                            <option value="America/Chicago">
                              Central Time
                            </option>
                            <option value="America/Denver">
                              Mountain Time
                            </option>
                            <option value="America/Los_Angeles">
                              Pacific Time
                            </option>
                            <option value="Europe/London">London</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Format
                          </label>
                          <select
                            value={systemSettings.dateFormat}
                            onChange={(e) =>
                              handleSystemChange("dateFormat", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Format
                          </label>
                          <select
                            value={systemSettings.timeFormat}
                            onChange={(e) =>
                              handleSystemChange("timeFormat", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="12h">12-hour (12:00 PM)</option>
                            <option value="24h">24-hour (13:00)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Day of Week
                          </label>
                          <select
                            value={systemSettings.firstDayOfWeek}
                            onChange={(e) =>
                              handleSystemChange(
                                "firstDayOfWeek",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="monday">Monday</option>
                            <option value="sunday">Sunday</option>
                            <option value="saturday">Saturday</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Application Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Application Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Auto-save
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatically save changes while editing
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.autoSave}
                              onChange={(e) =>
                                handleSystemChange("autoSave", e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Auto-refresh
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatically refresh data
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.autoRefresh}
                              onChange={(e) =>
                                handleSystemChange(
                                  "autoRefresh",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        {systemSettings.autoRefresh && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Refresh Interval (seconds)
                            </label>
                            <select
                              value={systemSettings.refreshInterval}
                              onChange={(e) =>
                                handleSystemChange(
                                  "refreshInterval",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="15">15 seconds</option>
                              <option value="30">30 seconds</option>
                              <option value="60">1 minute</option>
                              <option value="300">5 minutes</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Privacy & Data */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Privacy & Data
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Analytics Tracking
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Help improve the product by sharing anonymous
                              usage data
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.analyticsTracking}
                              onChange={(e) =>
                                handleSystemChange(
                                  "analyticsTracking",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Error Reporting
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatically report errors to help fix issues
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.errorReporting}
                              onChange={(e) =>
                                handleSystemChange(
                                  "errorReporting",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Debug Mode
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Enable debug logging for troubleshooting
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.debugMode}
                              onChange={(e) =>
                                handleSystemChange(
                                  "debugMode",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        {["public", "private"].map((visibility) => (
                          <label
                            key={visibility}
                            className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={visibility}
                              checked={privacy.profileVisibility === visibility}
                              onChange={(e) =>
                                handlePrivacyChange(
                                  "profileVisibility",
                                  e.target.value,
                                )
                              }
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">
                                {visibility}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {visibility === "public"
                                  ? "Anyone can see your profile"
                                  : "Only you can see your profile"}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Data Collection
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "allowDataCollection",
                            label: "Usage Data",
                            description:
                              "Allow anonymous usage data collection to improve the product",
                          },
                          {
                            key: "allowAnalytics",
                            label: "Analytics",
                            description: "Allow analytics tracking",
                          },
                          {
                            key: "allowCookies",
                            label: "Cookies",
                            description:
                              "Allow essential cookies for functionality",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={privacy[item.key]}
                                onChange={() => handlePrivacyChange(item.key)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Security
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handlePrivacyChange(
                                "twoFactorAuth",
                                !privacy.twoFactorAuth,
                              )
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              privacy.twoFactorAuth
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {privacy.twoFactorAuth ? "Enabled" : "Enable"}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Login Notifications
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Get notified of new login attempts
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.loginNotifications}
                              onChange={() =>
                                handlePrivacyChange("loginNotifications")
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Device History
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Track devices that have accessed your account
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy.deviceHistory}
                              onChange={() =>
                                handlePrivacyChange("deviceHistory")
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["light", "dark", "system"].map((themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() =>
                              handleAppearanceChange("theme", themeOption)
                            }
                            className={`p-4 rounded-lg border-2 transition-all ${
                              appearance.theme === themeOption
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {themeOption === "light" && (
                                <FiSun className="h-5 w-5 text-yellow-500" />
                              )}
                              {themeOption === "dark" && (
                                <FiMoon className="h-5 w-5 text-blue-500" />
                              )}
                              {themeOption === "system" && (
                                <FiSettingsIcon className="h-5 w-5 text-gray-500" />
                              )}
                              {appearance.theme === themeOption && (
                                <FiCheck className="h-4 w-4 text-primary-600" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {themeOption}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {themeOption === "light" &&
                                "Light mode for daytime"}
                              {themeOption === "dark" &&
                                "Dark mode for nighttime"}
                              {themeOption === "system" &&
                                "Follow system preference"}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Font Size
                      </h3>
                      <div className="flex space-x-2">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              handleAppearanceChange("fontSize", size)
                            }
                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                              appearance.fontSize === size
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                            }`}
                          >
                            <span
                              className={`block text-center capitalize ${
                                size === "small"
                                  ? "text-sm"
                                  : size === "medium"
                                    ? "text-base"
                                    : "text-lg"
                              }`}
                            >
                              {size}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Layout Density
                      </h3>
                      <div className="flex space-x-2">
                        {["comfortable", "compact"].map((density) => (
                          <button
                            key={density}
                            onClick={() =>
                              handleAppearanceChange("density", density)
                            }
                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                              appearance.density === density
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                            }`}
                          >
                            <span className="block text-center capitalize">
                              {density}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              {density === "comfortable"
                                ? "More spacing"
                                : "Tighter layout"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Display Options
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "animations",
                            label: "Animations",
                            desc: "Enable smooth animations",
                          },
                          {
                            key: "reduceMotion",
                            label: "Reduce Motion",
                            desc: "Minimize animations for accessibility",
                          },
                          {
                            key: "highContrast",
                            label: "High Contrast",
                            desc: "Increase contrast for better visibility",
                          },
                          {
                            key: "showAvatars",
                            label: "Show Avatars",
                            desc: "Display profile pictures",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.desc}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={appearance[item.key]}
                                onChange={(e) =>
                                  handleAppearanceChange(
                                    item.key,
                                    e.target.checked,
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Data Management Tab */}
                {activeTab === "data" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Export Your Data
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Download a copy of all your leads, notes, activities,
                        and account information
                      </p>

                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Export Format
                            </label>
                            <select
                              value={dataManagement.exportFormat}
                              onChange={(e) =>
                                setDataManagement({
                                  ...dataManagement,
                                  exportFormat: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="csv">CSV (Spreadsheet)</option>
                              <option value="json">JSON (Raw Data)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Backup Frequency
                            </label>
                            <select
                              value={dataManagement.backupFrequency}
                              onChange={(e) =>
                                setDataManagement({
                                  ...dataManagement,
                                  backupFrequency: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="never">Never</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[
                            { key: "includeNotes", label: "Include Notes" },
                            {
                              key: "includeActivities",
                              label: "Include Activities",
                            },
                            {
                              key: "includeAttachments",
                              label: "Include Attachments",
                            },
                            { key: "anonymizeData", label: "Anonymize Data" },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {item.label}
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dataManagement[item.key]}
                                  onChange={(e) =>
                                    setDataManagement({
                                      ...dataManagement,
                                      [item.key]: e.target.checked,
                                    })
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleExportData}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                        >
                          <FiDownload className="h-4 w-4" />
                          <span>Export Data</span>
                        </button>
                        <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
                          <FiUpload className="h-4 w-4" />
                          <span>Schedule Backup</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Data Retention
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Keep data for
                        </label>
                        <select
                          value={dataManagement.dataRetention}
                          onChange={(e) =>
                            setDataManagement({
                              ...dataManagement,
                              dataRetention: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="1month">1 month</option>
                          <option value="3months">3 months</option>
                          <option value="6months">6 months</option>
                          <option value="1year">1 year</option>
                          <option value="forever">Forever</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Data older than this will be automatically archived or
                          deleted based on your settings
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
                      <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center">
                        <FiAlertCircle className="mr-2 h-5 w-5" />
                        Danger Zone
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={handleDeleteAccount}
                          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FiTrash2 className="h-5 w-5" />
                          <span>Delete Account</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FiLogOut className="h-5 w-5" />
                          <span>Sign Out from All Devices</span>
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    <AnimatePresence>
                      {showDeleteConfirm && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="text-center">
                              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <FiAlertCircle className="h-6 w-6 text-red-600" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Delete Account
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete your account?
                                All of your data will be permanently removed.
                                This action cannot be undone.
                              </p>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => setShowDeleteConfirm(false)}
                                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={confirmDeleteAccount}
                                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Reset to Defaults Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;