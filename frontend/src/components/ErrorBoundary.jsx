/**
 * ErrorBoundary — catches JavaScript errors in the component tree
 * and displays a friendly fallback UI instead of a white screen.
 *
 * Wraps the entire app in App.jsx to ensure runtime errors
 * are caught and reported gracefully.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console — in production this would go to Cloud Logging
    console.error('[Travi! ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2rem',
            background: '#faf9f6',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <div style={{ fontSize: '5rem' }}>✈️💥</div>
          <h1
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '3rem',
              color: '#1a1a1a',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Something went sideways!
          </h1>
          <p style={{ color: '#555', maxWidth: '480px', textAlign: 'center', fontSize: '1.1rem' }}>
            An unexpected error occurred. Your saved trips are safe — try refreshing the page.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '2px solid #1a1a1a',
                background: '#4A90E2',
                color: 'white',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #1a1a1a',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '2px solid #1a1a1a',
                background: '#FFD166',
                color: '#1a1a1a',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #1a1a1a',
              }}
            >
              Reload Page
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#fff0f0',
                border: '1px solid #ffb3b3',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '100%',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#c0392b' }}>
                Error details (dev only)
              </summary>
              <pre style={{ fontSize: '0.8rem', overflowX: 'auto', marginTop: '0.5rem' }}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
