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
      {/* Bitcoin coin 1 - Top left corner (empty space) */}
      <div className="crypto-coin btc-coin coin-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <svg viewBox="0 0 100 100" width="120" height="120">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00ff88" strokeWidth="2" />
          <text x="50" y="62" textAnchor="middle" fontSize="70" fontWeight="bold" fill="#00ff88">₿</text>
        </svg>
      </div>

      {/* Bitcoin coin 2 - Top right (away from header) */}
      <div className="crypto-coin btc-coin coin-2" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00ff88" strokeWidth="2" />
          <text x="50" y="62" textAnchor="middle" fontSize="60" fontWeight="bold" fill="#00ff88">₿</text>
        </svg>
      </div>

      {/* Bitcoin coin 3 - Bottom left (footer area) */}
      <div className="crypto-coin btc-coin coin-3" style={{ transform: `translateY(${scrollY * 0.35}px)` }}>
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00ff88" strokeWidth="2" />
          <text x="50" y="62" textAnchor="middle" fontSize="65" fontWeight="bold" fill="#00ff88">₿</text>
        </svg>
      </div>

      {/* Ethereum coin 1 - Top right area (empty space above charts) */}
      <div className="crypto-coin eth-coin coin-4" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <svg viewBox="0 0 100 100" width="115" height="115">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="2" />
          <polygon points="50,20 32,48 50,62 68,48" fill="#ffffff" opacity="0.5" />
          <polyline points="32,48 50,62 68,48" fill="none" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Ethereum coin 2 - Middle right side (away from sliders) */}
      <div className="crypto-coin eth-coin coin-5" style={{ transform: `translateY(${scrollY * 0.32}px)` }}>
        <svg viewBox="0 0 100 100" width="105" height="105">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="2" />
          <polygon points="50,22 35,48 50,60 65,48" fill="#ffffff" opacity="0.4" />
          <polyline points="35,48 50,60 65,48" fill="none" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Ethereum coin 3 - Bottom right corner */}
      <div className="crypto-coin eth-coin coin-6" style={{ transform: `translateY(${scrollY * 0.38}px)` }}>
        <svg viewBox="0 0 100 100" width="125" height="125">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="2" />
          <polygon points="50,18 30,50 50,65 70,50" fill="#ffffff" opacity="0.45" />
          <polyline points="30,50 50,65 70,50" fill="none" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* ERG coin 1 - Left middle (between top and bottom, away from UI) */}
      <div className="crypto-coin erg-coin coin-7" style={{ transform: `translateY(${scrollY * 0.28}px)` }}>
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00ff88" strokeWidth="2" />
          <path d="M 50 25 L 68 50 L 50 75 L 32 50 Z" fill="#00ff88" opacity="0.4" />
          <path d="M 50 25 L 68 50 L 50 75 L 32 50 Z" fill="none" stroke="#00ff88" strokeWidth="2" />
        </svg>
      </div>

      {/* ERG coin 2 - Right middle area */}
      <div className="crypto-coin erg-coin coin-8" style={{ transform: `translateY(${scrollY * 0.33}px)` }}>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00ff88" strokeWidth="2" />
          <path d="M 50 28 L 66 50 L 50 72 L 34 50 Z" fill="#00ff88" opacity="0.35" />
          <path d="M 50 28 L 66 50 L 50 72 L 34 50 Z" fill="none" stroke="#00ff88" strokeWidth="2" />
        </svg>
      </div>

      {/* Futuristic grid overlay */}
      <div className="futuristic-grid"></div>
      
      {/* Neon glow layer */}
      <div className="neon-glow-layer"></div>
    </div>
  );
};
