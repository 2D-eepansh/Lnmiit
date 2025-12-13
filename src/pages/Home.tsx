import { NetworkHealth } from '../components/NetworkHealth';
import { PriceStability } from '../components/PriceStability';
import { RiskSummary } from '../components/RiskSummary';
import { BlockTimeChart } from '../components/BlockTimeChart';
import { PriceChart } from '../components/PriceChart';
import { TxVolumeChart } from '../components/TxVolumeChart';
import { PhaseTwoInsights } from '../components/PhaseTwoInsights';
import { AboutSection } from '../components/AboutSection';
import { FAQ } from '../components/FAQ';
import './Home.css';

interface HomeProps {
  onOpenKYA: () => void;
}

export function Home({ onOpenKYA }: HomeProps) {
  return (
    <main className="home-page">
      <div className="page-header">
        <div className="page-intro">
          <h2>Network Overview</h2>
          <p>Current observations and recent trends in Ergo network activity and ERG market conditions.</p>
        </div>
      </div>

      {/* Top Row: Phase 2 Insights */}
      <section className="home-section full-width">
        <PhaseTwoInsights />
      </section>

      {/* Mid Row: Health & Price */}
      <section className="home-section grid-2">
        <div className="card-wrapper">
          <NetworkHealth />
        </div>
        <div className="card-wrapper">
          <PriceStability />
        </div>
      </section>

      {/* Stability Assessment */}
      <section className="home-section full-width">
        <RiskSummary />
      </section>

      {/* Charts */}
      <section className="home-section grid-3">
        <div className="card-wrapper">
          <BlockTimeChart />
        </div>
        <div className="card-wrapper">
          <PriceChart />
        </div>
        <div className="card-wrapper">
          <TxVolumeChart />
        </div>
      </section>

      {/* About & FAQ */}
      <section className="home-section grid-2">
        <div className="card-wrapper">
          <AboutSection onOpenKYA={onOpenKYA} />
        </div>
        <div className="card-wrapper">
          <FAQ />
        </div>
      </section>
    </main>
  );
}
