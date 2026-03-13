// frontend/src/components/UI/ThemeToggle.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.ui.theme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
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