// src/App.jsx
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import { setTheme } from './store/slices/uiSlice';
import { store } from './store/store';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    return !user ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.ui?.theme || 'light');

    useEffect(() => {
        // Apply theme on mount
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme = 'light';
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            initialTheme = savedTheme;
        } else if (systemPrefersDark) {
            initialTheme = 'dark';
        }
        
        dispatch(setTheme(initialTheme));
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!localStorage.getItem('theme')) {
                dispatch(setTheme(e.matches ? 'dark' : 'light'));
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [dispatch]);

    // Apply theme whenever it changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
    }, [theme]);

    return (
        <>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: theme === 'dark' ? '#1f2937' : '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    );
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
        </Provider>
    );
}

export default App;