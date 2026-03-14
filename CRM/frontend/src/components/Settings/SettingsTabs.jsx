// src/components/Settings/SettingsTabs.jsx
import { motion } from "framer-motion";
import * as Icons from "react-icons/fi";

const SettingsTabs = ({ tabs, activeTab, onTabChange }) => {
  const colorClasses = {
    blue: "text-blue-600 border-blue-600",
    yellow: "text-yellow-600 border-yellow-600",
    purple: "text-purple-600 border-purple-600",
    indigo: "text-indigo-600 border-indigo-600",
    green: "text-green-600 border-green-600",
    orange: "text-orange-600 border-orange-600",
  };

  const bgColorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/10",
    yellow: "bg-yellow-50 dark:bg-yellow-900/10",
    purple: "bg-purple-50 dark:bg-purple-900/10",
    indigo: "bg-indigo-50 dark:bg-indigo-900/10",
    green: "bg-green-50 dark:bg-green-900/10",
    orange: "bg-orange-50 dark:bg-orange-900/10",
  };

  return (
    <div className="flex border-b dark:border-gray-700 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = Icons[tab.icon];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
              isActive
                ? `${colorClasses[tab.color]} ${bgColorClasses[tab.color]}`
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? colorClasses[tab.color].split(" ")[0] : ""}`}
            />
            <span>{tab.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorClasses[tab.color].split(" ")[1]}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;
