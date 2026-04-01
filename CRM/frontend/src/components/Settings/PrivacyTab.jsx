// src/components/Settings/PrivacyTab.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiGlobe, FiLock, FiSave, FiShield } from "react-icons/fi";

const PrivacyTab = () => {
  const [isSaving, setIsSaving] = useState(false);
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

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
    toast.success("Privacy settings updated");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Privacy settings saved");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiGlobe className="mr-2 h-5 w-5 text-primary-500" />
          Profile Visibility
        </h3>
        <div className="space-y-3">
          {[
            {
              value: "public",
              label: "Public",
              desc: "Anyone can see your profile",
            },
            {
              value: "contacts",
              label: "Contacts Only",
              desc: "Only your contacts can see your profile",
            },
            {
              value: "private",
              label: "Private",
              desc: "Only you can see your profile",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={privacy.profileVisibility === option.value}
                onChange={(e) =>
                  handlePrivacyChange("profileVisibility", e.target.value)
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiShield className="mr-2 h-5 w-5 text-primary-500" />
          Information Visibility
        </h3>
        <div className="space-y-4">
          {[
            {
              key: "showEmail",
              label: "Email Address",
              desc: "Show your email on your profile",
            },
            {
              key: "showPhone",
              label: "Phone Number",
              desc: "Show your phone number on your profile",
            },
            {
              key: "showCompany",
              label: "Company",
              desc: "Show your company on your profile",
            },
            {
              key: "showPosition",
              label: "Position",
              desc: "Show your job position on your profile",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiLock className="mr-2 h-5 w-5 text-primary-500" />
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
              type="button"
              onClick={() =>
                handlePrivacyChange("twoFactorAuth", !privacy.twoFactorAuth)
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                privacy.twoFactorAuth
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
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
                onChange={() => handlePrivacyChange("loginNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t dark:border-gray-700">
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
              <span>Save Privacy Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PrivacyTab;
