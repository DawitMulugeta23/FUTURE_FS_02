// src/components/Profile/ProfileAvatar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUser, FiMail, FiCheck, FiX } from 'react-icons/fi';
import md5 from 'md5';
import toast from 'react-hot-toast';

const ProfileAvatar = ({ user, size = 'md', onUpdate }) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [showUploader, setShowUploader] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [gravatarUrl, setGravatarUrl] = useState('');

    const sizes = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
        xl: 'h-24 w-24',
        '2xl': 'h-32 w-32'
    };

    // Generate Gravatar URL from email
    useEffect(() => {
        if (user?.email) {
            const emailHash = md5(user.email.toLowerCase().trim());
            const gravatar = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=256`;
            setGravatarUrl(gravatar);
            
            // Try to load Gravatar first
            const img = new Image();
            img.onload = () => {
                setAvatarUrl(gravatar);
            };
            img.onerror = () => {
                // If Gravatar fails, use default avatar
                setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=256`);
            };
            img.src = gravatar;
        }
    }, [user]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setUploading(true);

        // Simulate upload - replace with actual API call
        setTimeout(() => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
                setUploading(false);
                setShowUploader(false);
                toast.success('Profile picture updated!');
                if (onUpdate) onUpdate(reader.result);
            };
            reader.readAsDataURL(file);
        }, 1500);
    };

    const resetToGravatar = () => {
        setAvatarUrl(gravatarUrl);
        toast.success('Reset to Gravatar');
    };

    return (
        <div className="relative inline-block">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative ${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 cursor-pointer group`}
                onClick={() => setShowUploader(!showUploader)}
            >
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt={user?.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiCamera className="text-white h-5 w-5" />
                </div>
            </motion.div>

            {/* Upload Modal */}
            {showUploader && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 right-0 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Update Photo</h4>
                        <button
                            onClick={() => setShowUploader(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX />
                        </button>
                    </div>

                    {/* Current Avatar Preview */}
                    <div className="flex justify-center mb-4">
                        <div className={`${sizes.lg} rounded-full overflow-hidden border-2 border-primary-500`}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white text-xl">
                                    {user?.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Options */}
                    <div className="space-y-2">
                        <label className="block">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                            <div className="w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                                {uploading ? 'Uploading...' : 'Upload New Photo'}
                            </div>
                        </label>

                        <button
                            onClick={resetToGravatar}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Use Gravatar
                        </button>

                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                            Photo will be synced with your Gravatar account
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfileAvatar;