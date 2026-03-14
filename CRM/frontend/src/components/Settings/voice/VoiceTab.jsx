// src/components/Settings/voice/VoiceTab.jsx
import AdvancedAudioSettings from "./AdvancedAudioSettings";
import HoverSpeakSettings from "./HoverSpeakSettings";
import SpeechQueueSettings from "./SpeechQueueSettings";
import VoiceCommandsList from "./VoiceCommandsList";
import VoiceModeToggle from "./VoiceModeToggle";
import VoiceSettingsGrid from "./VoiceSettingsGrid";
import VoiceStatusIndicator from "./VoiceStatusIndicator";
import VoiceTest from "./VoiceTest";
import WakeWordSettings from "./WakeWordSettings";

const VoiceTab = ({
  voiceContext,
  voiceSettingsLocal,
  onVoiceSettingChange,
  onTestVoice,
}) => {
  const { voiceSupported } = voiceContext;

  return (
    <div className="space-y-6">
      <VoiceStatusIndicator
        voiceSupported={voiceSupported}
        voiceContext={voiceContext}
      />

      <VoiceModeToggle
        voiceContext={voiceContext}
        onVoiceSettingChange={onVoiceSettingChange}
      />

      <VoiceTest onTestVoice={onTestVoice} />

      <WakeWordSettings
        value={voiceSettingsLocal.wakeWord}
        onChange={(value) => onVoiceSettingChange("wakeWord", value)}
      />

      <VoiceSettingsGrid
        settings={voiceSettingsLocal}
        onChange={onVoiceSettingChange}
      />

      <AdvancedAudioSettings
        settings={voiceSettingsLocal}
        onChange={onVoiceSettingChange}
      />

      {/* Hover-to-Speak Settings */}
      <HoverSpeakSettings
        settings={voiceSettingsLocal}
        onChange={onVoiceSettingChange}
      />

      {/* Speech Queue Settings */}
      <SpeechQueueSettings
        settings={voiceSettingsLocal}
        onChange={onVoiceSettingChange}
      />

      <VoiceCommandsList />
    </div>
  );
};

export default VoiceTab;
