import React, { useState } from 'react';
import axios from 'axios';
import ConversationSidebar from './ConversationSidebar';
import styles from '../styles/SearchView.module.css';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // If there's no current conversation, create a new one
      let conversationId = currentConversation?.id;
      
      if (!conversationId) {
        const convResponse = await axios.post('/api/conversations/', {
          title: query // Use the first query as the conversation title
        });
        conversationId = convResponse.data.id;
        setCurrentConversation(convResponse.data);
      }

      // Send the search query
      const response = await axios.post(`/api/conversations/${conversationId}/messages/`, {
        query,
        is_follow_up: messages.length > 0
      });

      // Update messages
      setMessages(prev => [...prev, {
        query,
        response: response.data.response,
        created_at: new Date().toISOString()
      }]);

      setQuery('');
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}/`);
      setCurrentConversation(response.data.conversation);
      setMessages(response.data.conversation.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  return (
    <div className={styles.container}>
      <ConversationSidebar
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversation?.id}
      />
      <div className={styles.mainContent}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className={styles.searchInput}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div key={index} className={styles.messageContainer}>
              <div className={styles.query}>
                <strong>You:</strong> {message.query}
              </div>
              <div className={styles.response}>
                <strong>AI:</strong> {message.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchView; 