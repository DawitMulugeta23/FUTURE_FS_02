// src/components/Layout/Sidebar.jsx
import { FiHome, FiPieChart, FiSettings, FiUsers } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const sidebarOpen = useSelector(state => state.ui?.sidebarOpen ?? true);

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: FiHome },
        { path: '/leads', name: 'Leads', icon: FiUsers },
        { path: '/analytics', name: 'Analytics', icon: FiPieChart },
        { path: '/settings', name: 'Settings', icon: FiSettings },
    ];

    if (!sidebarOpen) return null;

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg h-[calc(100vh-4rem)] transition-colors duration-200">
            <nav className="mt-8 px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;