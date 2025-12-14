import { useState } from 'react';
import './Simulator.css';

type RiskAppetite = 0 | 1 | 2; // Conservative, Balanced, Aggressive

interface SimulationInputs {
  exposureAmount: number; // 0 to 50,000
  riskAppetite: RiskAppetite; // 0=Conservative, 1=Balanced, 2=Aggressive
  timeHorizonYears: number; // 0 to 10 years
  is100Year: boolean;
}

export function Simulator() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    exposureAmount: 10000,
    riskAppetite: 1,
    timeHorizonYears: 1,
    is100Year: false,
  });

  const getTimeHorizonLabel = (): string => {
    if (inputs.is100Year) return '100 Years';
    if (inputs.timeHorizonYears === 0) return 'Immediate (days)';
    if (inputs.timeHorizonYears === 1) return '1 Year';
    return `${inputs.timeHorizonYears} Years`;
  };

  // Calculate qualitative indicators (no numbers, no predictions)
  const calculateIndicators = () => {
    if (inputs.is100Year) {
      return null; // Special case: no simulation
    }

    // Uncertainty Level: combines time horizon and risk appetite
    const timeUncertainty = inputs.timeHorizonYears / 10; // 0 to 1
    const riskUncertainty = inputs.riskAppetite / 2; // 0 to 1
    const baseUncertainty = (timeUncertainty + riskUncertainty) / 2;

    let uncertaintyLevel: 'Low' | 'Medium' | 'High';
    if (baseUncertainty < 0.33) uncertaintyLevel = 'Low';
    else if (baseUncertainty < 0.67) uncertaintyLevel = 'Medium';
    else uncertaintyLevel = 'High';

    // Outcome Dispersion: how wide could outcomes be?
    const dispersionFactor = inputs.timeHorizonYears * (1 + inputs.riskAppetite * 0.5);
    let outcomeDispersion: 'Narrow' | 'Moderate' | 'Wide';
    if (dispersionFactor < 2) outcomeDispersion = 'Narrow';
    else if (dispersionFactor < 5) outcomeDispersion = 'Moderate';
    else outcomeDispersion = 'Wide';

    // Confidence in Assumptions: how reliable are our assumptions?
    const timeDecay = Math.pow(0.8, inputs.timeHorizonYears); // Confidence decays over time
    const riskPenalty = 1 - inputs.riskAppetite * 0.2; // Aggressive reduces confidence
    const confidenceScore = timeDecay * riskPenalty;

    let confidenceInAssumptions: 'High' | 'Medium' | 'Low' | 'Very Low';
    if (confidenceScore > 0.7) confidenceInAssumptions = 'High';
    else if (confidenceScore > 0.5) confidenceInAssumptions = 'Medium';
    else if (confidenceScore > 0.25) confidenceInAssumptions = 'Low';
    else confidenceInAssumptions = 'Very Low';

    return {
      uncertaintyLevel,
      outcomeDispersion,
      confidenceInAssumptions,
      exposureContext: inputs.exposureAmount > 0 
        ? `An exposure of $${inputs.exposureAmount.toLocaleString()} means the consequences of misinterpretation are significant.`
        : 'Consider the scale of exposure to understand potential impact.',
    };
  };

  const indicators = calculateIndicators();

  const handleInputChange = (key: keyof SimulationInputs, value: number | boolean) => {
    setInputs(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSet100Year = () => {
    setInputs(prev => ({
      ...prev,
      is100Year: true,
      timeHorizonYears: 100,
    }));
  };

  const handleReset = () => {
    setInputs({
      exposureAmount: 10000,
      riskAppetite: 1,
      timeHorizonYears: 1,
      is100Year: false,
    });
  };

  return (
    <main className="simulator-page">
      <div className="simulator-container">
        <header className="simulator-header">
          <h1>Simulator</h1>
          <h2>Explore assumptions, not outcomes</h2>
        </header>

        <section className="simulator-philosophy">
          <p>
            This simulator helps you understand how uncertainty changes based on your assumptions. 
            It does <strong>not</strong> predict prices, estimate returns, or recommend actions.
          </p>
          <p>
            Instead, it shows you: <em>How confident should I be in my assumptions?</em>
          </p>
        </section>

        <div className="simulator-grid">
          {/* Controls Section */}
          <section className="simulator-controls">
            <h3>Your Assumptions</h3>

            <div className="control-group">
              <label htmlFor="exposure">
                Exposure Amount: <span>${inputs.exposureAmount.toLocaleString()}</span>
              </label>
              <input
                id="exposure"
                type="range"
                min="0"
                max="50000"
                step="5000"
                value={inputs.exposureAmount}
                onChange={(e) => handleInputChange('exposureAmount', parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>$0</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
              <p className="control-description">
                The scale of exposure you're considering. Larger amounts mean higher emotional sensitivity and higher importance of context.
              </p>
            </div>

            <div className="control-group">
              <fieldset className="risk-appetite-group">
                <legend>Risk Appetite</legend>
                <div className="radio-options">
                  <label>
                    <input
                      type="radio"
                      name="risk"
                      value="0"
                      checked={inputs.riskAppetite === 0}
                      onChange={() => handleInputChange('riskAppetite', 0 as RiskAppetite)}
                    />
                    <span>Conservative</span>
                    <p>Lower volatility tolerance</p>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="risk"
                      value="1"
                      checked={inputs.riskAppetite === 1}
                      onChange={() => handleInputChange('riskAppetite', 1 as RiskAppetite)}
                    />
                    <span>Balanced</span>
                    <p>Moderate volatility tolerance</p>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="risk"
                      value="2"
                      checked={inputs.riskAppetite === 2}
                      onChange={() => handleInputChange('riskAppetite', 2 as RiskAppetite)}
                    />
                    <span>Aggressive</span>
                    <p>Higher volatility tolerance</p>
                  </label>
                </div>
              </fieldset>
              <p className="control-description">
                Higher risk appetite widens the range of plausible outcomes and reduces confidence in assumptions.
              </p>
            </div>

            <div className="control-group">
              <label htmlFor="time-horizon">
                Time Horizon: <span>{getTimeHorizonLabel()}</span>
              </label>
              <input
                id="time-horizon"
                type="range"
                min="0"
                max="10"
                step="1"
                value={inputs.is100Year ? 10 : inputs.timeHorizonYears}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleInputChange('timeHorizonYears', val);
                  handleInputChange('is100Year', false);
                }}
                disabled={inputs.is100Year}
                className="slider"
              />
              <p className="control-description">
                Longer time horizons mean more uncertainty and less reliable assumptions.
              </p>
            </div>

            <button className="preset-button" onClick={handleSet100Year}>
              {inputs.is100Year ? '✓ 100-Year Mode' : 'View 100-Year Scenario'}
            </button>

            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </section>

          {/* Results Section */}
          <section className="simulator-results">
            {inputs.is100Year ? (
              <div className="century-message">
                <h3>100-Year Horizon</h3>
                <div className="message-box">
                  <p>
                    At a 100-year horizon, predictions are meaningless. This timeframe is dominated by:
                  </p>
                  <ul>
                    <li>Unknown structural changes</li>
                    <li>Technological disruption</li>
                    <li>Shifts in market behavior and incentives</li>
                    <li>Assumptions that become outdated</li>
                  </ul>
                  <p>
                    <strong>This is not a limitation of the simulator. It is a feature.</strong>
                  </p>
                  <p>
                    Honest tools acknowledge when predictions break down. The longer your horizon, the more important it is to focus on resilience and robustness rather than optimization.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3>What Your Assumptions Tell Us</h3>

                <div className={`indicator-card uncertainty ${indicators?.uncertaintyLevel?.toLowerCase()}`}>
                  <span className="indicator-label">Uncertainty Level</span>
                  <span className="indicator-value">{indicators?.uncertaintyLevel}</span>
                  <p className="indicator-description">
                    {indicators?.uncertaintyLevel === 'Low'
                      ? 'Your scenario has relatively clear conditions.'
                      : indicators?.uncertaintyLevel === 'Medium'
                      ? 'Your scenario involves moderate uncertainty. Assumptions matter.'
                      : 'Your scenario is highly uncertain. Assumptions are unreliable.'}
                  </p>
                </div>

                <div className={`indicator-card dispersion ${indicators?.outcomeDispersion?.toLowerCase()}`}>
                  <span className="indicator-label">Outcome Dispersion</span>
                  <span className="indicator-value">{indicators?.outcomeDispersion}</span>
                  <p className="indicator-description">
                    {indicators?.outcomeDispersion === 'Narrow'
                      ? 'Plausible outcomes are tightly clustered. But assumptions may still be wrong.'
                      : indicators?.outcomeDispersion === 'Moderate'
                      ? 'Plausible outcomes span a moderate range. Variability is significant.'
                      : 'Plausible outcomes are very wide. Small assumption changes create very different results.'}
                  </p>
                </div>

                <div className={`indicator-card confidence ${indicators?.confidenceInAssumptions?.toLowerCase()}`}>
                  <span className="indicator-label">Confidence in Assumptions</span>
                  <span className="indicator-value">{indicators?.confidenceInAssumptions}</span>
                  <p className="indicator-description">
                    {indicators?.confidenceInAssumptions === 'High'
                      ? 'Your assumptions are likely to hold over this horizon.'
                      : indicators?.confidenceInAssumptions === 'Medium'
                      ? 'Your assumptions are reasonable but may need adjustment.'
                      : indicators?.confidenceInAssumptions === 'Low'
                      ? 'Your assumptions are fragile. Market conditions could change.'
                      : 'Your assumptions are highly unreliable over this horizon.'}
                  </p>
                </div>

                <div className="exposure-context">
                  <p className="context-label">Context</p>
                  <p>{indicators?.exposureContext}</p>
                </div>
              </>
            )}
          </section>
        </div>

        <section className="simulator-notes">
          <h3>How to Use This Tool</h3>
          <ul className="notes-list">
            <li>
              <strong>Before acting on price movements:</strong> Set your exposure amount and time horizon, then observe how uncertainty changes.
            </li>
            <li>
              <strong>Alongside context:</strong> Use this with historical data elsewhere in CryptoNanny to ground abstract uncertainty in real past behavior.
            </li>
            <li>
              <strong>As reflection, not decision-making:</strong> The simulator is for slowing down, not speeding up decisions.
            </li>
            <li>
              <strong>Experiment with assumptions:</strong> Try different time horizons and risk appetites to see how fragile predictions become.
            </li>
          </ul>
        </section>

        <section className="simulator-what-not">
          <h3>What This Simulator Does NOT Do</h3>
          <p>This simulator explicitly does not:</p>
          <ul className="doesnt-list">
            <li>Estimate future prices</li>
            <li>Calculate profit or loss</li>
            <li>Compute ROI, CAGR, or returns</li>
            <li>Rank assets or strategies</li>
            <li>Suggest buying or selling</li>
            <li>Provide financial advice</li>
          </ul>
          <p className="disclaimer-note">
            Any system claiming certainty in complex, adaptive markets should be treated with skepticism. This simulator prioritizes honesty about uncertainty over false precision.
          </p>
        </section>

        <section className="simulator-philosophy-deep">
          <h3>Design Philosophy</h3>
          <p>
            The CryptoNanny Simulator is inspired by systems that prioritize explicit assumptions, conservative modeling, and transparency about limitations.
          </p>
          <p>
            Rather than telling you <em>what will happen</em>, it asks a different question:
          </p>
          <p className="philosophy-question">
            "How confident should I be in my assumptions?"
          </p>
          <p>
            By replacing predictions with context and certainty with transparency, the simulator encourages you to engage with financial markets more thoughtfully and responsibly.
          </p>
        </section>
      </div>
    </main>
  );
}
