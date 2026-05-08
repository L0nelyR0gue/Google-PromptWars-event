import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Login from './Login';

export default function Navbar({ user, onSignOut }) {
  return (
    <nav style={{
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
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="cartoon-font" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-black)', cursor: 'grab', transform: 'rotate(-2deg)' }}
             onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
             onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}>
          <Plane size={28} color="var(--marker-blue)" fill="var(--marker-blue)" style={{ transform: 'rotate(45deg)' }} />
          Travi!
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              Hi, <span style={{ color: 'var(--ink-black)'}}>{user.displayName}</span>
            </span>
            <button 
              onClick={onSignOut}
              style={{
                background: 'var(--marker-red)',
                border: '2px solid var(--ink-black)',
                color: 'var(--ink-black)',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '800',
                boxShadow: '3px 3px 0px var(--ink-black)',
                transition: 'all 0.1s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '5px 5px 0px var(--ink-black)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--ink-black)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '1px 1px 0px var(--ink-black)'; }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', transform: 'rotate(2deg)' }}>Your Fun Planner!</span>
            <Login compact />
          </div>
        )}
      </div>
    </nav>
  );
}
