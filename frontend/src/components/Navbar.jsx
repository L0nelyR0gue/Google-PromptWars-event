import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onSignOut, theme, toggleTheme }) {
  return (
    <nav style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.8rem 1.5rem',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--glass-border)',
      borderRadius: '50px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
          Prompt<span style={{ background: 'var(--google-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wars</span>
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.7 }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '400', fontSize: '0.9rem' }}>
              Welcome, <span style={{ color: 'var(--text-primary)', fontWeight: '600'}}>{user.displayName}</span>
            </span>
            <button 
              onClick={onSignOut}
              style={{
                background: 'rgba(234, 67, 53, 0.1)',
                border: '1px solid var(--google-red)',
                color: 'var(--google-red)',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--google-red)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(234, 67, 53, 0.1)'; e.currentTarget.style.color = 'var(--google-red)'; }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'JetBrains Mono, monospace' }}>v1.0.0-beta</span>
        )}
      </div>
    </nav>
  );
}
