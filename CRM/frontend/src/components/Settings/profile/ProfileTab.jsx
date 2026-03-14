// src/components/Settings/profile/ProfileTab.jsx
import React from 'react';
import { FiUser, FiMail, FiLock, FiSliders } from 'react-icons/fi';
import SettingsSubTabs from '../common/SettingsSubTabs';
import ProfileGeneral from './ProfileGeneral';
import ProfilePassword from './ProfilePassword';

const ProfileTab = ({ 
    user, 
    profileForm, 
    activeSubTab, 
    onSubTabChange,
    onProfileChange,
    onProfileSubmit,
    voiceFeedback,
    speak 
}) => {
    const subTabs = [
        { id: 'general', name: 'General Info', icon: FiUser },
        { id: 'password', name: 'Password', icon: FiLock },
        { id: 'preferences', name: 'Preferences', icon: FiSliders }
    ];

    return (
        <div>
            <SettingsSubTabs 
                tabs={subTabs}
                activeTab={activeSubTab}
                onTabChange={onSubTabChange}
            />

            <form onSubmit={onProfileSubmit}>
                {activeSubTab === 'general' && (
                    <ProfileGeneral 
                        user={user}
                        profileForm={profileForm}
                        onChange={onProfileChange}
                    />
                )}

                {activeSubTab === 'password' && (
                    <ProfilePassword 
                        profileForm={profileForm}
                        onChange={onProfileChange}
                    />
                )}

                {activeSubTab === 'preferences' && (
                    <div className="p-4 text-center text-gray-500">
                        Preferences settings coming soon...
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;