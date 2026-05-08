import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onSignOut }) {
  return (
    <nav className="nav-bar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="logo">Prompt<span>Wars</span></div>
      </Link>
      <div className="nav-links">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#a0a0a0', fontWeight: '300' }}>
              Welcome, <span style={{ color: '#fff', fontWeight: '600'}}>{user.displayName}</span>
            </span>
            <button 
              onClick={onSignOut}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent-google-red)',
                color: 'var(--accent-google-red)',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>Travel Engine</span>
        )}
      </div>
    </nav>
  );
}
