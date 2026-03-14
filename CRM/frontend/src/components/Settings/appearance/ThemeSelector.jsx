// src/components/Settings/appearance/ThemeSelector.jsx
import { FiCheck, FiMoon, FiSettings, FiSun } from "react-icons/fi";
import SettingsSection from "../common/SettingsSection";

const ThemeSelector = ({ value, onChange }) => {
  const themes = [
    {
      id: "light",
      name: "Light",
      icon: FiSun,
      description: "Light mode for daytime",
    },
    {
      id: "dark",
      name: "Dark",
      icon: FiMoon,
      description: "Dark mode for nighttime",
    },
    {
      id: "system",
      name: "System",
      icon: FiSettings,
      description: "Follow system preference",
    },
  ];

  return (
    <SettingsSection title="Theme">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = value === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-primary-600" : "text-gray-500"}`}
                />
                {isActive && <FiCheck className="h-4 w-4 text-primary-600" />}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {theme.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
};

export default ThemeSelector;
