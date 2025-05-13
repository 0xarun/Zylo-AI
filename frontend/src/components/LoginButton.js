import React from 'react';
import '../styles/LoginButton.css';

function LoginButton({ onClick }) {
    return (
        <button className="login-button" onClick={onClick}>
            <svg className="user-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Login
        </button>
    );
}

export default LoginButton; 