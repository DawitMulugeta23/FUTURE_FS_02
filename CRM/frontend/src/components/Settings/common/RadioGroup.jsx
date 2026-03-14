// src/components/Settings/common/RadioGroup.jsx

const RadioGroup = ({ name, options, value, onChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {option.label}
            </p>
            {option.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
