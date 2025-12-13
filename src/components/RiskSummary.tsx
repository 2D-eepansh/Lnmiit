/**
 * Risk Summary Component
 * Overall stability assessment with actionable insights
 */


import { Shield, CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/useApp';
import './RiskSummary.css';

export function RiskSummary() {
  const { stabilityScore, isLoading } = useApp();

  if (isLoading || !stabilityScore) {
    return (
      <div className="risk-summary loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-content"></div>
      </div>
    );
  }

  const { score, level, factors } = stabilityScore;

  const getScoreColor = (factorScore: number) => {
    if (factorScore >= 70) return 'stable';
    if (factorScore >= 40) return 'caution';
    return 'volatile';
  };

  const getIcon = () => {
    if (level === 'stable') return <CheckCircle className="summary-icon stable" />;
    if (level === 'caution') return <AlertTriangle className="summary-icon caution" />;
    return <XCircle className="summary-icon volatile" />;
  };

  const getMessage = () => {
    if (level === 'stable') {
      return 'The Ergo network is operating stably with consistent block production and healthy metrics.';
    }
    if (level === 'caution') {
      return 'The Ergo network shows some fluctuations. Monitor the situation but no immediate concerns.';
    }
    return 'The Ergo network is experiencing elevated volatility. This may be temporary or indicate market stress.';
  };

  return (
    <div className="risk-summary">
      <div className="card-header">
        <Shield className="header-icon" />
        <h2>Stability Assessment</h2>
      </div>

      <div className="summary-main">
        {getIcon()}
        <div className="summary-score-large">{score}<span className="score-max">/100</span></div>
        <div className={`summary-level level-${level}`}>
          {level.toUpperCase()}
        </div>
        <p className="summary-message">{getMessage()}</p>
      </div>

      <div className="factors-breakdown">
        <h3>
          Stability Factors
          <span className="tooltip">
            <AlertCircle size={16} />
            <span className="tooltip-text">
              Overall score is weighted: Block Time (50%), Difficulty (30%), Activity (20%).
              Each factor contributes to the final stability assessment.
            </span>
          </span>
        </h3>

        <div className="factor-item">
          <div className="factor-header">
            <span className="factor-name">Block Time Consistency</span>
            <span className={`factor-score score-${getScoreColor(factors.blockTimeStability)}`}>
              {factors.blockTimeStability}/100
            </span>
          </div>
          <div className="factor-bar">
            <div
              className={`factor-fill fill-${getScoreColor(factors.blockTimeStability)}`}
              style={{ width: `${factors.blockTimeStability}%` }}
            ></div>
          </div>
          <p className="factor-description">
            Measures variance in block production times. Low variance = stable mining.
          </p>
        </div>

        <div className="factor-item">
          <div className="factor-header">
            <span className="factor-name">Difficulty Stability</span>
            <span className={`factor-score score-${getScoreColor(factors.difficultyStability)}`}>
              {factors.difficultyStability}/100
            </span>
          </div>
          <div className="factor-bar">
            <div
              className={`factor-fill fill-${getScoreColor(factors.difficultyStability)}`}
              style={{ width: `${factors.difficultyStability}%` }}
            ></div>
          </div>
          <p className="factor-description">
            Tracks difficulty adjustment consistency. Indicates miner engagement stability.
          </p>
        </div>

        <div className="factor-item">
          <div className="factor-header">
            <span className="factor-name">Network Activity</span>
            <span className={`factor-score score-${getScoreColor(factors.networkActivity)}`}>
              {factors.networkActivity}/100
            </span>
          </div>
          <div className="factor-bar">
            <div
              className={`factor-fill fill-${getScoreColor(factors.networkActivity)}`}
              style={{ width: `${factors.networkActivity}%` }}
            ></div>
          </div>
          <p className="factor-description">
            Measures transaction throughput. Higher activity = healthier ecosystem.
          </p>
        </div>
      </div>

      <div className="interpretation-box">
        <h4>How to Interpret</h4>
        <ul>
          <li><strong>Stable (70-100):</strong> Network operating normally with minimal fluctuations</li>
          <li><strong>Caution (40-69):</strong> Some variability present, monitor but not concerning</li>
          <li><strong>Volatile (&lt;40):</strong> Significant fluctuations, investigate further</li>
        </ul>
      </div>
    </div>
  );
}
