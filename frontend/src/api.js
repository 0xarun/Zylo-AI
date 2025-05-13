const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' 
    : 'http://localhost:8000';

export const searchQuery = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            // Try to get error message from response
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Search request failed');
            } catch (jsonError) {
                throw new Error(`Search request failed with status: ${response.status}`);
            }
        }

        const data = await response.json();
        
        // Validate response data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('Cannot connect to server. Please check if the backend is running.');
        }
        throw error;
    }
};