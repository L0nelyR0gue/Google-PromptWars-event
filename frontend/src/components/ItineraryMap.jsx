import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * ItineraryMap — Renders a Google Map with markers for the active day's
 * activities and meals. Uses vanilla Google Maps JS API (no mapId required).
 * Automatically fits bounds to show all pins.
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

// Color palette
const ACTIVITY_COLOR = '#4A90E2';
const MEAL_COLOR = '#FFD166';

/**
 * Load the Google Maps JS API script exactly once.
 * Returns a promise that resolves when `window.google.maps` is ready.
 */
let _loadPromise = null;
function loadGoogleMaps(apiKey) {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });

  return _loadPromise;
}

export default function ItineraryMap({ day, mapsApiKey }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Build markers array from day activities + meals
  const markerData = useMemo(() => {
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

  // Load Google Maps script
  useEffect(() => {
    if (!mapsApiKey) return;
    loadGoogleMaps(mapsApiKey)
      .then(() => setMapReady(true))
      .catch(() => setLoadError(true));
  }, [mapsApiKey]);

  // Initialize map once script is loaded
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;
    if (mapRef.current) return; // Already initialized

    const defaultCenter = markerData.length > 0
      ? { lat: markerData[0].lat, lng: markerData[0].lng }
      : { lat: 35.6762, lng: 139.6503 };

    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      gestureHandling: 'cooperative',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();
  }, [markerData, mapReady]);

  // Update markers whenever markerData changes
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (markerData.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = infoWindowRef.current;

    markerData.forEach((item) => {
      const isActivity = item.type === 'activity';
      const emoji = isActivity
        ? CATEGORY_EMOJI[item.category] || CATEGORY_EMOJI.default
        : MEAL_EMOJI[item.mealType] || MEAL_EMOJI.default;

      const marker = new window.google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapRef.current,
        title: item.name,
        label: {
          text: emoji,
          fontSize: '18px',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: isActivity ? ACTIVITY_COLOR : MEAL_COLOR,
          fillOpacity: 1,
          strokeColor: '#1a1a1a',
          strokeWeight: 2.5,
          scale: 18,
        },
      });

      // Build info window content
      let content = `
        <div style="font-family: 'Nunito', Arial, sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-family: 'Caveat', cursive, sans-serif; font-size: 1.3rem; font-weight: bold; margin-bottom: 4px; color: #1a1a1a;">
            ${emoji} ${item.name}
          </div>
      `;
      if (item.time) {
        content += `<div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">🕐 ${item.time}</div>`;
      }
      if (item.description) {
        content += `<div style="font-size: 0.85rem; color: #333; margin-bottom: 4px;">${item.description}</div>`;
      }
      const details = [];
      if (item.cost != null) details.push(`💵 $${item.cost}`);
      if (item.duration) details.push(`⏱️ ${item.duration}h`);
      if (details.length > 0) {
        content += `<div style="display: flex; gap: 8px; font-size: 0.85rem; font-weight: bold;">${details.join(' ')}</div>`;
      }
      if (item.location) {
        content += `<div style="font-size: 0.75rem; color: #888; margin-top: 4px;">📍 ${item.location}</div>`;
      }
      content += '</div>';

      marker.addListener('click', () => {
        infoWindow.setContent(content);
        infoWindow.open(mapRef.current, marker);
      });

      bounds.extend({ lat: item.lat, lng: item.lng });
      markersRef.current.push(marker);
    });

    // Fit bounds
    mapRef.current.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });

    // Don't zoom in too much for single marker
    const listener = mapRef.current.addListener('idle', () => {
      if (mapRef.current.getZoom() > 16) mapRef.current.setZoom(16);
      window.google.maps.event.removeListener(listener);
    });
  }, [markerData, mapReady]);

  // --- Render states ---

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

  if (loadError) {
    return (
      <div
        className="comic-box"
        style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--paper-white)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
        <p className="cartoon-font" style={{ color: 'var(--marker-red)', fontSize: '1.3rem' }}>
          Failed to load Google Maps. Check the API key and try refreshing.
        </p>
      </div>
    );
  }

  if (markerData.length === 0) {
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

      <div
        ref={mapContainerRef}
        style={{ height: '380px', width: '100%', position: 'relative' }}
        aria-label={`Map showing Day ${day.day} activities and meals`}
        role="application"
      >
        {!mapReady && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', fontFamily: "'Nunito', sans-serif", color: 'var(--text-secondary)',
          }}>
            Loading map...
          </div>
        )}
      </div>
    </div>
  );
}
