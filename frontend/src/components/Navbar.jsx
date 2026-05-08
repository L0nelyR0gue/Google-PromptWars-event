import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Login from './Login';
import Notifications from './Notifications';

export default function Navbar({ user, onSignOut, onOpenSettings, onOpenFriends }) {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.5rem',
        background: 'var(--paper-white)',
        border: 'var(--border-thick)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-solid)',
        marginBottom: '2rem'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="cartoon-font" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-black)', cursor: 'grab' }}>
          <Plane size={32} color="var(--marker-blue)" fill="var(--marker-blue)" style={{ transform: 'rotate(45deg)' }} />
          Travi!
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.photoURL && (
              <img src={user.photoURL} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--ink-black)' }} />
            )}
            <span className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
              Hi, <span style={{ color: 'var(--ink-black)', fontWeight: 'bold' }}>{user.displayName || 'Traveler'}</span>
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Notification Bell */}
              <Notifications user={user} />

              {/* Friends Button */}
              <button 
                onClick={onOpenFriends}
                style={{
                  background: 'var(--marker-blue)',
                  border: '2px solid var(--ink-black)',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: '800',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                  transition: 'all 0.1s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '5px 5px 0px var(--ink-black)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--ink-black)'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '1px 1px 0px var(--ink-black)'; }}
              >
                <Users size={16} /> Friends
              </button>

              {/* Settings Button */}
              <button 
                onClick={onOpenSettings}
                style={{
                  background: 'var(--marker-yellow)',
                  border: '2px solid var(--ink-black)',
                  color: 'var(--ink-black)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: '800',
                  boxShadow: '3px 3px 0px var(--ink-black)',
                  transition: 'all 0.1s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '5px 5px 0px var(--ink-black)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--ink-black)'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '1px 1px 0px var(--ink-black)'; }}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', transform: 'rotate(2deg)' }}>Your Fun Planner!</span>
            <Login compact />
          </div>
        )}
      </div>
    </motion.nav>
  );
}

