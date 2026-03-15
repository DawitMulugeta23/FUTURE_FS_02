// src/components/Settings/appearance/DensitySelector.jsx
import SettingsSection from "../common/SettingsSection";

const DensitySelector = ({ value, onChange }) => {
  const densities = [
    {
      id: "comfortable",
      label: "Comfortable",
      description: "More spacing between elements",
    },
    { id: "compact", label: "Compact", description: "Tighter layout" },
  ];

  return (
    <SettingsSection title="Layout Density">
      <div className="flex space-x-2">
        {densities.map((density) => (
          <button
            key={density.id}
            onClick={() => onChange(density.id)}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
              value === density.id
                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
            }`}
          >
            <span className="block text-center capitalize">
              {density.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              {density.description}
            </span>
          </button>
        ))}
      </div>
    </SettingsSection>
  );
};

export default DensitySelector;
