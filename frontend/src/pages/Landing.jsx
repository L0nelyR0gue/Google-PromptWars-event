import React from 'react';
import Login from '../components/Login';

export default function Landing({ onLoginSuccess }) {
  return (
    <main style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <section className="hero">
        <h1>Intelligent Travel Engine</h1>
        <p>Plan trips dynamically with personalized preferences, real-world constraints, and real-time updates powered by Gemini 2.0.</p>
        <Login onLoginSuccess={onLoginSuccess} />
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
  );
}
