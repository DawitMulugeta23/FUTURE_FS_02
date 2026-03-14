// src/components/Settings/common/SettingsSubTabs.jsx

const SettingsSubTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSubTabs;
