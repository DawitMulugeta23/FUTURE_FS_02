// src/components/Settings/NotificationsTab.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiBell, FiMail, FiRefreshCw, FiSave } from "react-icons/fi";

const NotificationsTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("general");
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
    desktopNotifications: true,
    mobileNotifications: true,
  });

  const subTabs = [
    { id: "general", name: "General", icon: FiBell },
    { id: "leads", name: "Leads", icon: FiMail },
    { id: "system", name: "System", icon: FiRefreshCw },
  ];

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(
      `${key.replace(/([A-Z])/g, " $1").trim()} ${!notifications[key] ? "enabled" : "disabled"}`,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Notification settings saved");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 pb-2">
        {subTabs.map((subTab) => (
          <button
            key={subTab.id}
            type="button"
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
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Receive notifications for{" "}
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleToggle(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
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
              {[
                {
                  key: "leadUpdates",
                  label: "Lead Updates",
                  desc: "Get notified when lead information changes",
                },
                {
                  key: "taskReminders",
                  label: "Task Reminders",
                  desc: "Get reminded about upcoming tasks",
                },
                {
                  key: "mentionAlerts",
                  label: "Mentions",
                  desc: "Get notified when you're mentioned",
                },
                {
                  key: "commentAlerts",
                  label: "Comments",
                  desc: "Get notified about new comments",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleToggle(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSubTab === "system" && (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "securityAlerts",
                  label: "Security Alerts",
                  desc: "Get notified about security events",
                },
                {
                  key: "loginAlerts",
                  label: "Login Alerts",
                  desc: "Get notified of new login attempts",
                },
                {
                  key: "productUpdates",
                  label: "Product Updates",
                  desc: "Get notified about new features",
                },
                {
                  key: "weeklyReports",
                  label: "Weekly Reports",
                  desc: "Receive weekly summary reports",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleToggle(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : (
            <>
              <FiSave className="h-4 w-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NotificationsTab;
