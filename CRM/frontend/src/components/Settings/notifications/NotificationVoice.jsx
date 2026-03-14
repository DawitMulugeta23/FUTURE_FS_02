// src/components/Settings/notifications/NotificationVoice.jsx
import React from 'react';
import ToggleSwitch from '../common/ToggleSwitch';

const NotificationVoice = ({ voiceSettings, onVoiceSettingChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Voice Notifications
            </h3>
            <div className="space-y-4">
                <ToggleSwitch
                    label="Voice Feedback"
                    description="Hear spoken feedback for actions"
                    checked={voiceSettings.voiceFeedback || false}
                    onChange={(value) => onVoiceSettingChange('voiceFeedback', value)}
                />
                
                <ToggleSwitch
                    label="Wake Word Detection"
                    description="Listen for wake word to activate voice mode"
                    checked={voiceSettings.autoListen || false}
                    onChange={(value) => onVoiceSettingChange('autoListen', value)}
                />
            </div>
        </div>
    );
};

export default NotificationVoice;