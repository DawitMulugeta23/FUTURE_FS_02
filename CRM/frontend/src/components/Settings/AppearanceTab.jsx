// src/components/Settings/AppearanceTab.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiMoon, FiSave, FiSettings, FiSun } from "react-icons/fi";

const AppearanceTab = ({ theme, setTheme }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [appearance, setAppearance] = useState({
    fontSize: "medium",
    density: "comfortable",
    animations: true,
    reduceMotion: false,
    highContrast: false,
    showAvatars: true,
  });

  const handleAppearanceChange = (key, value) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    if (key === "reduceMotion" || key === "highContrast") {
      toast.success(
        `${key.replace(/([A-Z])/g, " $1").trim()} ${value ? "enabled" : "disabled"}`,
      );
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Appearance settings saved");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["light", "dark", "system"].map((themeOption) => (
            <button
              key={themeOption}
              type="button"
              onClick={() => handleThemeChange(themeOption)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === themeOption
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
                  <FiSettings className="h-5 w-5 text-gray-500" />
                )}
                {theme === themeOption && (
                  <FiCheck className="h-4 w-4 text-primary-600" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {themeOption}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {themeOption === "light" && "Light mode for daytime"}
                {themeOption === "dark" && "Dark mode for nighttime"}
                {themeOption === "system" && "Follow system preference"}
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
              type="button"
              onClick={() => handleAppearanceChange("fontSize", size)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                appearance.fontSize === size
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
              }`}
            >
              <span
                className={`block text-center capitalize ${size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg"}`}
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
              type="button"
              onClick={() => handleAppearanceChange("density", density)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                appearance.density === density
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
              }`}
            >
              <span className="block text-center capitalize">{density}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                {density === "comfortable" ? "More spacing" : "Tighter layout"}
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
              desc: "Enable smooth animations throughout the app",
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
              desc: "Display profile pictures throughout the app",
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
                  checked={appearance[item.key]}
                  onChange={(e) =>
                    handleAppearanceChange(item.key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
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
              <span>Save Appearance</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AppearanceTab;
