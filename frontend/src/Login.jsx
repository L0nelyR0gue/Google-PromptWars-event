import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export default function Login({ onLoginSuccess }) {
  const handleGoogleSignIn = async () => {
    try {
      // Uncomment the below lines when Firebase config is ready
      // const result = await signInWithPopup(auth, googleProvider);
      // const user = result.user;
      // console.log("User signed in:", user);
      
      // Mock login for now so you can test the UI flow
      console.log("Mock Google Sign-In Triggered. Ensure firebase.js has real credentials to work.");
      if (onLoginSuccess) {
        onLoginSuccess({ displayName: "Demo User", email: "demo@example.com" });
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <button className="google-btn" onClick={handleGoogleSignIn}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" />
      Sign in with Google
    </button>
  );
}
