// src/components/Settings/common/SettingsSection.jsx
import { motion } from "framer-motion";

const SettingsSection = ({
  title,
  icon: Icon,
  iconColor = "text-primary-500",
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          {Icon && <Icon className={`mr-2 h-5 w-5 ${iconColor}`} />}
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
};

export default SettingsSection;
