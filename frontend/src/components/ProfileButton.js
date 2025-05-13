import React, { useRef, useState, useEffect } from 'react';
import '../styles/ProfileButton.css';

function ProfileButton({ user, onSignOut }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="profile-wrapper" ref={dropdownRef}>
            <button 
                className="search-button profile-btn" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                {user?.photoUrl ? (
                    <img 
                        src={user.photoUrl} 
                        alt="Profile" 
                        className="profile-photo" 
                    />
                ) : (
                    <div className="profile-initial">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                )}
            </button>

            {isDropdownOpen && (
                <div className="profile-menu">
                    <button 
                        className="search-button menu-item" 
                        onClick={() => {
                            setIsDropdownOpen(false);
                            onSignOut();
                        }}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileButton; 