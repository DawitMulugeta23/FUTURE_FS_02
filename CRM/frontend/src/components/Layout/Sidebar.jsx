// src/components/Layout/Sidebar.jsx
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiPieChart,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleSidebar } from "../../store/slices/uiSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { theme } = useSelector((state) => state.ui);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: FiHome,
    },
    {
      path: "/leads",
      name: "Leads",
      icon: FiUsers,
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon: FiPieChart,
    },
    {
      path: "/settings",
      name: "Settings",
      icon: FiSettings,
    },
  ];

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Determine toggle button color based on theme
  const getToggleButtonColor = () => {
    if (theme === "dark") {
      return "bg-gray-800 border-gray-600 text-green-500 hover:text-green-400";
    }
    return "bg-white border-gray-200 text-gray-600 hover:text-gray-800";
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      <aside
        className={`
                    fixed lg:sticky top-16 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-40
                    ${sidebarOpen ? "left-0" : "-left-64 lg:left-0"}
                    lg:top-16 h-[calc(100vh-4rem)] overflow-y-auto
                    ${sidebarOpen ? "w-64" : "lg:w-20"}
                `}
      >
        {/* Toggle Button - At the top of sidebar */}
        <div className="relative w-full h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleToggleSidebar}
            className={`hidden lg:flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition-all ${getToggleButtonColor()}`}
            style={{ width: "80px", height: "56px" }}
          >
            {sidebarOpen ? (
              <FiArrowLeft
                className="h-8 w-8 stroke-[2.5]"
                style={{ strokeWidth: "2.5" }}
              />
            ) : (
              <FiArrowRight
                className="h-8 w-8 stroke-[2.5]"
                style={{ strokeWidth: "2.5" }}
              />
            )}
          </button>
        </div>

        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      handleToggleSidebar();
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) => `
                                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                                        relative group
                                        ${
                                          isActive
                                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }
                                        ${!sidebarOpen && "lg:justify-center lg:px-2"}
                                    `}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${!sidebarOpen && "lg:h-6 lg:w-6"}`}
                  />

                  {/* Text - Hidden when sidebar is collapsed on desktop */}
                  <span
                    className={`
                                        ${!sidebarOpen ? "lg:hidden" : ""}
                                        font-medium
                                    `}
                  >
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed mode on desktop */}
                  {!sidebarOpen && hoveredItem === item.path && (
                    <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
