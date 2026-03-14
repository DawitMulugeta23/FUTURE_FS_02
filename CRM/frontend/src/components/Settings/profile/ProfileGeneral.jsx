// src/components/Settings/profile/ProfileGeneral.jsx
import ProfileAvatar from "../../../components/Profile/ProfileAvatar";

const ProfileGeneral = ({ user, profileForm, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <ProfileAvatar user={user} size="2xl" />
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Profile Picture
          </h3>
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
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
            placeholder="John Doe"
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
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={profileForm.phone}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
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
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
            placeholder="Acme Inc."
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
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
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
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                 dark:bg-gray-700 dark:text-white"
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
          onChange={onChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary-500
                             dark:bg-gray-700 dark:text-white"
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
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary-500
                             dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );
};

export default ProfileGeneral;
