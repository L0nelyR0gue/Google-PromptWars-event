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
    <button className="google-btn" onClick={handleGoogleSignIn}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" />
      Sign in with Google
    </button>
  );
}
