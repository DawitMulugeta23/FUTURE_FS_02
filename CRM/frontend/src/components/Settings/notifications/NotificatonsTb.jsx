// src/components/Settings/notifications/NotificationsTab.jsx
import { FiBell, FiMic, FiUsers } from "react-icons/fi";
import SettingsSubTabs from "../common/SettingsSubTabs";
import NotificationGeneral from "./NotificationGeneral";
import NotificationLeads from "./NotificationLeads";
import NotificationVoice from "./NotificationVoice";

const NotificationsTab = ({
  notifications,
  voiceSettingsLocal,
  activeSubTab,
  onSubTabChange,
  onNotificationChange,
  onVoiceSettingChange,
}) => {
  const subTabs = [
    { id: "general", name: "General", icon: FiBell },
    { id: "leads", name: "Leads", icon: FiUsers },
    { id: "voice", name: "Voice", icon: FiMic },
  ];

  return (
    <div>
      <SettingsSubTabs
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={onSubTabChange}
      />

      <div className="space-y-6">
        {activeSubTab === "general" && (
          <NotificationGeneral
            notifications={notifications}
            onNotificationChange={onNotificationChange}
          />
        )}

        {activeSubTab === "leads" && <NotificationLeads />}

        {activeSubTab === "voice" && (
          <NotificationVoice
            voiceSettings={voiceSettingsLocal}
            onVoiceSettingChange={onVoiceSettingChange}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
