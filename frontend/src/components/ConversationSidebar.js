import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaThumbtack, FaTrash } from 'react-icons/fa';
import styles from '../styles/ConversationSidebar.module.css';

const ConversationSidebar = ({ onSelectConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/conversations/');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await axios.delete(`/api/conversations/${conversationId}/`);
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const handlePin = async (conversationId, e) => {
    e.stopPropagation();
    try {
      const response = await axios.patch(`/api/conversations/${conversationId}/pin/`);
      const updatedConversation = response.data;
      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== conversationId);
        return [updatedConversation, ...filtered];
      });
    } catch (error) {
      console.error('Error pinning conversation:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button 
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {!isCollapsed && (
        <>
          <h2 className={styles.sidebarTitle}>Conversations</h2>
          <div className={styles.conversationList}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                Loading...
              </div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : conversations.length === 0 ? (
              <div className={styles.emptyState}>
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`${styles.conversationItem} ${
                    currentConversationId === conversation.id ? styles.active : ''
                  } ${conversation.is_pinned ? styles.pinned : ''}`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className={styles.conversationHeader}>
                    <span className={styles.title}>{conversation.title}</span>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.pinButton}`}
                        onClick={(e) => handlePin(conversation.id, e)}
                        title={conversation.is_pinned ? "Unpin" : "Pin"}
                      >
                        <FaThumbtack />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={(e) => handleDelete(conversation.id, e)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <span className={styles.date}>
                    {formatDate(conversation.updated_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationSidebar; 