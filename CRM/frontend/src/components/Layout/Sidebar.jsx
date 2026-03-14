// src/components/Layout/Sidebar.jsx (updated with hover descriptions)
import { FiHome, FiPieChart, FiSettings, FiUsers } from "react-icons/fi";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import HoverSpeak from "../Voice/HoverSpeak";

const Sidebar = () => {
  const sidebarOpen = useSelector((state) => state.ui?.sidebarOpen ?? true);

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: FiHome,
      description: "Dashboard. View your lead overview and key metrics.",
    },
    {
      path: "/leads",
      name: "Leads",
      icon: FiUsers,
      description: "Leads management. View and manage all your leads.",
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon: FiPieChart,
      description: "Analytics. View detailed reports and statistics.",
    },
    {
      path: "/settings",
      name: "Settings",
      icon: FiSettings,
      description: "Settings. Configure your account and preferences.",
    },
  ];

  if (!sidebarOpen) return null;

  return (
    <HoverSpeak description="Sidebar navigation. Contains links to main sections of the application.">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg h-[calc(100vh-4rem)] transition-colors duration-200">
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <HoverSpeak description={item.description} delay={200}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </HoverSpeak>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </HoverSpeak>
  );
};

export default Sidebar;
