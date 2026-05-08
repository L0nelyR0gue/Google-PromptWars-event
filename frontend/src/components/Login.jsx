import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Login({ onLoginSuccess }) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in:", user);
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Sign-in failed. Please ensure Firebase is correctly configured.");
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        background: '#ffffff',
        color: 'var(--ink-black)',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '1.2rem',
        fontWeight: '800',
        padding: '16px 32px',
        borderRadius: '12px',
        border: '3px solid var(--ink-black)',
        cursor: 'pointer',
        boxShadow: '6px 6px 0px var(--ink-black)',
        transition: 'all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '8px 8px 0px var(--ink-black)';
        e.currentTarget.style.background = '#fafafa';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translate(0)';
        e.currentTarget.style.boxShadow = '6px 6px 0px var(--ink-black)';
        e.currentTarget.style.background = '#ffffff';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translate(4px, 4px)';
        e.currentTarget.style.boxShadow = '2px 2px 0px var(--ink-black)';
      }}
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google Logo" 
        style={{ width: '28px', height: '28px' }} 
      />
      <span>Authenticate via Google</span>
    </button>
  );
}
