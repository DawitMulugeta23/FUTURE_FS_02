// src/pages/Settings.jsx
import { AnimatePresence, motion } from "framer-motion";
import md5 from "md5";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiBell,
  FiCheck,
  FiClock,
  FiCommand,
  FiDatabase,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiHeadphones,
  FiLock,
  FiLogOut,
  FiMail,
  FiMic,
  FiMoon,
  FiRefreshCw,
  FiSave,
  FiSettings as FiSettingsIcon,
  FiShield,
  FiSliders,
  FiSun,
  FiTrash2,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiUsers,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import ProfileAvatar from "../components/Profile/ProfileAvatar";
import { useVoice } from "../context/VoiceContext";
import { logout } from "../store/slices/authSlice";
import { setTheme } from "../store/slices/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  // Voice context with safe fallback
  let voiceContext;
  try {
    voiceContext = useVoice();
  } catch (error) {
    voiceContext = {
      voiceMode: false,
      isListening: false,
      voiceSupported: false,
      transcript: "",
      voiceSettings: {
        wakeWord: "hey crm",
        language: "en-US",
        speed: 1.0,
        pitch: 1.0,
        volume: 1.0,
        autoListen: true,
        voiceFeedback: true,
        continuousListening: false,
      },
      toggleVoiceMode: () => {},
      startListening: () => {},
      stopListening: () => {},
      speak: () => {},
      updateVoiceSettings: () => {},
    };
  }

  const {
    voiceMode,
    isListening,
    voiceSupported,
    transcript,
    voiceSettings,
    toggleVoiceMode,
    startListening,
    stopListening,
    speak,
    updateVoiceSettings,
  } = voiceContext;

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
    mentionAlerts: true,
    commentAlerts: true,
    voiceNotifications: false,
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
    activeSessions: [],
    blockedUsers: [],
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

  const [voiceSettingsLocal, setVoiceSettingsLocal] = useState({
    wakeWord: voiceSettings?.wakeWord || "hey crm",
    language: voiceSettings?.language || "en-US",
    speed: voiceSettings?.speed || 1.0,
    pitch: voiceSettings?.pitch || 1.0,
    volume: voiceSettings?.volume || 1.0,
    autoListen: voiceSettings?.autoListen || true,
    voiceFeedback: voiceSettings?.voiceFeedback || true,
    continuousListening: voiceSettings?.continuousListening || false,
    voiceGender: "female",
    voiceAccent: "us",
    voiceName: "default",
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    commandHistory: [],
    shortcuts: {
      next: "next",
      previous: "previous",
      stop: "stop",
      help: "help",
    },
  });

  const [dataManagement, setDataManagement] = useState({
    autoBackup: true,
    backupFrequency: "weekly",
    dataRetention: "1year",
    exportFormat: "csv",
    compressExports: true,
    includeNotes: true,
    includeActivities: true,
    includeAttachments: false,
    anonymizeData: false,
  });

  // Tabs configuration
  const tabs = [
    { id: "profile", name: "Profile", icon: FiUser, color: "blue" },
    {
      id: "notifications",
      name: "Notifications",
      icon: FiBell,
      color: "yellow",
    },
    { id: "voice", name: "Voice & Audio", icon: FiMic, color: "purple" },
    { id: "appearance", name: "Appearance", icon: FiMoon, color: "indigo" },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: FiShield,
      color: "green",
    },
    { id: "data", name: "Data Management", icon: FiDatabase, color: "orange" },
  ];

  // Sub-tabs for complex sections
  const profileSubTabs = [
    { id: "general", name: "General Info", icon: FiUser },
    { id: "contact", name: "Contact", icon: FiMail },
    { id: "password", name: "Password", icon: FiLock },
    { id: "preferences", name: "Preferences", icon: FiSliders },
  ];

  const notificationSubTabs = [
    { id: "general", name: "General", icon: FiBell },
    { id: "leads", name: "Leads", icon: FiUsers },
    { id: "system", name: "System", icon: FiSettingsIcon },
    { id: "voice", name: "Voice", icon: FiMic },
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
      if (voiceSettingsLocal.voiceFeedback) {
        speak("Profile updated successfully");
      }
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
      `${key.replace(/([A-Z])/g, " $1").trim()} ${!notifications[key] ? "enabled" : "disabled"}`,
    );
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

  // Handle voice settings changes
  const handleVoiceSettingChange = (key, value) => {
    setVoiceSettingsLocal((prev) => ({
      ...prev,
      [key]: value,
    }));

    updateVoiceSettings({ [key]: value });

    if (key === "voiceFeedback" && value) {
      speak("Voice feedback enabled");
    }
  };

  // Test voice
  const testVoice = () => {
    speak(
      "This is a test of your voice settings. Hello, I am your CRM assistant. How can I help you today?",
    );
    toast.success("Voice test initiated");
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
        voiceSettings: voiceSettingsLocal,
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
      if (voiceSettingsLocal.voiceFeedback) {
        speak("Data export completed");
      }
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
    } else if (activeTab === "voice") {
      setVoiceSettingsLocal({
        wakeWord: "hey crm",
        language: "en-US",
        speed: 1.0,
        pitch: 1.0,
        volume: 1.0,
        autoListen: true,
        voiceFeedback: true,
        continuousListening: false,
        voiceGender: "female",
        voiceAccent: "us",
        voiceName: "default",
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
        commandHistory: [],
        shortcuts: {
          next: "next",
          previous: "previous",
          stop: "stop",
          help: "help",
        },
      });
    }

    toast.success("Reset to default settings");
    if (voiceSettingsLocal.voiceFeedback) {
      speak("Settings reset to defaults");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header with Voice Status */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiSettingsIcon className="mr-3 h-8 w-8 text-primary-600 animate-spin-slow" />
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Voice Status Indicator */}
              {voiceSupported && (
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <button
                    onClick={toggleVoiceMode}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      voiceMode
                        ? "bg-primary-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {voiceMode ? (
                      <>
                        <FiVolume2 className="h-4 w-4" />
                        <span>
                          Voice Mode: {isListening ? "Listening" : "Active"}
                        </span>
                        {isListening && (
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <FiVolumeX className="h-4 w-4" />
                        <span>Voice Mode Off</span>
                      </>
                    )}
                  </button>
                  {isListening && (
                    <div className="text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                      "{transcript || "Listening..."}"
                    </div>
                  )}
                </div>
              )}
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
                        className={`h-5 w-5 ${isActive ? colors[tab.color].split(" ")[0] : ""}`}
                      />
                      <span>{tab.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors[tab.color].split(" ")[1]}`}
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
                    {/* Profile Sub-tabs */}
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
                      {/* General Info Sub-tab */}
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      )}

                      {/* Password Sub-tab */}
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
                                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                         focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                         dark:bg-gray-700 dark:text-white"
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                              Password Requirements
                            </h4>
                            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                              <li className="flex items-center">
                                <FiCheck className="h-3 w-3 mr-1" />
                                At least 6 characters
                              </li>
                              <li className="flex items-center">
                                <FiCheck className="h-3 w-3 mr-1" />
                                Include uppercase and lowercase letters
                              </li>
                              <li className="flex items-center">
                                <FiCheck className="h-3 w-3 mr-1" />
                                Include at least one number
                              </li>
                              <li className="flex items-center">
                                <FiCheck className="h-3 w-3 mr-1" />
                                Include at least one special character
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn-primary flex items-center space-x-2 px-6 py-2"
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
                            {Object.entries(notifications)
                              .slice(0, 8)
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                                    <div
                                      className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                                                                  peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 
                                                                                  rounded-full peer dark:bg-gray-600 
                                                                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                                                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                                                  after:h-5 after:w-5 after:transition-all dark:border-gray-500 
                                                                                  peer-checked:bg-primary-600"
                                    ></div>
                                  </label>
                                </div>
                              ))}
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

                      {activeSubTab === "voice" && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Voice Notifications
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Voice Feedback
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Hear spoken feedback for actions
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={voiceSettingsLocal.voiceFeedback}
                                  onChange={(e) =>
                                    handleVoiceSettingChange(
                                      "voiceFeedback",
                                      e.target.checked,
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Wake Word Detection
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Listen for wake word to activate voice mode
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={voiceSettingsLocal.autoListen}
                                  onChange={(e) =>
                                    handleVoiceSettingChange(
                                      "autoListen",
                                      e.target.checked,
                                    )
                                  }
                                  className="sr-only peer"
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

                {/* Voice Tab */}
                {activeTab === "voice" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {!voiceSupported && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-400 flex items-center">
                          <FiAlertCircle className="h-5 w-5 mr-2" />
                          Voice recognition is not supported in your browser.
                          Please use Chrome, Edge, or Safari for voice features.
                        </p>
                      </div>
                    )}

                    {/* Voice Mode Toggle */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-4 rounded-full ${voiceMode ? "bg-white/20 animate-pulse" : "bg-white/10"}`}
                          >
                            {voiceMode ? (
                              <FiVolume2 className="h-8 w-8" />
                            ) : (
                              <FiVolumeX className="h-8 w-8" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {voiceMode
                                ? "Voice Mode Active"
                                : "Voice Mode Inactive"}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                              {voiceMode
                                ? isListening
                                  ? "Listening for commands..."
                                  : "Click the mic to start listening"
                                : "Enable voice mode to control the CRM with your voice"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleVoiceMode}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            voiceMode
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-white text-primary-600 hover:bg-white/90"
                          }`}
                        >
                          {voiceMode ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>

                    {/* Voice Test */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiHeadphones className="mr-2 h-5 w-5 text-primary-500" />
                        Test Voice
                      </h3>
                      <button
                        onClick={testVoice}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FiVolume2 className="h-5 w-5" />
                        <span>Test Voice Feedback</span>
                      </button>
                    </div>

                    {/* Wake Word Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiCommand className="mr-2 h-5 w-5 text-primary-500" />
                        Wake Word
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Wake Word
                          </label>
                          <input
                            type="text"
                            value={voiceSettingsLocal.wakeWord}
                            onChange={(e) =>
                              handleVoiceSettingChange(
                                "wakeWord",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                            placeholder="hey crm"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Say this word to activate voice mode
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Voice Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Language Settings */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiGlobe className="mr-2 h-5 w-5 text-primary-500" />
                          Language
                        </h3>
                        <select
                          value={voiceSettingsLocal.language}
                          onChange={(e) =>
                            handleVoiceSettingChange("language", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                             focus:outline-none focus:ring-2 focus:ring-primary-500
                                                             dark:bg-gray-700 dark:text-white"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="en-AU">English (Australia)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                          <option value="de-DE">German</option>
                          <option value="it-IT">Italian</option>
                          <option value="pt-BR">Portuguese (Brazil)</option>
                          <option value="ru-RU">Russian</option>
                          <option value="ja-JP">Japanese</option>
                          <option value="ko-KR">Korean</option>
                          <option value="zh-CN">Chinese (Simplified)</option>
                          <option value="zh-TW">Chinese (Traditional)</option>
                          <option value="ar-SA">Arabic</option>
                          <option value="hi-IN">Hindi</option>
                        </select>
                      </div>

                      {/* Voice Speed */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiClock className="mr-2 h-5 w-5 text-primary-500" />
                          Voice Speed
                        </h3>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceSettingsLocal.speed}
                            onChange={(e) =>
                              handleVoiceSettingChange(
                                "speed",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Slow (0.5x)</span>
                            <span>Normal (1.0x)</span>
                            <span>Fast (2.0x)</span>
                          </div>
                          <p className="text-center text-primary-600 font-medium mt-2">
                            Current: {voiceSettingsLocal.speed}x
                          </p>
                        </div>
                      </div>

                      {/* Voice Pitch */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiTrendingUp className="mr-2 h-5 w-5 text-primary-500" />
                          Voice Pitch
                        </h3>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceSettingsLocal.pitch}
                            onChange={(e) =>
                              handleVoiceSettingChange(
                                "pitch",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Low</span>
                            <span>Normal</span>
                            <span>High</span>
                          </div>
                          <p className="text-center text-primary-600 font-medium mt-2">
                            Current: {voiceSettingsLocal.pitch}
                          </p>
                        </div>
                      </div>

                      {/* Voice Volume */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiVolume2 className="mr-2 h-5 w-5 text-primary-500" />
                          Volume
                        </h3>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={voiceSettingsLocal.volume}
                            onChange={(e) =>
                              handleVoiceSettingChange(
                                "volume",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Mute</span>
                            <span>Normal</span>
                            <span>Max</span>
                          </div>
                          <p className="text-center text-primary-600 font-medium mt-2">
                            {Math.round(voiceSettingsLocal.volume * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiSliders className="mr-2 h-5 w-5 text-primary-500" />
                        Advanced Audio Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Noise Suppression
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={voiceSettingsLocal.noiseSuppression}
                              onChange={(e) =>
                                handleVoiceSettingChange(
                                  "noiseSuppression",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Echo Cancellation
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={voiceSettingsLocal.echoCancellation}
                              onChange={(e) =>
                                handleVoiceSettingChange(
                                  "echoCancellation",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Auto Gain Control
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={voiceSettingsLocal.autoGainControl}
                              onChange={(e) =>
                                handleVoiceSettingChange(
                                  "autoGainControl",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Continuous Listening
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={voiceSettingsLocal.continuousListening}
                              onChange={(e) =>
                                handleVoiceSettingChange(
                                  "continuousListening",
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

                    {/* Voice Commands List */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiCommand className="mr-2 h-5 w-5 text-primary-500" />
                        Available Voice Commands
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          "Go to dashboard",
                          "Go to leads",
                          "Go to analytics",
                          "Go to settings",
                          "Dark mode",
                          "Light mode",
                          "Create lead",
                          "Search for [term]",
                          "My profile",
                          "Help",
                          "Stop listening",
                          "Logout",
                        ].map((cmd, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <FiVolume2 className="h-3 w-3 text-primary-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              "{cmd}"
                            </span>
                          </div>
                        ))}
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
                    {/* Theme Selector */}
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

                    {/* Font Size */}
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

                    {/* Density */}
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

                    {/* Toggle Options */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Display Options
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Animations
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Enable smooth animations throughout the app
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearance.animations}
                              onChange={(e) =>
                                handleAppearanceChange(
                                  "animations",
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
                              Reduce Motion
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Minimize animations for accessibility
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearance.reduceMotion}
                              onChange={(e) =>
                                handleAppearanceChange(
                                  "reduceMotion",
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
                              High Contrast
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Increase contrast for better visibility
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearance.highContrast}
                              onChange={(e) =>
                                handleAppearanceChange(
                                  "highContrast",
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
                              Show Avatars
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Display profile pictures throughout the app
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearance.showAvatars}
                              onChange={(e) =>
                                handleAppearanceChange(
                                  "showAvatars",
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

                    {/* Date & Time Format */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Date & Time Format
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Format
                          </label>
                          <select
                            value={appearance.dateFormat}
                            onChange={(e) =>
                              handleAppearanceChange(
                                "dateFormat",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="MMMM DD, YYYY">
                              Month DD, YYYY
                            </option>
                            <option value="DD MMMM YYYY">DD Month YYYY</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Format
                          </label>
                          <select
                            value={appearance.timeFormat}
                            onChange={(e) =>
                              handleAppearanceChange(
                                "timeFormat",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
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
                            value={appearance.firstDayOfWeek}
                            onChange={(e) =>
                              handleAppearanceChange(
                                "firstDayOfWeek",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="monday">Monday</option>
                            <option value="sunday">Sunday</option>
                            <option value="saturday">Saturday</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default View
                          </label>
                          <select
                            value={appearance.defaultView}
                            onChange={(e) =>
                              handleAppearanceChange(
                                "defaultView",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="dashboard">Dashboard</option>
                            <option value="leads">Leads</option>
                            <option value="analytics">Analytics</option>
                          </select>
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
                    {/* Profile Visibility */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        {["public", "contacts", "private"].map((visibility) => (
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
                                {visibility === "public" &&
                                  "Anyone can see your profile"}
                                {visibility === "contacts" &&
                                  "Only your contacts can see your profile"}
                                {visibility === "private" &&
                                  "Only you can see your profile"}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Information Visibility */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Information Visibility
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "showEmail",
                            label: "Email Address",
                            description: "Show your email on your profile",
                          },
                          {
                            key: "showPhone",
                            label: "Phone Number",
                            description:
                              "Show your phone number on your profile",
                          },
                          {
                            key: "showCompany",
                            label: "Company",
                            description: "Show your company on your profile",
                          },
                          {
                            key: "showPosition",
                            label: "Position",
                            description:
                              "Show your job position on your profile",
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

                    {/* Data Collection */}
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

                    {/* Security */}
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

                    {/* Active Sessions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Active Sessions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                              <FiGlobe className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Chrome on Windows
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                IP: 192.168.1.1 • Last active: Now
                              </p>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded-full">
                            Current
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <FiGlobe className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Safari on MacOS
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                IP: 192.168.1.2 • Last active: 2 hours ago
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-red-600 hover:text-red-700">
                            Revoke
                          </button>
                        </div>
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
                    {/* Export Data */}
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
                            >
                              <option value="csv">CSV (Spreadsheet)</option>
                              <option value="json">JSON (Raw Data)</option>
                              <option value="pdf">PDF (Report)</option>
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
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                     dark:bg-gray-700 dark:text-white"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="never">Never</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Include Notes
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dataManagement.includeNotes}
                                onChange={(e) =>
                                  setDataManagement({
                                    ...dataManagement,
                                    includeNotes: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Include Activities
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dataManagement.includeActivities}
                                onChange={(e) =>
                                  setDataManagement({
                                    ...dataManagement,
                                    includeActivities: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Include Attachments
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dataManagement.includeAttachments}
                                onChange={(e) =>
                                  setDataManagement({
                                    ...dataManagement,
                                    includeAttachments: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Anonymize Data
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dataManagement.anonymizeData}
                                onChange={(e) =>
                                  setDataManagement({
                                    ...dataManagement,
                                    anonymizeData: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleExportData}
                          className="btn-primary flex items-center space-x-2 px-6 py-2"
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

                    {/* Data Retention */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Data Retention
                      </h3>
                      <div className="space-y-4">
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
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                                 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="1month">1 month</option>
                            <option value="3months">3 months</option>
                            <option value="6months">6 months</option>
                            <option value="1year">1 year</option>
                            <option value="2years">2 years</option>
                            <option value="forever">Forever</option>
                          </select>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Data older than this will be automatically archived or
                          deleted based on your settings
                        </p>
                      </div>
                    </div>

                    {/* Danger Zone */}
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
