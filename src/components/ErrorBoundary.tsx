/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
        }}>
          <AlertTriangle size={64} color="#FF5722" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#999', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
            The dashboard encountered an unexpected error. This could be due to a temporary issue with data loading or processing.
          </p>
          
          {this.state.error && (
            <details style={{
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              marginBottom: '1rem',
              maxWidth: '800px',
              width: '100%',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Error Details
              </summary>
              <pre style={{
                fontSize: '0.875rem',
                overflow: 'auto',
                color: '#FF5722',
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#000',
              backgroundColor: '#FF5722',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Reload Dashboard
          </button>
          
          <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.875rem' }}>
            If this problem persists, please check your internet connection or try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
