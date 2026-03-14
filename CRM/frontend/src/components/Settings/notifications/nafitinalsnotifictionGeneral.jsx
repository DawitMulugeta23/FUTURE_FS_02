// src/components/Settings/notifications/NotificationGeneral.jsx
import ToggleSwitch from "../common/ToggleSwitch";

const NotificationGeneral = ({ notifications, onNotificationChange }) => {
  const notificationItems = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      description: "Receive push notifications in browser",
    },
    {
      key: "desktopNotifications",
      label: "Desktop Notifications",
      description: "Show desktop notifications",
    },
    {
      key: "mobileNotifications",
      label: "Mobile Notifications",
      description: "Send notifications to mobile device",
    },
    {
      key: "taskReminders",
      label: "Task Reminders",
      description: "Get reminded about pending tasks",
    },
    {
      key: "weeklyReports",
      label: "Weekly Reports",
      description: "Receive weekly summary reports",
    },
    {
      key: "monthlyReports",
      label: "Monthly Reports",
      description: "Receive monthly detailed reports",
    },
    {
      key: "marketingEmails",
      label: "Marketing Emails",
      description: "Receive product updates and offers",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        General Notifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notificationItems.map(({ key, label, description }) => (
          <ToggleSwitch
            key={key}
            label={label}
            description={description}
            checked={notifications[key] || false}
            onChange={(value) => onNotificationChange(key)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationGeneral;
