import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ConversationThread from './components/ConversationThread';
import { searchQuery } from './api';
import LoginButton from './components/LoginButton';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import { auth } from './services/auth';
import ProfileButton from './components/ProfileButton';
import ConversationSidebar from './components/ConversationSidebar';
import axios from 'axios';
import styles from './styles/App.module.css';

function App() {
    // State declarations
    const [conversationHistory, setConversationHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentQuery, setCurrentQuery] = useState('');
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    // Check auth status on mount and after redirect back from Google
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const userData = await auth.isAuthenticated();
                console.log('Auth status:', userData); // Debug log
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    // Add this effect to check auth status when the window regains focus
    useEffect(() => {
        const handleFocus = () => {
            auth.isAuthenticated().then(userData => {
                if (userData) {
                    setUser(userData);
                }
            });
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Search handler
    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);
        setCurrentQuery(query);
        
        try {
            const data = await searchQuery(query);
            
            // Add new query and response to conversation history
            setConversationHistory(prevHistory => [
                ...prevHistory,
                {
                    id: Date.now(),
                    query: query,
                    response: data
                }
            ]);
            
            // Scroll to the latest response
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
            
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to fetch results. Please try again.');
        } finally {
            setLoading(false);
            setCurrentQuery('');
        }
    };
    
    // Follow-up handler
    const handleFollowUpClick = (followUpQuery) => {
        handleSearch(followUpQuery);
    };

    // Update auth handlers
    const handleLogin = async (googleUser) => {
        const userData = await auth.isAuthenticated();
        if (userData) {
            setUser(userData);
            setIsAuthModalOpen(false);
        }
    };

    const handleSignOut = async () => {
        try {
            // First, call the backend logout endpoint
            const success = await auth.logout();
            if (success) {
                // Clear any stored auth data
                sessionStorage.removeItem('redirectUrl');
                // Update UI state
                setUser(null);
                // Optionally, redirect to home or show a success message
                window.location.reload(); // This ensures complete state reset
            }
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const handleSelectConversation = async (conversationId) => {
        try {
            const response = await axios.get(`/api/conversations/${conversationId}/`);
            // Update your chat state with the conversation messages
            setCurrentConversationId(conversationId);
            // Update your chat messages state here
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    return (
        <div className={styles.appContainer}>
            <ConversationSidebar
                onSelectConversation={handleSelectConversation}
                currentConversationId={currentConversationId}
            />
            <div className={styles.mainContent}>
                <header className="header">
                    <h1>AI Search</h1>
                    <p className="subtitle">Discover authentic conversations and insights</p>
                </header>

                <div className="auth-container">
                    {isLoading ? (
                        <div className="loading-spinner" />
                    ) : !user ? (
                        <LoginButton onClick={() => setIsAuthModalOpen(true)} />
                    ) : (
                        <ProfileButton 
                            user={user}
                            onSignOut={handleSignOut}
                        />
                    )}
                </div>

                <AuthModal 
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />

                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                    onSignOut={handleSignOut}
                />

                <SearchBar onSearch={handleSearch} loading={loading} />

                {error && (
                    <div className="error-message">
                        {error}
                        {error.includes('connect to server') && (
                            <div className="error-hint">
                                Make sure the Django server is running on port 8000
                            </div>
                        )}
                    </div>
                )}

                {loading && (
                    <div className="loading-message">
                        Searching for insights...
                    </div>
                )}

                {conversationHistory.length > 0 && (
                    <ConversationThread 
                        history={conversationHistory} 
                        onFollowUpClick={handleFollowUpClick}
                        loading={loading}
                        currentQuery={currentQuery}
                    />
                )}
            </div>
        </div>
    );
}

export default App;