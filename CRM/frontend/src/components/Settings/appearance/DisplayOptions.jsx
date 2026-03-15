// src/components/Settings/appearance/DisplayOptions.jsx
import React from 'react';
import SettingsSection from '../common/SettingsSection';
import ToggleSwitch from '../common/ToggleSwitch';

const DisplayOptions = ({ settings, onChange }) => {
    return (
        <SettingsSection title="Display Options">
            <div className="space-y-4">
                <ToggleSwitch
                    label="Animations"
                    description="Enable smooth animations throughout the app"
                    checked={settings.animations}
                    onChange={(value) => onChange('animations', value)}
                />
                
                <ToggleSwitch
                    label="Reduce Motion"
                    description="Minimize animations for accessibility"
                    checked={settings.reduceMotion}
                    onChange={(value) => onChange('reduceMotion', value)}
                />
                
                <ToggleSwitch
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                    checked={settings.highContrast}
                    onChange={(value) => onChange('highContrast', value)}
                />
                
                <ToggleSwitch
                    label="Show Avatars"
                    description="Display profile pictures throughout the app"
                    checked={settings.showAvatars}
                    onChange={(value) => onChange('showAvatars', value)}
                />
            </div>
        </SettingsSection>
    );
};

export default DisplayOptions;