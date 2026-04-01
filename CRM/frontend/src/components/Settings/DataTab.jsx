// src/components/Settings/DataTab.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiAlertCircle, FiDownload, FiSave, FiTrash2, FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const DataTab = ({ navigate }) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dataManagement, setDataManagement] = useState({
    autoBackup: true,
    backupFrequency: "weekly",
    dataRetention: "1year",
    exportFormat: "csv",
    includeNotes: true,
    includeActivities: true,
    includeAttachments: false,
    anonymizeData: false,
  });

  const handleExportData = () => {
    toast.loading("Preparing your data export...", { id: "export" });
    setTimeout(() => {
      const data = { ...dataManagement, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `crm-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      toast.success("Data exported successfully!", { id: "export" });
    }, 2000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    toast.loading("Deleting account...", { id: "delete" });
    setTimeout(() => {
      localStorage.clear();
      dispatch(logout());
      if (navigate) navigate("/login");
      toast.success("Account deleted successfully", { id: "delete" });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Data settings saved");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Export Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Your Data</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Download a copy of all your leads, notes, activities, and account information
        </p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
              <select
                value={dataManagement.exportFormat}
                onChange={(e) => setDataManagement({ ...dataManagement, exportFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="json">JSON (Raw Data)</option>
                <option value="pdf">PDF (Report)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Frequency</label>
              <select
                value={dataManagement.backupFrequency}
                onChange={(e) => setDataManagement({ ...dataManagement, backupFrequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { key: "includeNotes", label: "Include Notes" },
              { key: "includeActivities", label: "Include Activities" },
              { key: "includeAttachments", label: "Include Attachments" },
              { key: "anonymizeData", label: "Anonymize Data" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataManagement[item.key]}
                    onChange={(e) => setDataManagement({ ...dataManagement, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button type="button" onClick={handleExportData} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <FiDownload className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2">
            <FiUpload className="h-4 w-4" />
            <span>Schedule Backup</span>
          </button>
        </div>
      </div>

      {/* Data Retention Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Retention</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keep data for</label>
            <select
              value={dataManagement.dataRetention}
              onChange={(e) => setDataManagement({ ...dataManagement, dataRetention: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="1month">1 month</option>
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="2years">2 years</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Data older than this will be automatically archived or deleted based on your settings</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center">
          <FiAlertCircle className="mr-2 h-5 w-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <FiTrash2 className="h-5 w-5" />
          <span>Delete Account</span>
        </button>
      </div>

      <div className="flex justify-end pt-6 border-t dark:border-gray-700">
        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50">
          {isSaving ? <span>Saving...</span> : <><FiSave className="h-4 w-4" /><span>Save Data Settings</span></>}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDeleteAccount} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DataTab;