// src/components/Settings/privacy/ProfileVisibility.jsx
import SettingsSection from "../common/SettingsSection";

const ProfileVisibility = ({ value, onChange }) => {
  const options = [
    {
      id: "public",
      label: "Public",
      description: "Anyone can see your profile",
    },
    {
      id: "contacts",
      label: "Contacts",
      description: "Only your contacts can see your profile",
    },
    {
      id: "private",
      label: "Private",
      description: "Only you can see your profile",
    },
  ];

  return (
    <SettingsSection title="Profile Visibility">
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <input
              type="radio"
              name="profileVisibility"
              value={option.id}
              checked={value === option.id}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {option.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </SettingsSection>
  );
};

export default ProfileVisibility;
