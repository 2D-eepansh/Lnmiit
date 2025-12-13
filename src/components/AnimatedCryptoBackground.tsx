import React, { useState, useEffect } from 'react';
import './AnimatedCryptoBackground.css';

export const AnimatedCryptoBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animated-crypto-bg">
      {/* Bitcoin coins - proper icon, multiple positions */}
      <div className="crypto-coin btc-coin coin-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <svg viewBox="0 0 100 100" width="50" height="50">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 35 50 Q 50 35 65 50 Q 50 65 35 50" fill="currentColor" opacity="0.3" />
          <text x="50" y="58" textAnchor="middle" fontSize="32" fontWeight="bold" fill="currentColor">₿</text>
        </svg>
      </div>

      <div className="crypto-coin btc-coin coin-2" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
        <svg viewBox="0 0 100 100" width="45" height="45">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="50" y="56" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">₿</text>
        </svg>
      </div>

      <div className="crypto-coin btc-coin coin-3" style={{ transform: `translateY(${scrollY * 0.35}px)` }}>
        <svg viewBox="0 0 100 100" width="55" height="55">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="57" textAnchor="middle" fontSize="34" fontWeight="bold" fill="currentColor">₿</text>
        </svg>
      </div>

      {/* Ethereum coins - proper icon, multiple positions */}
      <div className="crypto-coin eth-coin coin-4" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <svg viewBox="0 0 100 100" width="50" height="50">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,28 35,50 50,60 65,50" fill="currentColor" opacity="0.4" />
          <polyline points="35,50 50,60 65,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="crypto-coin eth-coin coin-5" style={{ transform: `translateY(${scrollY * 0.32}px)` }}>
        <svg viewBox="0 0 100 100" width="48" height="48">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="50,30 38,50 50,58 62,50" fill="currentColor" opacity="0.3" />
          <polyline points="38,50 50,58 62,50" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="crypto-coin eth-coin coin-6" style={{ transform: `translateY(${scrollY * 0.38}px)` }}>
        <svg viewBox="0 0 100 100" width="52" height="52">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,27 35,49 50,62 65,49" fill="currentColor" opacity="0.35" />
          <polyline points="35,49 50,62 65,49" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ERG coins - proper icon, multiple positions */}
      <div className="crypto-coin erg-coin coin-7" style={{ transform: `translateY(${scrollY * 0.28}px)` }}>
        <svg viewBox="0 0 100 100" width="48" height="48">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M 50 30 L 65 50 L 50 70 L 35 50 Z" fill="currentColor" opacity="0.3" />
          <path d="M 50 30 L 65 50 L 50 70 L 35 50 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="crypto-coin erg-coin coin-8" style={{ transform: `translateY(${scrollY * 0.33}px)` }}>
        <svg viewBox="0 0 100 100" width="52" height="52">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 50 28 L 68 50 L 50 72 L 32 50 Z" fill="currentColor" opacity="0.35" />
          <path d="M 50 28 L 68 50 L 50 72 L 32 50 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>

      {/* Futuristic grid overlay */}
      <div className="futuristic-grid"></div>
      
      {/* Neon glow layer */}
      <div className="neon-glow-layer"></div>
    </div>
  );
};
