import React from 'react';
import { auth } from '../services/auth';
import '../styles/AuthModal.css';

function AuthModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        auth.loginWithGoogle();
    };

    return (
        <div className="search-modal-overlay">
            <div className="search-modal">
                <div className="search-modal-content">
                    <button className="search-modal-close" onClick={onClose}>×</button>
                    <div className="search-modal-header">
                        <h2>Sign in to AI Search</h2>
                    </div>
                    <div className="search-modal-body">
                        <button 
                            className="search-button auth-button" 
                            onClick={handleGoogleLogin}
                        >
                            <img 
                                src="/google-icon.png" 
                                alt="Google" 
                                className="auth-icon" 
                            />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal; 