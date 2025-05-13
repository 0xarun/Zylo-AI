import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const authService = {
    // Get CSRF token
    getCsrfToken: async () => {
        const response = await axios.get(`${API_URL}/api/csrf-token/`);
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
        return response.data.csrfToken;
    },

    // Check authentication status
    checkAuthStatus: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/status/`);
            return response.data;
        } catch (error) {
            console.error('Auth status check failed:', error);
            return { isAuthenticated: false };
        }
    },

    // Initialize Google OAuth
    initializeGoogleLogin: () => {
        window.location.href = `${API_URL}/accounts/google/login/?process=login&next=/`;
    },

    // Logout
    logout: async () => {
        try {
            await axios.post(`${API_URL}/api/logout/`);
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    },

    // Get user preferences
    getUserPreferences: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/preferences/`);
            return response.data.preferences;
        } catch (error) {
            console.error('Failed to get user preferences:', error);
            return null;
        }
    },

    // Update user preferences
    updateUserPreferences: async (preferences) => {
        try {
            const response = await axios.post(`${API_URL}/api/preferences/`, preferences);
            return response.data;
        } catch (error) {
            console.error('Failed to update preferences:', error);
            return null;
        }
    }
}; 