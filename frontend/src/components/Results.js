import React from 'react';
import '../styles/Results.css';

function Results({ data }) {
  // Function to safely render the AI response with markdown-like formatting
  const renderFormattedResponse = (text) => {
    // Split by double newlines to preserve paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((paragraph, idx) => {
      // Check if paragraph contains Reddit user quotes
      if (paragraph.includes('Reddit user u/') || paragraph.includes('🗣️ Real User Experiences')) {
        return (
          <div key={idx} className="reddit-quotes">
            <h3>🗣️ Real User Experiences</h3>
            <div className="quotes-container">
              {paragraph.split(/\n(?=\*\*Reddit user)/).map((quote, qIdx) => (
                <div key={`quote-${qIdx}`} className="reddit-quote">
                  {quote.trim()}
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      // Check if paragraph is a Pros section
      else if (paragraph.includes('✅ Pros') || paragraph.includes('**✅ Pros')) {
        return (
          <div key={idx} className="pros-section">
            <h3>{paragraph.split(/\n/)[0]}</h3>
            <ul>
              {paragraph.split(/\n\*/).slice(1).map((item, iIdx) => (
                <li key={`pro-${iIdx}`}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Check if paragraph is a Cons section
      else if (paragraph.includes('❌ Cons') || paragraph.includes('**❌ Cons')) {
        return (
          <div key={idx} className="cons-section">
            <h3>{paragraph.split(/\n/)[0]}</h3>
            <ul>
              {paragraph.split(/\n\*/).slice(1).map((item, iIdx) => (
                <li key={`con-${iIdx}`}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Check if paragraph is a verdict
      else if (paragraph.includes('📌 **Verdict:') || paragraph.includes('Verdict:')) {
        return (
          <div key={idx} className="verdict">
            {paragraph}
          </div>
        );
      }
      
      // Default paragraph rendering
      return <p key={idx}>{paragraph}</p>;
    });
  };

  return (
    <div className="results">
      <div className="ai-response">
        <h2>AI Analysis</h2>
        <div className="response-content">
          {data.ai_response ? renderFormattedResponse(data.ai_response) : 'No response available'}
        </div>
      </div>
    </div>
  );
}

export default Results;