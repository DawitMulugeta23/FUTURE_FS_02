// src/components/Settings/common/ActionButton.jsx

const ActionButton = ({
  onClick,
  children,
  variant = "primary",
  icon: Icon,
  className = "",
}) => {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary:
      "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;
