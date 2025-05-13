import React, { useState, useEffect } from 'react';
import { searchHistoryService } from '../services/searchHistoryService';
import '../styles/SearchHistory.css';

function SearchHistory({ onSelectQuery }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        setLoading(true);
        const data = await searchHistoryService.getSearchHistory();
        setHistory(data);
        setLoading(false);
    };

    const handleDelete = async (historyId) => {
        const success = await searchHistoryService.deleteSearchItem(historyId);
        if (success) {
            setHistory(history.filter(item => item.id !== historyId));
        }
    };

    const handleClearAll = async () => {
        const success = await searchHistoryService.clearHistory();
        if (success) {
            setHistory([]);
        }
    };

    if (loading) {
        return <div className="search-history-loading">Loading history...</div>;
    }

    return (
        <div className="search-history">
            <div className="search-history-header">
                <h3>Search History</h3>
                {history.length > 0 && (
                    <button 
                        className="clear-history-button"
                        onClick={handleClearAll}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="no-history">No search history yet</div>
            ) : (
                <ul className="history-list">
                    {history.map((item) => (
                        <li key={item.id} className="history-item">
                            <div className="history-item-content">
                                <button
                                    className="query-button"
                                    onClick={() => onSelectQuery(item.query)}
                                >
                                    {item.query}
                                </button>
                                <span className="timestamp">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(item.id)}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchHistory; 