// components/ConversationThread.js
import React from 'react';
import Results from './Results';
import FollowUpSection from './FollowUpSection';
import '../styles/ConversationThread.css';

function ConversationThread({ history, onFollowUpClick, loading, currentQuery }) {
    return (
        <div className="conversation-thread">
            {history.map((item, index) => (
                <div 
                    key={item.id} 
                    className={`conversation-item ${index === history.length - 1 ? 'latest' : ''}`}
                >
                    <div className="user-query">
                        <div className="query-indicator">
                            <svg viewBox="0 0 24 24" className="user-icon">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="query-content">
                            <span className="query-label">Question:</span>
                            {item.query}
                        </div>
                    </div>
                    
                    <div className="ai-response-container">
                        <div className="response-indicator">
                            <div className="ai-icon">AI</div>
                        </div>
                        <div className="response-content-wrapper">
                            <div className="response-label">Response:</div>
                            <Results data={item.response} />
                            
                            {/* Show follow-up section only for the latest response */}
                            {index === history.length - 1 && !loading && (
                                <FollowUpSection 
                                    followUpQuestions={item.response.follow_up_questions}
                                    onFollowUpClick={onFollowUpClick}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading state with current query */}
            {loading && currentQuery && (
                <div className="conversation-item">
                    {/* Show the pending query */}
                    <div className="user-query">
                        <div className="query-indicator">
                            <svg viewBox="0 0 24 24" className="user-icon">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="query-content">{currentQuery}</div>
                    </div>

                    {/* Loading animation */}
                    <div className="loading-message">
                        <div className="loading-content">
                            <div className="response-indicator">
                                <div className="ai-icon">AI</div>
                            </div>
                            <div className="loading-dots">
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConversationThread;