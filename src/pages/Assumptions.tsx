import './Assumptions.css';

export function Assumptions() {
  return (
    <main className="assumptions-page">
      <div className="page-content">
        <h1>Assumptions & Limitations</h1>
        <p className="intro-text">
          This dashboard is built on specific assumptions and has inherent limitations. Understanding these is critical for
          responsible interpretation.
        </p>

        <section className="assumptions-section">
          <h2>Data Assumptions</h2>

          <div className="subsection">
            <h3>Ergo Explorer API Represents Current State</h3>
            <p>
              This dashboard assumes that the Ergo Explorer API accurately reflects the current blockchain state. In reality:
            </p>
            <ul>
              <li>Indexers can lag the chain by 1–2 blocks</li>
              <li>Network forks (rare but possible) can cause temporary inconsistency</li>
              <li>Downtime or reindexing can introduce gaps in historical data</li>
            </ul>
            <p className="note">
              <strong>Impact:</strong> Observations are always slightly historical. Do not rely on this dashboard for
              sub-block-interval timing.
            </p>
          </div>

          <div className="subsection">
            <h3>Block Times Follow a Consistent Target</h3>
            <p>
              The dashboard assumes the Ergo network targets 120-second average block times. However:
            </p>
            <ul>
              <li>Difficulty adjustments may cause temporary deviations</li>
              <li>Network splits or consensus changes could alter the target</li>
              <li>Hashrate spikes or drops cause temporary variance, not necessarily instability</li>
            </ul>
            <p className="note">
              <strong>Risk:</strong> Anomalies flagged relative to 120s may be irrelevant if the effective target changes.
            </p>
          </div>

          <div className="subsection">
            <h3>Price Data is Exchange-Aggregated</h3>
            <p>
              ERG price comes from centralized exchange data feeds. Assumptions and limitations include:
            </p>
            <ul>
              <li>Prices reflect exchange markets, not on-chain token mechanics</li>
              <li>Low-liquidity pairs may show extreme volatility unrelated to protocol health</li>
              <li>Flash crashes, bot trading, or thin order books can distort short-term price</li>
            </ul>
            <p className="note">
              <strong>Critical:</strong> ERG price is NOT a measure of protocol quality or network stability.
            </p>
          </div>
        </section>

        <section className="assumptions-section">
          <h2>Statistical Limitations</h2>

          <div className="subsection">
            <h3>Anomaly Detection Has False Positives and False Negatives</h3>
            <p>
              The anomaly detection algorithm flags blocks that deviate &gt;1.5–2.0σ from the rolling median. This means:
            </p>
            <ul>
              <li><strong>False Positives:</strong> Normal variance may be incorrectly flagged as anomalies</li>
              <li><strong>False Negatives:</strong> Systematic deviations smaller than the threshold are missed</li>
              <li><strong>Context-Dependent:</strong> What is "anomalous" depends on the baseline window</li>
            </ul>
            <p className="note">
              <strong>Caution:</strong> Do not over-interpret individual anomaly flags. Always check the full context of the
              time window.
            </p>
          </div>

          <div className="subsection">
            <h3>Small Sample Sizes Reduce Confidence</h3>
            <p>
              If the recent observation window is short or blocks are very slow, the sample size for calculating variance is small.
              Small samples lead to:
            </p>
            <ul>
              <li>Higher uncertainty in baseline estimates</li>
              <li>More brittle anomaly thresholds</li>
              <li>Greater sensitivity to outliers</li>
            </ul>
            <p className="note">
              <strong>Implication:</strong> Stability scores and anomaly flags are less reliable during periods of low block production.
            </p>
          </div>

          <div className="subsection">
            <h3>Volatility Calculations Are Backward-Looking</h3>
            <p>
              The 7-day rolling volatility reflects past price variance, not future risk. This means:
            </p>
            <ul>
              <li>Recent calm does not imply future stability</li>
              <li>Volatility spikes can occur suddenly without warning</li>
              <li>Historical correlations are not guaranteed to persist</li>
            </ul>
          </div>
        </section>

        <section className="assumptions-section">
          <h2>Interpretation Risks</h2>

          <div className="subsection">
            <h3>Correlation ≠ Causation</h3>
            <p>
              This dashboard does NOT establish causal relationships. Examples of common misinterpretations:
            </p>
            <ul>
              <li>High block variance does NOT mean miners are leaving</li>
              <li>Price drop does NOT mean the network is failing</li>
              <li>Low transaction volume does NOT mean the network is dead</li>
              <li>High availability with volatility does NOT mean the protocol is inconsistent</li>
            </ul>
            <p className="note">
              <strong>Rule:</strong> Always investigate root causes independently before drawing conclusions.
            </p>
          </div>

          <div className="subsection">
            <h3>Confirmation Bias Risk</h3>
            <p>
              Users may unconsciously interpret dashboard data to confirm pre-existing beliefs about Ergo. For example:
            </p>
            <ul>
              <li>Skeptics may over-interpret minor anomalies as signs of failure</li>
              <li>Optimists may downplay warning signs</li>
              <li>Traders may use volatility metrics to justify speculative decisions</li>
            </ul>
            <p className="note">
              <strong>Defense:</strong> Read the Methodology page, check primary sources, and seek diverse perspectives.
            </p>
          </div>

          <div className="subsection">
            <h3>Short-Term vs. Long-Term Signals</h3>
            <p>
              This dashboard is optimized for short-term (hours to days) observations. Using it for long-term conclusions:
            </p>
            <ul>
              <li>Ignores protocol upgrades, governance changes, and ecosystem evolution</li>
              <li>May miss slow trends that emerge over months or years</li>
              <li>Does not account for external market forces (macro economy, regulatory changes)</li>
            </ul>
          </div>
        </section>

        <section className="assumptions-section">
          <h2>What This Dashboard Does NOT Measure</h2>

          <table className="limitations-table">
            <tbody>
              <tr>
                <td><strong>Transaction Finality</strong></td>
                <td>
                  This dashboard does not verify that confirmed transactions are final or irreversible.
                  Blockchain reorganizations (extremely rare in Ergo) are not detected.
                </td>
              </tr>
              <tr>
                <td><strong>Protocol Security</strong></td>
                <td>
                  Stability observations do not assess the protocol's resistance to double-spends, 51% attacks, or other
                  security threats. See peer-reviewed research for security analysis.
                </td>
              </tr>
              <tr>
                <td><strong>Consensus Correctness</strong></td>
                <td>
                  Block times say nothing about whether consensus rules are correctly enforced. Validation errors are not detected
                  by this dashboard.
                </td>
              </tr>
              <tr>
                <td><strong>Wallet or Exchange Security</strong></td>
                <td>
                  Network health does not imply wallet or exchange security. Custodial risks are outside the scope.
                </td>
              </tr>
              <tr>
                <td><strong>Token Utility or Fundamentals</strong></td>
                <td>
                  Price stability does not reflect the utility or value of ERG as a token. Market sentiment and speculation
                  drive price, not only fundamentals.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="assumptions-section">
          <h2>Why This Is Not Predictive</h2>

          <p>
            A common mistake is treating historical stability observations as predictive of future behavior. This is flawed because:
          </p>

          <ul>
            <li><strong>No Forward Model:</strong> The dashboard has no model of hashrate, difficulty, or demand in the future.</li>
            <li><strong>Black Swan Events:</strong> Major ecosystem changes (forks, security incidents, regulatory shocks) are unpredictable.</li>
            <li><strong>Human Factors:</strong> Miner decisions, development milestones, and market sentiment change unpredictably.</li>
            <li><strong>Feedback Loops:</strong> Price changes can alter miner participation, which then affects block times,
              creating non-linear dynamics.</li>
          </ul>

          <p className="note">
            <strong>Bottom Line:</strong> This dashboard is a rear-view mirror, not a crystal ball. Use it to understand the present
            and recent past, not the future.
          </p>
        </section>

        <section className="assumptions-section info-box">
          <h3>Responsible Use Guidelines</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Always read the Methodology page before interpreting metrics</li>
            <li>Cross-reference data with independent sources (Ergo Explorer, official channels)</li>
            <li>Treat anomalies as questions, not conclusions</li>
            <li>Never use this dashboard as the sole basis for financial or protocol-critical decisions</li>
            <li>Engage with the Ergo community to discuss observations and interpretations</li>
            <li>Keep this list of limitations in mind when making decisions</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
