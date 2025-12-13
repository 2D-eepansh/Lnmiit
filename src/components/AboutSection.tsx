import './AboutSection.css';
import { Shield, Info, Activity } from 'lucide-react';

export function AboutSection({ onOpenKYA }: { onOpenKYA: () => void }) {
  return (
    <section className="info-card" id="about-section">
      <div className="info-card-header">
        <Info size={22} className="info-icon" />
        <div>
          <h3>What This Dashboard Is</h3>
          <p className="info-subtitle">A transparent, read-only view into Ergo network stability and ERG price signals.</p>
        </div>
      </div>

      <ul className="info-list">
        <li><Shield size={16} /> Read-only: no wallets, no transactions, no private data.</li>
        <li><Activity size={16} /> Live metrics: network health, block time consistency, tx activity, price/volatility.</li>
        <li><Info size={16} /> KYA-first: clear limitations, data sources, and assumptions.</li>
      </ul>

      <div className="info-actions">
        <button className="primary-pill" onClick={onOpenKYA}>View KYA Statement</button>
        <a className="ghost-link" href="https://explorer.ergoplatform.com" target="_blank" rel="noreferrer">Open Ergo Explorer ↗</a>
      </div>
    </section>
  );
}
