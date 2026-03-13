// src/components/UI/ThemeToggle.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.ui?.theme || 'light');

    const handleToggle = () => {
        console.log('Toggling theme from:', theme, 'to:', theme === 'light' ? 'dark' : 'light');
        dispatch(toggleTheme());
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
            type="button"
        >
            {theme === 'light' ? (
                <FiMoon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
                <FiSun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
        </button>
    );
};

export default ThemeToggle;