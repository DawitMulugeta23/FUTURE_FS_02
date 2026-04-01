// src/pages/Settings.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import AppearanceTab from "../components/Settings/AppearanceTab";
import DataTab from "../components/Settings/DataTab";
import NotificationsTab from "../components/Settings/NotificationsTab";
import PreferencesTab from "../components/Settings/PreferencesTab";
import PrivacyTab from "../components/Settings/PrivacyTab";
import ProfileTab from "../components/Settings/ProfileTab";
import SettingsLayout from "../components/Settings/SettingsLayout";
import SettingsTabs from "../components/Settings/SettingsTabs";
import { setTheme } from "../store/slices/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Profile", icon: "FiUser", color: "blue" },
    {
      id: "preferences",
      name: "Preferences",
      icon: "FiSliders",
      color: "indigo",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "FiBell",
      color: "yellow",
    },
    { id: "appearance", name: "Appearance", icon: "FiMoon", color: "purple" },
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

  useEffect(() => {
    if (tabFromUrl && tabs.some((tab) => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;
      case "preferences":
        return <PreferencesTab />;
      case "notifications":
        return <NotificationsTab />;
      case "appearance":
        return (
          <AppearanceTab
            theme={theme}
            setTheme={(t) => dispatch(setTheme(t))}
          />
        );
      case "privacy":
        return <PrivacyTab />;
      case "data":
        return <DataTab navigate={navigate} />;
      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FiSettings className="mr-3 h-8 w-8 text-primary-600" />
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </motion.div>

            <SettingsLayout>
              <SettingsTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="p-6">{renderActiveTab()}</div>
            </SettingsLayout>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
