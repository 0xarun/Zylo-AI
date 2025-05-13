import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const searchHistoryService = {
    getSearchHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/search-history/`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch search history:', error);
            return [];
        }
    },

    saveSearch: async (query, response) => {
        try {
            const data = { query, response };
            const result = await axios.post(`${API_URL}/api/search-history/`, data);
            return result.data;
        } catch (error) {
            console.error('Failed to save search:', error);
            return null;
        }
    },

    deleteSearchItem: async (historyId) => {
        try {
            await axios.delete(`${API_URL}/api/search-history/${historyId}/`);
            return true;
        } catch (error) {
            console.error('Failed to delete search history item:', error);
            return false;
        }
    },

    clearHistory: async () => {
        try {
            await axios.delete(`${API_URL}/api/search-history/`);
            return true;
        } catch (error) {
            console.error('Failed to clear search history:', error);
            return false;
        }
    }
}; 