import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SettingsModal from './components/SettingsModal';
import FriendSystem from './components/FriendSystem';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { upsertUserProfile } from './services/firestoreService';
import './index.css';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--google-blue)',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        opacity: 0.8
      }}
    />
  );
};

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Auto-create/update Firestore user profile on login
      if (currentUser) {
        try {
          await upsertUserProfile(currentUser);
        } catch (err) {
          console.error('Failed to upsert user profile:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUserUpdated = () => {
    // Force a re-render of the user object by spreading the current auth user
    if (auth.currentUser) {
      setUser({ ...auth.currentUser });
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
        <CustomCursor />
        <div className="ambient-glow"></div>
        <div className="app-container">
          <Navbar 
            user={user} 
            onSignOut={handleSignOut} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenFriends={() => setIsFriendsOpen(true)}
          />
          
          {isSettingsOpen && user && (
            <SettingsModal 
              user={user} 
              onClose={() => setIsSettingsOpen(false)} 
              onUserUpdated={handleUserUpdated}
              onSignOut={handleSignOut}
            />
          )}

          {isFriendsOpen && user && (
            <FriendSystem 
              user={user} 
              onClose={() => setIsFriendsOpen(false)} 
            />
          )}

          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing onLoginSuccess={setUser} theme={theme} />} />
            <Route path="/dashboard" element={<Dashboard user={user} theme={theme} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

