// src/App.js
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
    const theme = useSelector(state => state.ui.theme);

    useEffect(() => {
        // Apply theme on initial load
        dispatch(setTheme(theme));
    }, [dispatch, theme]);

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
                        background: '#363636',
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