import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  // Protect this route
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Travel Planner</h2>
          <p style={{ color: '#a0a0a0', margin: 0 }}>
            Configure your trip preferences and constraints to generate a personalized itinerary.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Sidebar: Planner Form */}
          <aside>
            <div className="glass-panel feature-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Trip Details</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="destination" style={{ fontSize: '0.9rem', color: '#ccc' }}>Destination</label>
                  <input 
                    type="text" 
                    id="destination" 
                    placeholder="e.g., Tokyo, Japan" 
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label htmlFor="startDate" style={{ fontSize: '0.9rem', color: '#ccc' }}>Start Date</label>
                    <input type="date" id="startDate" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label htmlFor="endDate" style={{ fontSize: '0.9rem', color: '#ccc' }}>End Date</label>
                    <input type="date" id="endDate" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="budget" style={{ fontSize: '0.9rem', color: '#ccc' }}>Budget Level</label>
                  <select id="budget" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#1a1a1a', color: 'white' }}>
                    <option value="budget">Budget-friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                <button 
                  type="button"
                  style={{
                    background: 'var(--accent-google-blue)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Generate Itinerary
                </button>
              </form>
            </div>
          </aside>

          {/* Main Area: Itinerary View / Map */}
          <section>
            <div className="glass-panel" style={{ height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🗺️</div>
              <h3 style={{ color: '#888' }}>Your Itinerary Awaits</h3>
              <p style={{ color: '#666', textAlign: 'center', maxWidth: '300px' }}>
                Fill out the trip details on the left and click "Generate" to see your Gemini-powered plan.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
