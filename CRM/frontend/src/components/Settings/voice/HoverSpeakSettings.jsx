// src/components/Settings/voice/HoverSpeakSettings.jsx
import { FiInfo } from "react-icons/fi";
import RangeSlider from "../common/RangeSlider";
import SettingsSection from "../common/SettingsSection";
import ToggleSwitch from "../common/ToggleSwitch";

const HoverSpeakSettings = ({ settings, onChange }) => {
  return (
    <SettingsSection title="Hover-to-Speak Settings" icon={FiInfo}>
      <div className="space-y-4">
        <ToggleSwitch
          label="Enable Hover Descriptions"
          description="Speak descriptions when hovering over elements"
          checked={settings.hoverSpeak || false}
          onChange={(value) => onChange("hoverSpeak", value)}
        />

        <RangeSlider
          label="Hover Delay (ms)"
          value={settings.hoverDelay || 500}
          onChange={(value) => onChange("hoverDelay", value)}
          min={0}
          max={1000}
          step={50}
          minLabel="Instant"
          maxLabel="Slow"
          unit="ms"
        />

        <div className="space-y-2">
          <ToggleSwitch
            label="Speak Labels"
            description="Read button and input labels"
            checked={settings.speakLabels || true}
            onChange={(value) => onChange("speakLabels", value)}
          />

          <ToggleSwitch
            label="Speak Placeholders"
            description="Read placeholder text in inputs"
            checked={settings.speakPlaceholders || true}
            onChange={(value) => onChange("speakPlaceholders", value)}
          />

          <ToggleSwitch
            label="Speak Errors"
            description="Verbally announce error messages"
            checked={settings.speakErrors || true}
            onChange={(value) => onChange("speakErrors", value)}
          />

          <ToggleSwitch
            label="Speak Success"
            description="Verbally announce success messages"
            checked={settings.speakSuccess || true}
            onChange={(value) => onChange("speakSuccess", value)}
          />

          <ToggleSwitch
            label="Speak Navigation"
            description="Describe navigation changes"
            checked={settings.speakNavigation || true}
            onChange={(value) => onChange("speakNavigation", value)}
          />
        </div>
      </div>
    </SettingsSection>
  );
};

export default HoverSpeakSettings;
