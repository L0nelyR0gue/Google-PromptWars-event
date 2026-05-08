import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const PREFERENCE_OPTIONS = [
  { id: 'street-food', label: '🍜 Street Food', value: 'street food' },
  { id: 'fine-dining', label: '🍽️ Fine Dining', value: 'fine dining' },
  { id: 'temples', label: '⛩️ Temples', value: 'temples' },
  { id: 'museums', label: '🏛️ Museums', value: 'museums' },
  { id: 'nature', label: '🌿 Nature', value: 'nature' },
  { id: 'shopping', label: '🛍️ Shopping', value: 'shopping' },
  { id: 'nightlife', label: '🌙 Nightlife', value: 'nightlife' },
  { id: 'adventure', label: '🧗 Adventure', value: 'adventure' },
  { id: 'history', label: '📜 History', value: 'history' },
  { id: 'art', label: '🎨 Art', value: 'art' },
];

const DISRUPTION_OPTIONS = [
  "Heavy rain expected tomorrow",
  "Main museum closed for renovation",
  "Flight delayed by 4 hours",
  "Local festival happening nearby",
  "Traveler feeling unwell — lighter schedule needed",
];

const API_BASE = window.location.origin;

export default function Dashboard({ user }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetLevel, setBudgetLevel] = useState('moderate');
  const [travelerType, setTravelerType] = useState('solo');
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [accessibility, setAccessibility] = useState(false);
  const [dietary, setDietary] = useState('none');
  const [maxWalking, setMaxWalking] = useState(10);

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replanLoading, setReplanLoading] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const togglePref = (value) => {
    setSelectedPrefs((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleGenerate = async () => {
    if (!destination || !startDate || !endDate) {
      setError('Please fill in destination and dates.');
      return;
    }
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const res = await fetch(`${API_BASE}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          end_date: endDate,
          budget_level: budgetLevel,
          preferences: selectedPrefs,
          traveler_type: travelerType,
          constraints: {
            max_daily_walking_km: maxWalking,
            accessibility_needs: accessibility,
            dietary_restrictions: dietary,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplan = async (disruption) => {
    if (!itinerary) return;
    setReplanLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/replan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_destination: destination,
          start_date: startDate,
          end_date: endDate,
          budget_level: budgetLevel,
          preferences: selectedPrefs,
          traveler_type: travelerType,
          constraints: {
            max_daily_walking_km: maxWalking,
            accessibility_needs: accessibility,
            dietary_restrictions: dietary,
          },
          disruption,
          original_itinerary_summary: itinerary.summary || '',
        }),
      });

      if (!res.ok) throw new Error(`Re-plan failed: ${res.status}`);
      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setReplanLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)',
    color: 'white', fontFamily: 'inherit', fontSize: '0.95rem', width: '100%',
  };
  const labelStyle = { fontSize: '0.85rem', color: '#aaa', marginBottom: '4px', display: 'block' };

  return (
    <main style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease-out' }} role="main">
      <a href="#itinerary-results" className="skip-link" style={{
        position: 'absolute', left: '-9999px', top: '0',
        background: 'var(--accent-google-blue)', color: '#fff', padding: '8px 16px',
        zIndex: 100, borderRadius: '0 0 8px 0',
      }}>Skip to results</a>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem 0', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Trip Planner
          </h1>
          <p style={{ color: '#a0a0a0', margin: 0, fontSize: '0.95rem' }}>
            Configure your trip and let AI generate a weather-aware itinerary.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Sidebar Form */}
          <aside aria-label="Trip configuration form">
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.2rem' }}>Trip Details</h2>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="destination" style={labelStyle}>Destination *</label>
                  <input id="destination" type="text" placeholder="e.g., Tokyo, Japan" value={destination}
                    onChange={(e) => setDestination(e.target.value)} style={inputStyle} required aria-required="true" />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="startDate" style={labelStyle}>Start Date *</label>
                    <input id="startDate" type="date" value={startDate}
                      onChange={(e) => setStartDate(e.target.value)} style={inputStyle} required aria-required="true" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="endDate" style={labelStyle}>End Date *</label>
                    <input id="endDate" type="date" value={endDate}
                      onChange={(e) => setEndDate(e.target.value)} style={inputStyle} required aria-required="true" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="budget" style={labelStyle}>Budget</label>
                    <select id="budget" value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value)} style={inputStyle}>
                      <option value="budget">💰 Budget</option>
                      <option value="moderate">💳 Moderate</option>
                      <option value="luxury">💎 Luxury</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="traveler" style={labelStyle}>Traveler</label>
                    <select id="traveler" value={travelerType} onChange={(e) => setTravelerType(e.target.value)} style={inputStyle}>
                      <option value="solo">🧑 Solo</option>
                      <option value="couple">👫 Couple</option>
                      <option value="family">👨‍👩‍👧 Family</option>
                      <option value="group">👥 Group</option>
                    </select>
                  </div>
                </div>

                {/* Preferences Chips */}
                <div>
                  <label style={labelStyle}>Interests</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="group" aria-label="Travel interests">
                    {PREFERENCE_OPTIONS.map((pref) => (
                      <button key={pref.id} type="button" onClick={() => togglePref(pref.value)}
                        aria-pressed={selectedPrefs.includes(pref.value)}
                        style={{
                          padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem',
                          border: selectedPrefs.includes(pref.value) ? '1px solid var(--accent-google-blue)' : '1px solid rgba(255,255,255,0.15)',
                          background: selectedPrefs.includes(pref.value) ? 'rgba(66,133,244,0.2)' : 'rgba(255,255,255,0.05)',
                          color: selectedPrefs.includes(pref.value) ? '#8ab4f8' : '#aaa',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <label htmlFor="maxWalking" style={labelStyle}>Max daily walking: {maxWalking} km</label>
                  <input id="maxWalking" type="range" min="1" max="30" value={maxWalking}
                    onChange={(e) => setMaxWalking(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-google-blue)' }}
                    aria-valuemin={1} aria-valuemax={30} aria-valuenow={maxWalking} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input id="accessibility" type="checkbox" checked={accessibility}
                    onChange={(e) => setAccessibility(e.target.checked)}
                    style={{ accentColor: 'var(--accent-google-green)' }} />
                  <label htmlFor="accessibility" style={{ ...labelStyle, margin: 0 }}>♿ Accessibility needed</label>
                </div>

                <div>
                  <label htmlFor="dietary" style={labelStyle}>Dietary restrictions</label>
                  <input id="dietary" type="text" placeholder="e.g., vegetarian, halal" value={dietary}
                    onChange={(e) => setDietary(e.target.value)} style={inputStyle} />
                </div>

                <button type="button" onClick={handleGenerate} disabled={loading}
                  aria-busy={loading}
                  style={{
                    background: loading ? '#555' : 'var(--primary-gradient)',
                    color: 'white', border: 'none', padding: '0.9rem',
                    borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
                    cursor: loading ? 'wait' : 'pointer', marginTop: '0.5rem',
                    transition: 'all 0.3s', fontFamily: 'inherit',
                  }}>
                  {loading ? '⏳ Generating...' : '✨ Generate Itinerary'}
                </button>
              </form>
            </div>
          </aside>

          {/* Results Area */}
          <section id="itinerary-results" aria-live="polite" aria-label="Itinerary results">
            {error && (
              <div role="alert" style={{
                background: 'rgba(234,67,53,0.15)', border: '1px solid rgba(234,67,53,0.3)',
                padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#ff6b6b',
              }}>
                ⚠️ {error}
              </div>
            )}

            {loading && (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🌍</div>
                <h3 style={{ color: '#ccc' }}>Planning your perfect trip...</h3>
                <p style={{ color: '#888' }}>Analyzing weather, finding activities, crafting your itinerary</p>
              </div>
            )}

            {!itinerary && !loading && (
              <div className="glass-panel" style={{ height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🗺️</div>
                <h3 style={{ color: '#888' }}>Your Itinerary Awaits</h3>
                <p style={{ color: '#666', textAlign: 'center', maxWidth: '300px' }}>
                  Fill out the trip details and click "Generate" to see your AI-powered plan.
                </p>
              </div>
            )}

            {itinerary && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Summary */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    📍 {itinerary.destination || destination}
                  </h2>
                  <p style={{ color: '#bbb', margin: '0 0 0.75rem 0' }}>{itinerary.summary}</p>
                  {itinerary.weather_overview && (
                    <p style={{ color: '#8ab4f8', fontSize: '0.9rem', margin: 0 }}>🌤️ {itinerary.weather_overview}</p>
                  )}
                  {itinerary.total_estimated_cost_usd && (
                    <p style={{ color: '#34A853', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: 600 }}>
                      💰 Estimated total: ${itinerary.total_estimated_cost_usd}
                    </p>
                  )}
                </div>

                {/* Day Cards */}
                {(itinerary.itinerary || []).map((day) => (
                  <div key={day.day} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: '#8ab4f8' }}>
                        Day {day.day} — {day.theme}
                      </h3>
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>{day.date}</span>
                    </div>
                    {day.weather_note && (
                      <p style={{ color: '#FBBC05', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                        🌤️ {day.weather_note}
                      </p>
                    )}

                    {/* Activities */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(day.activities || []).map((act, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: '1rem', padding: '0.75rem',
                          background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ minWidth: '50px', color: '#8ab4f8', fontWeight: 600, fontSize: '0.85rem' }}>
                            {act.time}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                              {act.name}
                              {act.indoor && <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: '#aaa' }}>🏠 Indoor</span>}
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>{act.description}</div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: '#888' }}>
                              <span>⏱️ {act.duration_hours}h</span>
                              <span>💵 ${act.estimated_cost_usd}</span>
                              <span style={{
                                background: 'rgba(66,133,244,0.15)', padding: '1px 8px',
                                borderRadius: '10px', color: '#8ab4f8',
                              }}>{act.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meals */}
                    {day.meals && day.meals.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>🍽️ Meals</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {day.meals.map((meal, i) => (
                            <span key={i} style={{
                              padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem',
                              background: 'rgba(255,255,255,0.05)', color: '#ccc',
                            }}>
                              {meal.meal_type}: {meal.suggestion} (${meal.estimated_cost_usd})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {day.daily_budget_estimate_usd > 0 && (
                      <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: '#34A853' }}>
                        Day budget: ${day.daily_budget_estimate_usd}
                      </div>
                    )}
                  </div>
                ))}

                {/* Tips */}
                {(itinerary.packing_tips?.length > 0 || itinerary.local_tips?.length > 0) && (
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {itinerary.packing_tips?.length > 0 && (
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#FBBC05' }}>🎒 Packing Tips</h4>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#bbb', fontSize: '0.9rem' }}>
                            {itinerary.packing_tips.map((tip, i) => <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>)}
                          </ul>
                        </div>
                      )}
                      {itinerary.local_tips?.length > 0 && (
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#34A853' }}>📌 Local Tips</h4>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#bbb', fontSize: '0.9rem' }}>
                            {itinerary.local_tips.map((tip, i) => <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Re-plan Section */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.75rem 0', color: '#EA4335' }}>🔄 Real-Time Re-Plan</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
                    Simulate a disruption and see how the AI adapts your itinerary in real-time.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="group" aria-label="Disruption scenarios">
                    {DISRUPTION_OPTIONS.map((d, i) => (
                      <button key={i} type="button" onClick={() => handleReplan(d)}
                        disabled={replanLoading}
                        style={{
                          padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem',
                          border: '1px solid rgba(234,67,53,0.3)',
                          background: 'rgba(234,67,53,0.1)', color: '#ff8a80',
                          cursor: replanLoading ? 'wait' : 'pointer', transition: 'all 0.2s',
                          fontFamily: 'inherit',
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                  {replanLoading && <p style={{ color: '#FBBC05', marginTop: '0.5rem' }}>🔄 Re-planning...</p>}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .skip-link:focus { left: 0 !important; }
        @media (max-width: 800px) {
          .glass-panel > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
