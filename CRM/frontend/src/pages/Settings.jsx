// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import SettingsHeader from "../components/Settings/SettingsHeader";
import SettingsLayout from "../components/Settings/SettingsLayout";
import SettingsTabs from "../components/Settings/SettingsTabs";
import AppearanceTab from "../components/Settings/appearance/AppearanceTab";
import DataTab from "../components/Settings/data/DataTab";
import NotificationsTab from "../components/Settings/notifications/NotificationsTab";
import PrivacyTab from "../components/Settings/privacy/PrivacyTab";
import ProfileTab from "../components/Settings/profile/ProfileTab";
import VoiceTab from "../components/Settings/voice/VoiceTab";
import { useVoice } from "../context/VoiceContext";

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

  // Get tab from URL or default to 'profile'
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const [activeTab, setActiveTab] = useState("profile");
  const [activeSubTab, setActiveSubTab] = useState("general");

  // Form states - moved to their respective components
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
    /* ... */
  });
  const [privacy, setPrivacy] = useState({
    /* ... */
  });
  const [appearance, setAppearance] = useState({
    /* ... */
  });
  const [voiceSettingsLocal, setVoiceSettingsLocal] = useState({
    /* ... */
  });
  const [dataManagement, setDataManagement] = useState({
    /* ... */
  });

  // Set active tab from URL
  useEffect(() => {
    if (
      tabFromUrl &&
      [
        "profile",
        "notifications",
        "voice",
        "appearance",
        "privacy",
        "data",
      ].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Tab configuration
  const tabs = [
    { id: "profile", name: "Profile", icon: "FiUser", color: "blue" },
    {
      id: "notifications",
      name: "Notifications",
      icon: "FiBell",
      color: "yellow",
    },
    { id: "voice", name: "Voice & Audio", icon: "FiMic", color: "purple" },
    { id: "appearance", name: "Appearance", icon: "FiMoon", color: "indigo" },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: "FiShield",
      color: "green",
    },
    {
      id: "data",
      name: "Data Management",
      icon: "FiDatabase",
      color: "orange",
    },
  ];

  // Handlers - passed down to components
  const handleTabChange = (tabId) => setActiveTab(tabId);
  const handleSubTabChange = (subTabId) => setActiveSubTab(subTabId);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // ... existing logic
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    if (key === "theme") dispatch(setTheme(value));
  };

  const handleVoiceSettingChange = (key, value) => {
    setVoiceSettingsLocal((prev) => ({ ...prev, [key]: value }));
    voiceContext.updateVoiceSettings?.({ [key]: value });
  };

  const handleDataManagementChange = (key, value) => {
    setDataManagement((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    // ... existing logic
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <SettingsHeader
              voiceContext={voiceContext}
              isListening={voiceContext.isListening}
              transcript={voiceContext.transcript}
            />

            <SettingsLayout>
              <SettingsTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />

              <div className="p-6">
                {activeTab === "profile" && (
                  <ProfileTab
                    user={user}
                    profileForm={profileForm}
                    activeSubTab={activeSubTab}
                    onSubTabChange={handleSubTabChange}
                    onProfileChange={handleProfileChange}
                    onProfileSubmit={handleProfileSubmit}
                    voiceFeedback={voiceSettingsLocal.voiceFeedback}
                    speak={voiceContext.speak}
                  />
                )}

                {activeTab === "notifications" && (
                  <NotificationsTab
                    notifications={notifications}
                    voiceSettingsLocal={voiceSettingsLocal}
                    activeSubTab={activeSubTab}
                    onSubTabChange={handleSubTabChange}
                    onNotificationChange={handleNotificationChange}
                    onVoiceSettingChange={handleVoiceSettingChange}
                  />
                )}

                {activeTab === "voice" && (
                  <VoiceTab
                    voiceContext={voiceContext}
                    voiceSettingsLocal={voiceSettingsLocal}
                    onVoiceSettingChange={handleVoiceSettingChange}
                    onTestVoice={() =>
                      voiceContext.speak?.(
                        "This is a test of your voice settings.",
                      )
                    }
                  />
                )}

                {activeTab === "appearance" && (
                  <AppearanceTab
                    appearance={appearance}
                    onAppearanceChange={handleAppearanceChange}
                  />
                )}

                {activeTab === "privacy" && (
                  <PrivacyTab
                    privacy={privacy}
                    onPrivacyChange={handlePrivacyChange}
                  />
                )}

                {activeTab === "data" && (
                  <DataTab
                    dataManagement={dataManagement}
                    onDataManagementChange={handleDataManagementChange}
                    onExportData={() => {}} // Add handler
                    onDeleteAccount={() => {}} // Add handler
                    onLogout={() => {}} // Add handler
                  />
                )}
              </div>
            </SettingsLayout>

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
