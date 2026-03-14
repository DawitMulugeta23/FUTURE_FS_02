// src/components/Settings/common/RangeSlider.jsx

const RangeSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  minLabel,
  maxLabel,
  showValue = true,
  unit = "",
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span>{minLabel || min}</span>
        {showValue && (
          <span className="text-primary-600 font-medium">
            Current: {value}
            {unit}
          </span>
        )}
        <span>{maxLabel || max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
