// src/context/AuthContext.js - Updated to use Redux
import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as reduxLogin, logout as reduxLogout, register as reduxRegister } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);

    const register = async (userData) => {
        try {
            const result = await dispatch(reduxRegister(userData)).unwrap();
            return !!result;
        } catch (error) {
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const result = await dispatch(reduxLogin({ email, password })).unwrap();
            return !!result;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        dispatch(reduxLogout());
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};