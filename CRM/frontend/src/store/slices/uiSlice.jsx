// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    } catch (error) {
        console.error('Error getting initial theme:', error);
        return 'light';
    }
};

const applyTheme = (theme) => {
    try {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.removeAttribute('data-theme');
            document.body.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        console.log('Theme applied:', theme, 'Root classes:', root.classList.toString());
    } catch (error) {
        console.error('Error applying theme:', error);
    }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: getInitialTheme(),
        sidebarOpen: true,
        modalOpen: false
    },
    reducers: {
        toggleTheme: (state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            state.theme = newTheme;
            applyTheme(newTheme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            applyTheme(action.payload);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setModalOpen: (state, action) => {
            state.modalOpen = action.payload;
        }
    }
});

export const { toggleTheme, setTheme, toggleSidebar, setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;