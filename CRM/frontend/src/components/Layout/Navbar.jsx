// src/components/Layout/Navbar.jsx (updated with hover descriptions)
import { FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProfileDropdown from "../Profile/ProfileDropdown";
import VoiceSearch from "../Search/VoiceSearch";
import ThemeToggle from "../UI/ThemeToggle";
import HoverSpeak from "../Voice/HoverSpeak";

const Navbar = () => {
  const handleVoiceSearch = (query, results) => {
    console.log("Search results:", results);
    window.location.href = `/leads?search=${encodeURIComponent(query)}`;
  };

  return (
    <HoverSpeak description="Main navigation bar. Contains logo, search, theme toggle, and profile menu.">
      <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <HoverSpeak
              description="CRM System logo. Click to go to dashboard."
              delay={200}
            >
              <div className="flex items-center">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <FiBarChart2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    CRM System
                  </span>
                </Link>
              </div>
            </HoverSpeak>

            {/* Right Side Items */}
            <div className="flex items-center space-x-2">
              {/* Voice Search */}
              <HoverSpeak
                description="Voice search. Click and speak to search for leads."
                delay={200}
              >
                <VoiceSearch onSearch={handleVoiceSearch} />
              </HoverSpeak>

              {/* Theme Toggle */}
              <HoverSpeak
                description="Theme toggle. Switch between light and dark mode."
                delay={200}
              >
                <ThemeToggle />
              </HoverSpeak>

              {/* Profile Dropdown */}
              <HoverSpeak
                description="Profile menu. View your profile, settings, and logout."
                delay={200}
              >
                <ProfileDropdown />
              </HoverSpeak>
            </div>
          </div>
        </div>
      </nav>
    </HoverSpeak>
  );
};

export default Navbar;
