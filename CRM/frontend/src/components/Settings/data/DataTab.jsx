// src/components/Settings/data/DataTab.jsx
import { useState } from "react";
import DangerZone from "./DangerZone";
import DataRetention from "./DataRetention";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ExportData from "./ExportData";

const DataTab = ({
  dataManagement,
  onDataManagementChange,
  onExportData,
  onDeleteAccount,
  onLogout,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleDeleteConfirm = () => {
    onDeleteAccount();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      <ExportData
        settings={dataManagement}
        onChange={onDataManagementChange}
        onExport={onExportData}
      />

      <DataRetention
        value={dataManagement.dataRetention}
        onChange={(value) => onDataManagementChange("dataRetention", value)}
      />

      <DangerZone onDeleteClick={handleDeleteClick} onLogout={onLogout} />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DataTab;
