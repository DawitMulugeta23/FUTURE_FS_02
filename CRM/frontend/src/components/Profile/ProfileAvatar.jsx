// src/components/Profile/ProfileAvatar.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiX } from "react-icons/fi";

const ProfileAvatar = ({ user, size = "md", onUpdate }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Get initials from first and last name
  const getInitials = () => {
    if (!user?.name) return "U";

    const nameParts = user.name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  // Generate a consistent background color based on user name
  const getBackgroundColor = () => {
    if (!user?.name) return "from-primary-500 to-primary-600";

    const colors = [
      "from-red-500 to-red-600",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-orange-500 to-orange-600",
      "from-cyan-500 to-cyan-600",
    ];

    // Use the sum of character codes to determine color index
    const sum = user.name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = sum % colors.length;

    return colors[colorIndex];
  };

  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
    xl: "h-24 w-24 text-2xl",
    "2xl": "h-32 w-32 text-4xl",
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
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
        toast.success("Profile picture updated!");
        if (onUpdate) onUpdate(reader.result);
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  const resetToInitials = () => {
    setAvatarUrl("");
    toast.success("Reset to initials avatar");
    if (onUpdate) onUpdate(null);
  };

  const initials = getInitials();
  const bgGradient = getBackgroundColor();

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative ${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br ${bgGradient} cursor-pointer group shadow-md`}
        onClick={() => setShowUploader(!showUploader)}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold">
            {initials}
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
            <h4 className="font-medium text-gray-900 dark:text-white">
              Update Photo
            </h4>
            <button
              onClick={() => setShowUploader(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>

          {/* Current Avatar Preview */}
          <div className="flex justify-center mb-4">
            <div
              className={`${sizes.lg} rounded-full overflow-hidden border-2 border-primary-500 bg-gradient-to-br ${bgGradient}`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Preview Info */}
          <div className="text-center mb-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
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
                {uploading ? "Uploading..." : "Upload Photo"}
              </div>
            </label>

            <button
              onClick={resetToInitials}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Use Initials Avatar
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Your initials are generated from your name
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileAvatar;
