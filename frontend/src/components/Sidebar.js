import React from 'react';
import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <h3>Recent Searches</h3>
                <ul className="history-list">
                    <li>
                        <span className="history-icon">🕒</span>
                        <span className="history-text">Study abroad in UK</span>
                    </li>
                    <li>
                        <span className="history-icon">🕒</span>
                        <span className="history-text">Best universities in Canada</span>
                    </li>
                </ul>
            </div>

            <div className="sidebar-section">
                <h3>Topics</h3>
                <ul className="topics-list">
                    <li>
                        <span className="topic-icon">🎓</span>
                        <span className="topic-text">Education</span>
                    </li>
                    <li>
                        <span className="topic-icon">💼</span>
                        <span className="topic-text">Careers</span>
                    </li>
                    <li>
                        <span className="topic-icon">🌍</span>
                        <span className="topic-text">Immigration</span>
                    </li>
                    <li>
                        <span className="topic-icon">💰</span>
                        <span className="topic-text">Finance</span>
                    </li>
                </ul>
            </div>

            <div className="sidebar-section">
                <h3>Saved</h3>
                <ul className="saved-list">
                    <li>
                        <span className="saved-icon">⭐</span>
                        <span className="saved-text">Important research</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar; 