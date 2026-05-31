import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users, X, Check, Loader2 } from 'lucide-react';
import {
  sendFriendRequest,
  subscribeToFriends,
} from '../services/firestoreService';

export default function FriendSystem({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'list'
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
  const [friends, setFriends] = useState([]);

  // Real-time friends list
  useEffect(() => {
    if (!user?.email) return;
    const unsub = subscribeToFriends(user.email, setFriends);
    return () => unsub();
  }, [user?.email]);

  const handleSendRequest = async () => {
    if (!email.trim()) return;
    setSending(true);
    setMessage({ text: '', type: '' });
    try {
      await sendFriendRequest(user, email);
      setMessage({ text: `Friend request sent to ${email}! 🎉`, type: 'success' });
      setEmail('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '0.75rem',
    border: '2px solid var(--ink-black)',
    background: isActive ? 'var(--marker-blue)' : 'white',
    color: isActive ? 'white' : 'var(--ink-black)',
    fontFamily: 'Caveat, cursive',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: isActive ? '8px 8px 0 0' : '8px',
    borderBottom: isActive ? 'none' : '2px solid var(--ink-black)',
    transition: 'all 0.15s',
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
    }} onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="comic-box"
        style={{
          width: '90%', maxWidth: '480px', padding: '2rem',
          background: 'var(--paper-white)', position: 'relative',
          maxHeight: '80vh', overflow: 'auto',
        }}
      >
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'var(--marker-red)', border: '2px solid var(--ink-black)',
          borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '2px 2px 0px var(--ink-black)',
        }}>
          <X size={18} color="white" />
        </button>

        <h2 className="cartoon-font" style={{ margin: '0 0 1.5rem 0', fontSize: '2.2rem', color: 'var(--ink-black)' }}>
          👫 Friends
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => setActiveTab('add')} style={tabStyle(activeTab === 'add')}>
            <UserPlus size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Add Friend
          </button>
          <button type="button" onClick={() => setActiveTab('list')} style={tabStyle(activeTab === 'list')}>
            <Users size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            My Friends ({friends.length})
          </button>
        </div>

        {/* Add Friend Tab */}
        {activeTab === 'add' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: 0 }}>
              Enter your friend's email to send them a travel buddy request! ✈️
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: '8px',
                  border: '2px solid var(--ink-black)', background: 'white',
                  fontFamily: 'Nunito, sans-serif', fontSize: '1rem',
                  boxShadow: '3px 3px 0px var(--ink-black)', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSendRequest}
                disabled={sending || !email.trim()}
                style={{
                  padding: '0.75rem 1.25rem', borderRadius: '8px',
                  border: '2px solid var(--ink-black)',
                  background: sending ? 'var(--text-secondary)' : 'var(--marker-green)',
                  color: 'white', fontWeight: 'bold', cursor: sending ? 'wait' : 'pointer',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                  fontFamily: 'Nunito, sans-serif', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                {sending ? <Loader2 size={18} className="spin" /> : <UserPlus size={18} />}
              </button>
            </div>
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '0.75rem', borderRadius: '8px',
                    border: '2px solid var(--ink-black)',
                    background: message.type === 'success' ? 'var(--marker-green)' : 'var(--marker-red)',
                    color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 'bold',
                    boxShadow: '2px 2px 0px var(--ink-black)',
                  }}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Friends List Tab */}
        {activeTab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🫥</div>
                <p className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>
                  No travel buddies yet! Send a friend request to get started.
                </p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '0.75rem', border: '2px solid var(--ink-black)',
                  borderRadius: '8px', background: 'white',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                }}>
                  {friend.photoURL ? (
                    <img src={friend.photoURL} alt="" style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      border: '2px solid var(--ink-black)', objectFit: 'cover',
                    }} />
                  ) : (
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      border: '2px solid var(--ink-black)',
                      background: 'var(--marker-blue)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1.2rem',
                    }}>
                      {(friend.displayName || friend.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontFamily: 'Nunito, sans-serif', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {friend.displayName}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {friend.email}
                    </div>
                  </div>
                  <Check size={20} color="var(--marker-green)" />
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
