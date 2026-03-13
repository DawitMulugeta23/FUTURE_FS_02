// src/App.jsx
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
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
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                dispatch(setTheme(e.matches ? 'dark' : 'light'));
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [dispatch]);

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
                <Route path="/leads" element={
                    <PrivateRoute>
                        <Leads />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path='/analytics' element={<PrivateRoute><Analytics/></PrivateRoute>}/>
                <Route path='/settings' element={<PrivateRoute><Settings/></PrivateRoute>}/>
            </Routes>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: theme === 'dark' ? '#1f2937' : '#363636',
                        color: '#fff',
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