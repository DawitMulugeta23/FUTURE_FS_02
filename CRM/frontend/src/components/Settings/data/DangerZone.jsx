// src/components/Settings/data/DangerZone.jsx
import { FiAlertCircle, FiLogOut, FiTrash2 } from "react-icons/fi";
import SettingsSection from "../common/SettingsSection";

const DangerZone = ({ onDeleteClick, onLogout }) => {
  return (
    <SettingsSection
      title="Danger Zone"
      icon={FiAlertCircle}
      iconColor="text-red-500"
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
    >
      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      <div className="space-y-3">
        <button
          onClick={onDeleteClick}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <FiTrash2 className="h-5 w-5" />
          <span>Delete Account</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <FiLogOut className="h-5 w-5" />
          <span>Sign Out from All Devices</span>
        </button>
      </div>
    </SettingsSection>
  );
};

export default DangerZone;
