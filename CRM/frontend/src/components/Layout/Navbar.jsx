// src/components/Layout/Navbar.jsx
import { FiBarChart2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSidebar } from "../../store/slices/uiSlice";
import ProfileDropdown from "../Profile/ProfileDropdown";
import MenuButton from "../UI/MenuButton";
import ThemeToggle from "../UI/ThemeToggle";

const Navbar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleMenuClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center space-x-3">
            <MenuButton onClick={handleMenuClick} isOpen={sidebarOpen} />
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FiBarChart2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline-block">
                CRM System
              </span>
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
