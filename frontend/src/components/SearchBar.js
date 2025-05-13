import React, { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything..."
        className="search-input"
        disabled={loading}
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <svg viewBox="0 0 24 24" className="search-icon">
            <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" />
          </svg>
        )}
      </button>
    </form>
  );
}

export default SearchBar; 