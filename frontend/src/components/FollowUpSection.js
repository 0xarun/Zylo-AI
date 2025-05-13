import React, { useState } from 'react';
import '../styles/FollowUpSection.css';

function FollowUpSection({ followUpQuestions, onFollowUpClick }) {
    const [customQuestion, setCustomQuestion] = useState('');

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customQuestion.trim()) {
            onFollowUpClick(customQuestion);
            setCustomQuestion('');
        }
    };

    return (
        <div className="follow-up-section">
            <h3 className="follow-up-title">Follow-up Questions</h3>
            
            {/* Suggested questions */}
            {followUpQuestions && followUpQuestions.length > 0 && (
                <div className="suggested-questions">
                    <h4 className="suggested-title">Suggested Questions</h4>
                    <div className="questions-grid">
                        {followUpQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="question-button"
                                onClick={() => onFollowUpClick(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom question input */}
            <div className="custom-question">
                <h4 className="custom-title">Ask Your Own Question</h4>
                <form onSubmit={handleCustomSubmit} className="custom-question-form">
                    <input
                        type="text"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Type your follow-up question..."
                        className="custom-question-input"
                    />
                    <button 
                        type="submit" 
                        className="custom-question-submit"
                        disabled={!customQuestion.trim()}
                    >
                        Ask
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FollowUpSection; 