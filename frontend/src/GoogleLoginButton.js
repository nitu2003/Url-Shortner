import React from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

const GoogleLoginButton = ({ onLoginSuccess }) => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken(); // Get the ID token
            const user = result.user; // Get user details (email, name, photo, etc.)

            // Pass the token and user details to the parent or backend
            onLoginSuccess({ idToken, user });
        } catch (error) {
            console.error("Google Login Error:", error.message);
        }
    };

    return (
        <button onClick={handleLogin} style={buttonStyle}>
            Login with Google
        </button>
    );
};

// Custom button styling (optional)
const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4285F4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default GoogleLoginButton;
