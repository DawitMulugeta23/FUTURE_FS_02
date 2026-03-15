// src/components/Settings/appearance/DateTimeFormat.jsx
import SelectInput from "../common/SelectInput";
import SettingsSection from "../common/SettingsSection";

const DateTimeFormat = ({ settings, onChange }) => {
  const dateOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "MMMM DD, YYYY", label: "Month DD, YYYY" },
    { value: "DD MMMM YYYY", label: "DD Month YYYY" },
  ];

  const timeOptions = [
    { value: "12h", label: "12-hour (12:00 PM)" },
    { value: "24h", label: "24-hour (13:00)" },
  ];

  const weekOptions = [
    { value: "monday", label: "Monday" },
    { value: "sunday", label: "Sunday" },
    { value: "saturday", label: "Saturday" },
  ];

  const viewOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "leads", label: "Leads" },
    { value: "analytics", label: "Analytics" },
  ];

  return (
    <SettingsSection title="Date & Time Format">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Date Format"
          value={settings.dateFormat}
          onChange={(value) => onChange("dateFormat", value)}
          options={dateOptions}
        />

        <SelectInput
          label="Time Format"
          value={settings.timeFormat}
          onChange={(value) => onChange("timeFormat", value)}
          options={timeOptions}
        />

        <SelectInput
          label="First Day of Week"
          value={settings.firstDayOfWeek}
          onChange={(value) => onChange("firstDayOfWeek", value)}
          options={weekOptions}
        />

        <SelectInput
          label="Default View"
          value={settings.defaultView}
          onChange={(value) => onChange("defaultView", value)}
          options={viewOptions}
        />
      </div>
    </SettingsSection>
  );
};

export default DateTimeFormat;
