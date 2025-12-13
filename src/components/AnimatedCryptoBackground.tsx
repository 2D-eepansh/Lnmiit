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
      {/* Bitcoin coin */}
      <div
        className="crypto-coin btc-coin"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <svg viewBox="0 0 100 100" width="80" height="80">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="40"
            fontWeight="bold"
            fill="currentColor"
          >
            ₿
          </text>
        </svg>
      </div>

      {/* Ethereum coin */}
      <div
        className="crypto-coin eth-coin"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <svg viewBox="0 0 100 100" width="70" height="70">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,20 30,50 50,65 70,50" fill="none" stroke="currentColor" strokeWidth="2" />
          <polyline points="30,50 50,65 70,50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* ERG coin */}
      <div
        className="crypto-coin erg-coin"
        style={{ transform: `translateY(${scrollY * 0.35}px)` }}
      >
        <svg viewBox="0 0 100 100" width="75" height="75">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 50 20 Q 65 50 50 80 Q 35 50 50 20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Rustic texture overlay */}
      <div className="rustic-texture-overlay"></div>
    </div>
  );
};
