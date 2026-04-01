// src/components/Settings/ProfileTab.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiMail, FiRefreshCw, FiSave, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import ProfileAvatar from "../Profile/ProfileAvatar";

const ProfileTab = ({ user }) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("general");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    position: user?.position || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const profileSubTabs = [
    { id: "general", name: "General Info", icon: FiUser },
    { id: "contact", name: "Contact", icon: FiMail },
    { id: "password", name: "Password", icon: FiLock },
  ];

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error("New passwords do not match");
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsSaving(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleProfileSubmit}>
      <div className="flex space-x-2 mb-6 border-b dark:border-gray-700 pb-2">
        {profileSubTabs.map((subTab) => (
          <button
            key={subTab.id}
            type="button"
            onClick={() => setActiveSubTab(subTab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSubTab === subTab.id
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <subTab.icon className="h-4 w-4" />
            <span>{subTab.name}</span>
          </button>
        ))}
      </div>

      {activeSubTab === "general" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <ProfileAvatar user={user} size="2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click on the avatar to upload a new photo or use Gravatar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Position
              </label>
              <input
                type="text"
                name="position"
                value={profileForm.position}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Product Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileForm.location}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={profileForm.website}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com"
            />
          </div>
        </div>
      )}

      {activeSubTab === "contact" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={profileForm.company}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Acme Inc."
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "password" && (
        <div className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center">
              <span className="mr-2">⚠️</span>
              Change your password regularly to keep your account secure
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={profileForm.currentPassword}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={profileForm.newPassword}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new password"
              minLength="6"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={profileForm.confirmPassword}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm new password"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
              Password Requirements
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li className="flex items-center">✓ At least 6 characters</li>
              <li className="flex items-center">✓ Include uppercase and lowercase letters</li>
              <li className="flex items-center">✓ Include at least one number</li>
              <li className="flex items-center">✓ Include at least one special character</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <FiRefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiSave className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileTab;