// src/components/Layout/Navbar.jsx
import { FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProfileDropdown from "../Profile/ProfileDropdown";
import VoiceSearch from "../Search/VoiceSearch";
import ThemeToggle from "../UI/ThemeToggle";

const Navbar = () => {
  const handleVoiceSearch = (query, results) => {
    console.log("Search results:", results);
    // Navigate to leads page with search query
    window.location.href = `/leads?search=${encodeURIComponent(query)}`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FiBarChart2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                CRM System
              </span>
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-2">
            {/* Voice Search */}
            <VoiceSearch onSearch={handleVoiceSearch} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown with all user info and voice controls */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
