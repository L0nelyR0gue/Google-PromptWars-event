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
        background: 'var(--navbar-bg)',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '1rem',
        fontWeight: '600',
        padding: '16px 32px',
        borderRadius: '50px',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(66, 133, 244, 0.15)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(66, 133, 244, 0.3)';
        e.currentTarget.style.borderColor = 'var(--google-blue)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(66, 133, 244, 0.15)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
      }}
    >
      {/* Subtle background glow effect on the button itself */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--google-gradient)',
        opacity: 0.1,
        zIndex: 0
      }}></div>
      
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google Logo" 
        style={{ width: '24px', height: '24px', position: 'relative', zIndex: 1 }} 
      />
      <span style={{ position: 'relative', zIndex: 1 }}>Authenticate via Google</span>
    </button>
  );
}
