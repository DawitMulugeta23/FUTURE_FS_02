// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiPieChart, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: FiHome },
        { path: '/leads', name: 'Leads', icon: FiUsers },
        { path: '/analytics', name: 'Analytics', icon: FiPieChart },
        { path: '/settings', name: 'Settings', icon: FiSettings },
    ];

    return (
        <aside className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)]">
            <nav className="mt-8 px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50'
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