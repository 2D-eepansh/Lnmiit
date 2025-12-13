/**
 * KYA (Know Your Assumptions) Modal
 * Transparency and education layer
 */


import { X, BookOpen, Database, AlertTriangle, Shield, Info } from 'lucide-react';
import './KYAModal.css';

interface KYAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KYAModal({ isOpen, onClose }: KYAModalProps) {
  if (!isOpen) return null;

  return (
    <div className="kya-modal-overlay" onClick={onClose}>
      <div className="kya-modal" onClick={(e) => e.stopPropagation()}>
        <button className="kya-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="kya-header">
          <BookOpen size={48} className="kya-header-icon" />
          <h1>Know Your Assumptions</h1>
          <p className="kya-subtitle">
            Transparency is a core principle of Ergo. Here's everything you need to know about this dashboard.
          </p>
        </div>

        <div className="kya-content">
          <section className="kya-section">
            <div className="kya-section-header">
              <Info className="section-icon" />
              <h2>What This Dashboard Does</h2>
            </div>
            <p>
              The Ergo Stability & Risk Dashboard provides <strong>read-only analytics</strong> of the Ergo blockchain
              and ERG token. It monitors network health, block production consistency, and price volatility to help users
              understand current network conditions.
            </p>
            <ul>
              <li>✓ No wallet connections required</li>
              <li>✓ No write operations to blockchain</li>
              <li>✓ No predictions or financial advice</li>
              <li>✓ Educational and informational only</li>
            </ul>
          </section>

          <section className="kya-section">
            <div className="kya-section-header">
              <Database className="section-icon" />
              <h2>Data Sources</h2>
            </div>
            <p>All data is fetched from public APIs:</p>
            <ul>
              <li>
                <strong>Ergo Explorer API</strong> (<code>api.ergoplatform.com</code>) - 
                Blockchain data including blocks, transactions, and network state
              </li>
              <li>
                <strong>CoinGecko API</strong> - ERG price data, market cap, and trading volume
              </li>
            </ul>
            <p className="kya-note">
              ⚠ Data is cached for 1-2 minutes to reduce API load. The dashboard refreshes automatically every 2 minutes.
            </p>
          </section>

          <section className="kya-section">
            <div className="kya-section-header">
              <AlertTriangle className="section-icon" />
              <h2>Limitations & Assumptions</h2>
            </div>
            <ul>
              <li>
                <strong>API Dependency:</strong> If external APIs are unavailable, the dashboard falls back to mock data
                (clearly indicated when active).
              </li>
              <li>
                <strong>Historical Data:</strong> Analysis is based on the last 100 blocks (~3.3 hours of data). Longer-term
                trends are not captured.
              </li>
              <li>
                <strong>Price ≠ Stability:</strong> Price volatility is separate from network stability. A volatile price
                doesn't mean the blockchain is unstable.
              </li>
              <li>
                <strong>Thresholds Are Subjective:</strong> "Stable" vs "Volatile" classifications use predefined thresholds
                based on crypto market norms, not absolute metrics.
              </li>
              <li>
                <strong>No Real-Time Data:</strong> Blockchain state has ~2 minute latency (Ergo's block time) plus API caching.
              </li>
            </ul>
          </section>

          <section className="kya-section">
            <div className="kya-section-header">
              <Shield className="section-icon" />
              <h2>Methodology: Stability Scoring</h2>
            </div>
            <p>The overall stability score (0-100) is calculated using:</p>
            
            <div className="methodology-item">
              <h3>Block Time Consistency (50% weight)</h3>
              <p>
                Measures variance in time between blocks. Ergo targets 2-minute blocks. We calculate the coefficient of
                variation (CV = standard deviation / mean). Lower CV = more stable.
              </p>
              <ul>
                <li>CV &lt; 0.15 → Score: 70-100 (Stable)</li>
                <li>CV 0.15-0.35 → Score: 40-69 (Caution)</li>
                <li>CV &gt; 0.35 → Score: 0-39 (Volatile)</li>
              </ul>
            </div>

            <div className="methodology-item">
              <h3>Difficulty Stability (30% weight)</h3>
              <p>
                Tracks difficulty adjustment consistency. Large swings indicate miner hashrate fluctuations.
              </p>
              <ul>
                <li>Change &lt; 10% → Score: 70-100 (Stable)</li>
                <li>Change 10-30% → Score: 40-69 (Caution)</li>
                <li>Change &gt; 30% → Score: 0-39 (Volatile)</li>
              </ul>
            </div>

            <div className="methodology-item">
              <h3>Network Activity (20% weight)</h3>
              <p>
                Transaction throughput. Higher activity indicates a healthy, active ecosystem.
              </p>
              <ul>
                <li>&gt; 10 tx/min → Score: 90-100 (High Activity)</li>
                <li>5-10 tx/min → Score: 60-89 (Moderate)</li>
                <li>&lt; 5 tx/min → Score: 0-59 (Low)</li>
              </ul>
            </div>
          </section>

          <section className="kya-section">
            <div className="kya-section-header">
              <Shield className="section-icon" />
              <h2>Price Volatility</h2>
            </div>
            <p>
              Price volatility is calculated using annualized standard deviation of 7-day returns. This is a standard
              financial metric adapted for crypto.
            </p>
            <ul>
              <li>&lt; 50% → Stable (low for crypto)</li>
              <li>50-100% → Caution (typical crypto volatility)</li>
              <li>&gt; 100% → Volatile (high even for crypto)</li>
            </ul>
            <p className="kya-note">
              For context: Bitcoin typically has 60-80% annualized volatility. Traditional stocks average 15-20%.
            </p>
          </section>

          <section className="kya-section kya-disclaimer">
            <div className="kya-section-header">
              <AlertTriangle className="section-icon" />
              <h2>Ethical Disclaimer</h2>
            </div>
            <p>
              <strong>This dashboard is NOT financial advice.</strong> It is an educational tool designed to help users
              understand Ergo's network health and market dynamics.
            </p>
            <ul>
              <li>❌ Do NOT make investment decisions based solely on this dashboard</li>
              <li>❌ Do NOT treat stability scores as guarantees of future performance</li>
              <li>❌ Do NOT assume high scores = safe investment</li>
              <li>✓ DO use this as ONE data point among many</li>
              <li>✓ DO your own research (DYOR)</li>
              <li>✓ DO consult financial professionals for investment advice</li>
            </ul>
          </section>
        </div>

        <div className="kya-footer">
          <p>
            Built with transparency and education in mind. Ergo ecosystem, December 2025.
          </p>
          <button className="kya-button" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
