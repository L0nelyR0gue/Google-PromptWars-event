import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';

/**
 * ItineraryMap — Renders a Google Map with markers for the active day's
 * activities and meals. Automatically fits bounds to show all pins.
 */

// Category → emoji mapping for marker labels
const CATEGORY_EMOJI = {
  temple: '⛩️',
  museum: '🏛️',
  food: '🍜',
  nature: '🌿',
  shopping: '🛍️',
  entertainment: '🎭',
  landmark: '🏰',
  default: '📍',
};

const MEAL_EMOJI = {
  breakfast: '🥐',
  lunch: '🍱',
  dinner: '🍽️',
  default: '🍴',
};

// Color palette for markers
const ACTIVITY_COLOR = '#4A90E2';
const MEAL_COLOR = '#FFD166';

// Auto-fit bounds when markers change
function MapBoundsController({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((m) => {
      if (m.lat && m.lng) {
        bounds.extend({ lat: m.lat, lng: m.lng });
      }
    });

    // Add some padding
    map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });

    // Don't zoom in too much for a single marker
    const listener = map.addListener('idle', () => {
      if (map.getZoom() > 16) map.setZoom(16);
      window.google.maps.event.removeListener(listener);
    });
  }, [map, markers]);

  return null;
}

function MarkerWithInfo({ marker, isActive, onSelect, onDeselect }) {
  const isActivity = marker.type === 'activity';
  const emoji = isActivity
    ? CATEGORY_EMOJI[marker.category] || CATEGORY_EMOJI.default
    : MEAL_EMOJI[marker.mealType] || MEAL_EMOJI.default;

  return (
    <>
      <AdvancedMarker
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => onSelect(marker.id)}
        title={marker.name}
      >
        <div
          style={{
            background: isActivity ? ACTIVITY_COLOR : MEAL_COLOR,
            color: isActivity ? '#fff' : '#1a1a1a',
            border: '3px solid #1a1a1a',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '3px 3px 0px #1a1a1a',
            cursor: 'pointer',
            transition: 'transform 0.15s',
            transform: isActive ? 'scale(1.3)' : 'scale(1)',
          }}
        >
          {emoji}
        </div>
      </AdvancedMarker>

      {isActive && (
        <InfoWindow
          position={{ lat: marker.lat, lng: marker.lng }}
          onCloseClick={() => onDeselect()}
          pixelOffset={[0, -45]}
        >
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              padding: '4px',
              maxWidth: '220px',
            }}
          >
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '4px',
                color: '#1a1a1a',
              }}
            >
              {emoji} {marker.name}
            </div>
            {marker.time && (
              <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '2px' }}>
                🕐 {marker.time}
              </div>
            )}
            {marker.description && (
              <div style={{ fontSize: '0.85rem', color: '#333', marginBottom: '4px' }}>
                {marker.description}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {marker.cost != null && <span>💵 ${marker.cost}</span>}
              {marker.duration && <span>⏱️ {marker.duration}h</span>}
            </div>
            {marker.location && (
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                📍 {marker.location}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function ItineraryMap({ day, mapsApiKey, destination }) {
  const [activeMarkerId, setActiveMarkerId] = useState(null);

  // Build markers array from day activities + meals
  const markers = useMemo(() => {
    if (!day) return [];
    const result = [];

    // Activities
    (day.activities || []).forEach((act, i) => {
      if (act.latitude && act.longitude) {
        result.push({
          id: `act-${i}`,
          type: 'activity',
          name: act.name,
          lat: act.latitude,
          lng: act.longitude,
          location: act.location,
          time: act.time,
          description: act.description,
          category: act.category,
          cost: act.estimated_cost_usd,
          duration: act.duration_hours,
        });
      }
    });

    // Meals
    (day.meals || []).forEach((meal, i) => {
      if (meal.latitude && meal.longitude) {
        result.push({
          id: `meal-${i}`,
          type: 'meal',
          name: meal.suggestion,
          lat: meal.latitude,
          lng: meal.longitude,
          location: meal.location,
          mealType: meal.meal_type,
          cost: meal.estimated_cost_usd,
        });
      }
    });

    return result;
  }, [day]);

  // Reset active marker when day changes
  useEffect(() => {
    setActiveMarkerId(null);
  }, [day]);

  if (!mapsApiKey) {
    return (
      <div
        className="comic-box"
        style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--paper-white)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
        <p className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>
          Map unavailable — no API key configured
        </p>
      </div>
    );
  }

  if (markers.length === 0) {
    return (
      <div
        className="comic-box"
        style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--paper-white)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
        <p className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>
          No location data for this day's activities
        </p>
      </div>
    );
  }

  const defaultCenter = markers.length > 0
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : { lat: 35.6762, lng: 139.6503 };

  return (
    <div
      className="comic-box"
      style={{
        padding: '0',
        overflow: 'hidden',
        background: 'var(--paper-white)',
      }}
    >
      <div
        style={{
          padding: '1rem 1.5rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🗺️</span>
        <h3
          className="cartoon-font"
          style={{
            margin: 0,
            fontSize: '1.6rem',
            color: 'var(--ink-black)',
          }}
        >
          Day {day.day} — Map View
        </h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 'bold',
              color: '#fff',
              background: ACTIVITY_COLOR,
              padding: '2px 10px',
              borderRadius: '8px',
              border: '2px solid var(--ink-black)',
            }}
          >
            📍 Activities
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 'bold',
              color: '#1a1a1a',
              background: MEAL_COLOR,
              padding: '2px 10px',
              borderRadius: '8px',
              border: '2px solid var(--ink-black)',
            }}
          >
            🍴 Meals
          </span>
        </div>
      </div>

      <div style={{ height: '380px', width: '100%', position: 'relative' }}>
        <APIProvider apiKey={mapsApiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            gestureHandling="cooperative"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MapBoundsController markers={markers} />
            {markers.map((marker) => (
              <MarkerWithInfo
                key={marker.id}
                marker={marker}
                isActive={activeMarkerId === marker.id}
                onSelect={setActiveMarkerId}
                onDeselect={() => setActiveMarkerId(null)}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
