// src/components/Settings/common/ToggleSwitch.jsx

const ToggleSwitch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex-1">
        {label && (
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                              peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 
                              rounded-full peer dark:bg-gray-600 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all dark:border-gray-500 
                              peer-checked:bg-primary-600 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        ></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
