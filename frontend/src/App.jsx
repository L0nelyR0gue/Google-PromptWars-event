import React, { useState } from 'react';
import Login from './Login';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <div className="logo">Prompt<span>Wars</span></div>
        <div className="nav-links">
          {user ? (
            <span style={{ color: '#a0a0a0', fontWeight: '300' }}>
              Welcome, <span style={{ color: '#fff', fontWeight: '600'}}>{user.displayName}</span>
            </span>
          ) : (
            <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>Travel Engine</span>
          )}
        </div>
      </nav>

      {!user ? (
        <main>
          <section className="hero">
            <h1>Intelligent Travel Engine</h1>
            <p>Plan trips dynamically with personalized preferences, real-world constraints, and real-time updates powered by Gemini 2.0.</p>
            <Login onLoginSuccess={setUser} />
          </section>

          <section className="features-grid">
            <div className="glass-panel feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Planning</h3>
              <p>Input your budget, interests, and constraints. Our Gemini-powered engine crafts the perfect day-by-day itinerary.</p>
            </div>
            <div className="glass-panel feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Adjustments</h3>
              <p>Flight delayed? Museum closed? The engine automatically replans your trip based on live data and local events.</p>
            </div>
            <div className="glass-panel feature-card">
              <div className="feature-icon">☁️</div>
              <h3>Cloud Native</h3>
              <p>Built securely on Google Cloud. Your data is synced in real-time across all your devices using Firestore.</p>
            </div>
          </section>
        </main>
      ) : (
        <main style={{ marginTop: '3rem', animation: 'fadeIn 0.5s ease-out' }}>
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to the Dashboard</h2>
            <p style={{ color: '#a0a0a0', marginBottom: '2rem' }}>
              Authentication successful! This is where the core travel planner UI goes.
              <br/>
              Your teammate can now hook up the real Firebase config and backend APIs.
            </p>
            <button 
              className="google-btn" 
              style={{ background: 'var(--accent-google-red)', color: 'white' }}
              onClick={() => setUser(null)}
            >
              Sign Out
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
