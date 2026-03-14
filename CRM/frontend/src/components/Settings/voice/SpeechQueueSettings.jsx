// src/components/Settings/voice/SpeechQueueSettings.jsx
import { FiList } from "react-icons/fi";
import SettingsSection from "../common/SettingsSection";
import ToggleSwitch from "../common/ToggleSwitch";

const SpeechQueueSettings = ({ settings, onChange }) => {
  return (
    <SettingsSection title="Speech Queue Settings" icon={FiList}>
      <div className="space-y-4">
        <ToggleSwitch
          label="Show Queue Indicator"
          description="Display floating queue status indicator"
          checked={settings.showQueueIndicator || true}
          onChange={(value) => onChange("showQueueIndicator", value)}
        />

        {settings.showQueueIndicator && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              The queue indicator will appear in the bottom-right corner when
              items are waiting to be spoken.
            </p>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default SpeechQueueSettings;
