/**
 * Network Health Component
 * Displays current blockchain health metrics
 */


import { Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../context/useApp';
import { formatDuration, formatHashRate, formatNumber } from '../utils/normalize';
import { calculateBlockTimeStability } from '../utils/risk';
import './NetworkHealth.css';

export function NetworkHealth() {
  const { networkState, blocks, blockMetrics, isLoading } = useApp();

  if (isLoading || !networkState || !blockMetrics) {
    return (
      <div className="network-health loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-content"></div>
      </div>
    );
  }

  const blockTimeStability = calculateBlockTimeStability(blocks);
  const avgBlockTime = blockMetrics.averageBlockTime;
  const expectedBlockTime = 120000; // 2 minutes

  return (
    <div className="network-health">
      <div className="card-header">
        <Activity className="header-icon" />
        <h2>Network Health</h2>
        {blockTimeStability.riskLevel === 'stable' && (
          <span className="badge badge-stable" aria-label="Network is stable">
            ✓ Stable
          </span>
        )}
        {blockTimeStability.riskLevel === 'caution' && (
          <span className="badge badge-caution" aria-label="Network requires caution">
            ⚠ Caution
          </span>
        )}
        {blockTimeStability.riskLevel === 'volatile' && (
          <span className="badge badge-volatile" aria-label="Network is volatile">
            ⚡ Volatile
          </span>
        )}
      </div>

      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-header">
            <Clock size={20} />
            <span className="metric-label">
              Avg Block Time
              <span className="tooltip">
                <AlertCircle size={14} />
                <span className="tooltip-text">
                  Average time between blocks. Ergo targets 2 minutes. Lower variance = more stable mining.
                </span>
              </span>
            </span>
          </div>
          <div className="metric-value">{formatDuration(avgBlockTime)}</div>
          <div className="metric-subtext">
            Target: {formatDuration(expectedBlockTime)}
            {avgBlockTime > expectedBlockTime * 1.2 && ' (⚠ Slow)'}
            {avgBlockTime < expectedBlockTime * 0.8 && ' (⚠ Fast)'}
          </div>
        </div>

        <div className="metric">
          <div className="metric-header">
            <TrendingUp size={20} />
            <span className="metric-label">
              Current Height
              <span className="tooltip">
                <AlertCircle size={14} />
                <span className="tooltip-text">
                  Total number of blocks mined since genesis. Higher is better (shows longevity).
                </span>
              </span>
            </span>
          </div>
          <div className="metric-value">{formatNumber(networkState.currentHeight, 0)}</div>
          <div className="metric-subtext">
            Hash Rate: {formatHashRate(networkState.hashRate || 0)}
          </div>
        </div>

        <div className="metric">
          <div className="metric-header">
            <Activity size={20} />
            <span className="metric-label">
              Transaction Volume
              <span className="tooltip">
                <AlertCircle size={14} />
                <span className="tooltip-text">
                  Total transactions in the analyzed period. Higher volume indicates active network usage.
                </span>
              </span>
            </span>
          </div>
          <div className="metric-value">{formatNumber(blockMetrics.totalTxCount, 0)}</div>
          <div className="metric-subtext">
            Last {blocks.length} blocks ({Math.round(blockMetrics.timeRange / 3600000)}h)
          </div>
        </div>
      </div>

      <div className="stability-bar">
        <div className="stability-bar-label">
          <span>Block Time Stability</span>
          <span className="stability-score">{blockTimeStability.score.toFixed(0)}/100</span>
        </div>
        <div className="stability-bar-track">
          <div
            className={`stability-bar-fill stability-${blockTimeStability.riskLevel}`}
            style={{ width: `${blockTimeStability.score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
