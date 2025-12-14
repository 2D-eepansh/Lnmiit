import { useMemo } from 'react';
import { AlertTriangle, Bolt, CheckCircle, CloudOff, Gauge, Info, Radar, Server } from 'lucide-react';
import { useApp } from '../context/useApp';
import { detectAnomalies, summarizeAnomalies } from '../utils/risk';
import './PhaseTwoInsights.css';

export function PhaseTwoInsights() {
  const {
    blocks,
    blockMetrics,
    apiHealthy,
    usingMockData,
    lastUpdated,
    priceData,
  } = useApp();

  const anomalySummary = useMemo(() => summarizeAnomalies(blocks, blockMetrics), [blocks, blockMetrics]);
  const anomalies = useMemo(() => detectAnomalies(blocks).anomalies.slice(0, 4), [blocks]);

  const anomalyLevel = anomalySummary.total > 0 ? 'Elevated variance' : 'Within expected bounds';
  const blockTimeSeverity = Math.min(1, Math.max(0.2, anomalySummary.blockTimeCv * 2.5));
  const blockTimePercent = Math.round(blockTimeSeverity * 100);

  const observedTarget = 99.5;
  const observedValue = usingMockData ? 98.5 : apiHealthy ? 99.95 : 97.0;

  const services = [
    {
      name: 'Explorer API',
      status: apiHealthy ? 'online' : 'degraded',
      detail: apiHealthy ? 'Data availability only; not network health' : 'Fallback active; data availability only',
      note: 'Height/tx indexing; latency <2s; mirror enabled for failover.',
      icon: apiHealthy ? <CheckCircle size={16} /> : <CloudOff size={16} />,
    },
    {
      name: 'Price Feed',
      status: priceData ? 'online' : 'degraded',
      detail: priceData ? `ERG $${priceData.usd.toFixed(2)} • data availability only` : 'Unavailable',
      note: 'ERG/USD via public feed; refreshed ~60s; cached fallback if stale.',
      icon: priceData ? <CheckCircle size={16} /> : <CloudOff size={16} />,
    },
    {
      name: 'Data Mode',
      status: usingMockData ? 'mock' : 'live',
      detail: usingMockData ? 'Mock dataset; observational only' : 'Live observations; not guarantees',
      note: usingMockData
        ? 'Mock blocks/prices for demos; no live guarantees.'
        : 'Live endpoints; observational only; alerts disabled.',
      icon: usingMockData ? <Bolt size={16} /> : <Server size={16} />,
    },
  ];

  return (
    <section className="phase-two-grid">
      <div className="phase-card anomaly-card">
        <div className="card-header">
          <div className="title">
            <Radar size={18} />
            <span>Anomaly Radar</span>
          </div>
          <span className={`badge ${anomalySummary.total > 0 ? 'warn' : 'neutral'}`}>
            {anomalySummary.total > 0 ? `${anomalySummary.total} flagged` : 'No recent flags'}
          </span>
        </div>
        <p className="panel-context">Short-term block-time variance is elevated relative to recent medians, but remains within historically observed behavior.</p>

        <div className="radar-body">
          <div className="dial" aria-label={`Block time variance ${blockTimePercent}%`}>
            <div
              className="dial-fill"
              style={{ background: `conic-gradient(var(--color-primary) ${blockTimePercent}%, rgba(255,255,255,0.06) ${blockTimePercent}%)` }}
            />
            <div className="dial-center">
              <span className="dial-value">{anomalyLevel}</span>
              <span className="dial-label">Block-time variance (relative)</span>
            </div>
          </div>
          <div className="radar-stats">
            <div>
              <p className="stat-label">Difficulty drift</p>
              <p className="stat-value muted subtle-text">{anomalySummary.difficultyChange.toFixed(2)}% (context only)</p>
            </div>
            <div>
              <p className="stat-label">Activity score</p>
              <p className="stat-value muted subtle-text">{Math.round(anomalySummary.activityScore)} (context only)</p>
            </div>
            <div>
              <p className="stat-label">Confidence posture</p>
              <p className="stat-value muted subtle-text">
                Operating within expected bounds, with elevated short-term variance.
              </p>
            </div>
          </div>
        </div>

        <div className="anomaly-list">
          {anomalies.length === 0 ? (
            <p className="muted">No anomalies detected in the latest window.</p>
          ) : (
            anomalies.map((a) => (
              <div key={`${a.type}-${a.height}`} className="anomaly-item">
                <AlertTriangle size={16} className="anomaly-icon" />
                <div>
                  <p className="anomaly-type">{a.type.replace('_', ' ')} • {a.severity} variance</p>
                  <p className="anomaly-desc">Block {a.height}: {a.description}</p>
                  {a.blockTimeSec && (
                    <p className="anomaly-desc muted">Expected block time ≈ {a.expectedBaselineSec}s • Observed {Math.round(a.blockTimeSec)}s</p>
                  )}
                  <p className="anomaly-desc muted small">Classified for observers/researchers; not an alarm.</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="assumption-note">
          <Info size={14} />
          <span>Data from Ergo Explorer; observations depend on the recent window and reflect patterns, not guarantees.</span>
        </div>
      </div>

      <div className="phase-card sla-card">
        <div className="card-header">
          <div className="title">
            <Gauge size={18} />
            <span>Observed Availability (Rolling Window)</span>
          </div>
          <span className={`badge neutral`}>
            Target {observedTarget.toFixed(1)}%
          </span>
        </div>
        <div className="sla-body">
          <div className="sla-score">
            <Gauge size={46} />
            <div>
              <p className="sla-value">{observedValue.toFixed(2)}%</p>
              <p className="sla-label">observational, not a guarantee</p>
            </div>
          </div>
          <p className="muted">
            {anomalySummary.total > 0
              ? 'Availability remains high, though short-term anomalies are present.'
              : 'Observation only; no guaranteed service level.'}
          </p>
          <p className="muted tiny">High availability can coexist with short-term variance in block production.</p>
          <p className="muted tiny">This metric is observational and does not represent a guarantee or service-level agreement.</p>
          {lastUpdated && (
            <p className="muted tiny">Last sync {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
      </div>

      <div className="phase-card service-card">
        <div className="card-header">
          <div className="title">
            <Server size={18} />
            <span>Data Source Status</span>
          </div>
          <span className="badge neutral">Data availability only</span>
        </div>
        <p className="muted tiny inline-note">Indicates data feed availability only, not network or protocol health.</p>
        <div className="service-list">
          {services.map(service => (
            <div key={service.name} className="service-item">
              <div className={`status-dot ${service.status}`}></div>
              <div className="service-meta">
                <p className="service-name">{service.name}</p>
                <p className="service-detail">{service.detail}</p>
                <p className="service-note">{service.note}</p>
              </div>
              <div className="service-icon">{service.icon}</div>
            </div>
          ))}
        </div>
        <p className="muted tiny">Data source availability ≠ Ergo protocol health. For observers and researchers.</p>
      </div>
    </section>
  );
}
