import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const searchService = {
    search: async (query) => {
        try {
            const response = await axios.get(`${API_URL}/api/search/`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }
}; 