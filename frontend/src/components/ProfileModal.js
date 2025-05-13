import React from 'react';
import Modal from 'react-modal';
import '../styles/ProfileModal.css';

Modal.setAppElement('#root');

function ProfileModal({ isOpen, onClose, user }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="profile-modal"
            overlayClassName="profile-modal-overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>

                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {user?.displayName?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <h2>{user?.displayName || 'User'}</h2>
                    <p>{user?.email}</p>
                </div>

                <div className="profile-body">
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Searches</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Saved</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="action-button">
                            <svg viewBox="0 0 24 24">
                                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                            </svg>
                            Settings
                        </button>
                        <button className="action-button">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                            </svg>
                            Help
                        </button>
                        <button className="action-button signout">
                            <svg viewBox="0 0 24 24">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ProfileModal; 