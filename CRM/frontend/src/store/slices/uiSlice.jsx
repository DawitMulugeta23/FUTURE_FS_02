// frontend/src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
            state.theme = state.theme === 'light' ? 'dark' : 'dark';
            localStorage.setItem('theme', state.theme);
            
            // Apply theme to document
            if (state.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
            
            if (action.payload === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
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