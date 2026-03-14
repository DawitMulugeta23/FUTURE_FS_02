// src/components/Settings/privacy/PrivacyTab.jsx
import React from 'react';
import ProfileVisibility from './ProfileVisibility';
import InformationVisibility from './InformationVisibility';
import DataCollection from './DataCollection';
import SecuritySettings from './SecuritySettings';
import ActiveSessions from './ActiveSessions';

const PrivacyTab = ({ privacy, onPrivacyChange }) => {
    return (
        <div className="space-y-6">
            <ProfileVisibility 
                value={privacy.profileVisibility}
                onChange={(value) => onPrivacyChange('profileVisibility', value)}
            />
            
            <InformationVisibility 
                settings={privacy}
                onChange={onPrivacyChange}
            />
            
            <DataCollection 
                settings={privacy}
                onChange={onPrivacyChange}
            />
            
            <SecuritySettings 
                settings={privacy}
                onChange={onPrivacyChange}
            />
            
            <ActiveSessions />
        </div>
    );
};

export default PrivacyTab;