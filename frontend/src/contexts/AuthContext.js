import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get CSRF token
                await authService.getCsrfToken();
                
                // Check auth status
                const authStatus = await authService.checkAuthStatus();
                setIsAuthenticated(authStatus.isAuthenticated);
                if (authStatus.isAuthenticated && authStatus.user) {
                    setUser(authStatus.user);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async () => {
        authService.initializeGoogleLogin();
    };

    const logout = async () => {
        const success = await authService.logout();
        if (success) {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 