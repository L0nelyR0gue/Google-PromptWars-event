import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login({ onLoginSuccess, compact = false }) {
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
        gap: compact ? '8px' : '12px',
        background: '#ffffff',
        color: 'var(--ink-black)',
        fontFamily: 'Nunito, sans-serif',
        fontSize: compact ? '1rem' : '1.2rem',
        fontWeight: '800',
        padding: compact ? '8px 16px' : '16px 32px',
        borderRadius: compact ? '8px' : '12px',
        border: compact ? '2px solid var(--ink-black)' : '3px solid var(--ink-black)',
        cursor: 'pointer',
        boxShadow: compact ? '3px 3px 0px var(--ink-black)' : '6px 6px 0px var(--ink-black)',
        transition: 'all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = compact ? '5px 5px 0px var(--ink-black)' : '8px 8px 0px var(--ink-black)';
        e.currentTarget.style.background = '#fafafa';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translate(0)';
        e.currentTarget.style.boxShadow = compact ? '3px 3px 0px var(--ink-black)' : '6px 6px 0px var(--ink-black)';
        e.currentTarget.style.background = '#ffffff';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = compact ? 'translate(2px, 2px)' : 'translate(4px, 4px)';
        e.currentTarget.style.boxShadow = compact ? '1px 1px 0px var(--ink-black)' : '2px 2px 0px var(--ink-black)';
      }}
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google Logo" 
        style={{ width: compact ? '20px' : '28px', height: compact ? '20px' : '28px' }} 
      />
      <span>{compact ? 'Login' : 'Authenticate via Google'}</span>
    </button>
  );
}
