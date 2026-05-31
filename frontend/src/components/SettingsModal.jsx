import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import { X, Trash2, Save, User, Image as ImageIcon } from 'lucide-react';

export default function SettingsModal({ user, onClose, onUserUpdated, onSignOut }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim() || 'Traveler',
        photoURL: photoURL.trim()
      });
      setSuccess('Profile updated successfully! ✨');
      if (onUserUpdated) onUserUpdated(); // Trigger re-render in parent if needed
      // Close after a brief moment
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ Are you absolutely sure? This will permanently delete your account and all your travel plans!")) {
      setLoading(true);
      try {
        await deleteUser(auth.currentUser);
        // User will be signed out automatically and App will redirect
      } catch (err) {
        console.error(err);
        if (err.code === 'auth/requires-recent-login') {
          setError('Please sign out and sign in again before deleting your account.');
        } else {
          setError('Failed to delete account.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="comic-box"
          style={{
            background: 'var(--paper-white)',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-black)'
            }}
          >
            <X size={28} />
          </button>

          <h2 className="cartoon-font" style={{ fontSize: '2.5rem', marginTop: 0, color: 'var(--marker-blue)' }}>
            Settings
          </h2>

          {error && <div style={{ color: 'white', background: 'var(--marker-red)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
          {success && <div style={{ color: 'var(--ink-black)', background: 'var(--marker-green)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>{success}</div>}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Username */}
            <div>
              <label className="cartoon-font" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <User size={20} /> Display Name
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your awesome name"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '1.2rem',
                  fontFamily: 'Nunito, sans-serif',
                  border: '2px solid var(--ink-black)',
                  borderRadius: '8px',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Profile Picture URL */}
            <div>
              <label className="cartoon-font" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <ImageIcon size={20} /> Profile Picture URL
              </label>
              <input 
                type="text" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/my-avatar.png"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '1rem',
                  fontFamily: 'Nunito, sans-serif',
                  border: '2px solid var(--ink-black)',
                  borderRadius: '8px',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                  outline: 'none'
                }}
              />
              {photoURL && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="cartoon-font" style={{ color: 'var(--text-secondary)' }}>Preview:</span>
                  <img src={photoURL} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--ink-black)', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            {/* Save Button */}
            <button 
              type="submit"
              disabled={loading}
              className="comic-box"
              style={{
                background: 'var(--marker-yellow)',
                color: 'var(--ink-black)',
                padding: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem'
              }}
            >
              <Save size={20} /> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={() => { onClose(); onSignOut(); }}
              className="comic-box"
              style={{
                background: 'var(--marker-red)',
                border: '2px solid var(--ink-black)',
                color: 'var(--ink-black)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '800',
                boxShadow: '3px 3px 0px var(--ink-black)',
                width: '100%',
                fontSize: '1.2rem',
                transition: 'all 0.1s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '5px 5px 0px var(--ink-black)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--ink-black)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '1px 1px 0px var(--ink-black)'; }}
            >
              Sign Out
            </button>
          </div>

          <hr style={{ border: '1px dashed var(--ink-black)', margin: '2rem 0', opacity: 0.3 }} />

          {/* Danger Zone */}
          <div>
            <h3 className="cartoon-font" style={{ color: 'var(--marker-red)', marginTop: 0, fontSize: '1.5rem' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={handleDeleteAccount}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '2px dashed var(--marker-red)',
                color: 'var(--marker-red)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 'bold',
                width: '100%',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--marker-red)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderStyle = 'solid'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--marker-red)'; e.currentTarget.style.borderStyle = 'dashed'; }}
            >
              <Trash2 size={20} /> Delete Account
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
