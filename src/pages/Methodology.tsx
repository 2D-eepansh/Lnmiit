import './Methodology.css';

export function Methodology() {
  return (
    <main className="methodology-page">
      <div className="page-content">
        <h1>Methodology</h1>
        <p className="intro-text">
          This page explains how the Ergo Stability Dashboard is built, what data it uses, and how observations are calculated.
        </p>

        <section className="methodology-section">
          <h2>Data Sources</h2>
          
          <div className="subsection">
            <h3>Ergo Explorer API</h3>
            <p>
              Block headers and network state are retrieved from the Ergo Explorer API, which indexes the Ergo blockchain.
              This includes:
            </p>
            <ul>
              <li>Block times and block heights</li>
              <li>Difficulty adjustments</li>
              <li>Transaction counts</li>
              <li>Network difficulty and hashrate estimates</li>
            </ul>
            <p className="note">
              <strong>Limitation:</strong> Explorer data reflects indexer state, not real-time consensus. Observations lag blockchain
              finality by 1–2 blocks.
            </p>
          </div>

          <div className="subsection">
            <h3>Price Data Feed</h3>
            <p>
              ERG/USD pricing and volatility data is sourced from public market data aggregators (e.g., CoinGecko).
            </p>
            <ul>
              <li>Current price (spot)</li>
              <li>24h volume and market cap</li>
              <li>7d price history for volatility calculation</li>
            </ul>
            <p className="note">
              <strong>Limitation:</strong> Price feeds reflect exchange-aggregated data, not on-chain price discovery.
            </p>
          </div>
        </section>

        <section className="methodology-section">
          <h2>Time Windows</h2>

          <div className="subsection">
            <h3>Block-Time Sampling</h3>
            <p>
              Block times are analyzed over a rolling window, typically the last 100–200 blocks
              (approximately 4–8 hours at target 120s per block).
            </p>
            <p>
              This window is chosen to:
            </p>
            <ul>
              <li>Detect short-term deviations (fast/slow periods)</li>
              <li>Filter noise from single outliers</li>
              <li>Avoid over-sensitivity to normal variance</li>
            </ul>
          </div>

          <div className="subsection">
            <h3>Observed Availability</h3>
            <p>
              A rolling 24h window is used to calculate block production consistency.
              The metric reflects the percentage of expected blocks observed, relative to the target 120s interval.
            </p>
            <p className="note">
              <strong>This is NOT a Service Level Agreement.</strong>
              It is an observation of recent behavior, not a guarantee of future performance.
            </p>
          </div>

          <div className="subsection">
            <h3>Price Volatility</h3>
            <p>
              7-day rolling volatility is calculated using annualized standard deviation of daily returns.
            </p>
            <p className="note">
              <strong>Context:</strong> Crypto volatility typically ranges 60–120% annualized. Ergo's range depends on market conditions
              and liquidity.
            </p>
          </div>
        </section>

        <section className="methodology-section">
          <h2>Anomaly Detection Logic</h2>

          <p>
            An anomaly is flagged when block-time deviation exceeds 1.5–2.0 standard deviations from the rolling median.
          </p>

          <div className="subsection">
            <h3>Classification</h3>
            <ul>
              <li><strong>Fast Block:</strong> Block time is significantly below the 120s target</li>
              <li><strong>Slow Block:</strong> Block time is significantly above the 120s target</li>
              <li><strong>Elevated Variance:</strong> Multiple anomalies in the window</li>
            </ul>
            <p className="note">
              <strong>Important:</strong> Anomalies are contextual observations, NOT failures or errors.
              They indicate deviation from recent norms, not protocol malfunction.
            </p>
          </div>
        </section>

        <section className="methodology-section">
          <h2>Stability Score Construction</h2>

          <p>
            The overall stability score (0–100) is a weighted combination of three factors:
          </p>

          <table className="methodology-table">
            <tbody>
              <tr>
                <td><strong>Block Time Consistency</strong></td>
                <td>50%</td>
                <td>Measures variance in block production times. Lower variance = higher score.</td>
              </tr>
              <tr>
                <td><strong>Difficulty Stability</strong></td>
                <td>30%</td>
                <td>Measures consistency of difficulty adjustments. Stable adjustments = higher score.</td>
              </tr>
              <tr>
                <td><strong>Network Activity</strong></td>
                <td>20%</td>
                <td>Measures transaction throughput and miner participation. Higher activity = higher score.</td>
              </tr>
            </tbody>
          </table>

          <p className="note">
            <strong>Weights are heuristic:</strong> They reflect observed historical relevance, not regulatory requirements or optimal control.
            Weights may be adjusted as network dynamics evolve.
          </p>

          <div className="subsection">
            <h3>Score Interpretation</h3>
            <ul>
              <li><strong>70–100 (Stable):</strong> Indicators align with recent historical norms</li>
              <li><strong>40–69 (Caution):</strong> Elevated variability present; monitor underlying metrics</li>
              <li><strong>&lt;40 (Volatile):</strong> Significant fluctuations; investigate context before drawing conclusions</li>
            </ul>
          </div>
        </section>

        <section className="methodology-section">
          <h2>Explicit Non-Goals</h2>

          <p>This dashboard does NOT:</p>
          <ul>
            <li>Predict future block times or price movements</li>
            <li>Guarantee network performance or uptime</li>
            <li>Measure transaction finality or security</li>
            <li>Assess protocol correctness or attack resistance</li>
            <li>Provide trading signals or investment advice</li>
            <li>Monitor wallet security or exchange solvency</li>
          </ul>

          <p className="note">
            For authoritative information on Ergo protocol security and correctness, see the
            <a href="https://ergoplatform.org" target="_blank" rel="noreferrer"> official Ergo documentation</a>.
          </p>
        </section>

        <section className="methodology-section info-box">
          <h3>Summary</h3>
          <p>
            This dashboard combines public data sources with statistical analysis to provide a transparent, observational view
            of Ergo network behavior and ERG market conditions. All metrics are bounded by their data sources and analytical assumptions.
            Users are encouraged to cross-reference this data with independent sources and draw their own conclusions.
          </p>
        </section>
      </div>
    </main>
  );
}
