const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' 
    : 'http://localhost:8000';

export const auth = {
    // Check if user is authenticated
    isAuthenticated: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/status/`, {
                credentials: 'include',  // Important for cookies
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.isAuthenticated ? data.user : null;
            }
            return null;
        } catch (error) {
            console.error('Auth check failed:', error);
            return null;
        }
    },

    // Initiate Google OAuth login
    loginWithGoogle: () => {
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectUrl', currentUrl);
        window.location.href = `${API_BASE_URL}/accounts/google/login/?next=${encodeURIComponent(currentUrl)}`;
    },

    // Handle logout
    logout: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/accounts/logout/`, {  // Updated endpoint
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });
            
            if (response.ok) {
                // Clear any stored auth data
                sessionStorage.clear();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    },

    // Check authentication status on page load
    handleAuthCallback: async () => {
        const user = await auth.isAuthenticated();
        if (user) {
            const redirectUrl = sessionStorage.getItem('redirectUrl');
            sessionStorage.removeItem('redirectUrl');
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }
        return user;
    }
};

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
} 