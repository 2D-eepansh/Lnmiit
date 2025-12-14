/**
 * Price Stability Component
 * Displays ERG price data and volatility metrics
 */


import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useApp } from '../context/useApp';
import { calculatePriceVolatility } from '../utils/risk';
import './PriceStability.css';

export function PriceStability() {
  const { priceData, historicalPrices, isLoading } = useApp();

  if (isLoading || !priceData) {
    return (
      <div className="price-stability loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-content"></div>
      </div>
    );
  }

  const volatility = calculatePriceVolatility(historicalPrices);
  const priceChange = priceData.usd_24h_change;
  const isPositive = priceChange >= 0;

  return (
    <div className="price-stability">
      <div className="card-header">
        <DollarSign className="header-icon" />
        <h2>ERG Price & Stability</h2>
        {volatility.riskLevel === 'stable' && (
          <span className="badge badge-stable" aria-label="Price is stable">
            ✓ Stable
          </span>
        )}
        {volatility.riskLevel === 'caution' && (
          <span className="badge badge-caution" aria-label="Price volatility caution">
            ⚠ Moderate
          </span>
        )}
        {volatility.riskLevel === 'volatile' && (
          <span className="badge badge-volatile" aria-label="Price is volatile">
            ⚡ Volatile
          </span>
        )}
      </div>

      <div className="volatility-explanation">
        <h4>Understanding Price Stability</h4>
        <p>
          {volatility.riskLevel === 'stable' && (
            <>
              ✓ ERG is showing <strong>low volatility</strong> compared to typical crypto assets.
              This indicates price stability and may reflect market confidence.
            </>
          )}
          {volatility.riskLevel === 'caution' && (
            <>
              ⚠ ERG is showing <strong>moderate volatility</strong>. This is normal for cryptocurrency
              markets but warrants careful monitoring of price movements.
            </>
          )}
          {volatility.riskLevel === 'volatile' && (
            <>
              ⚡ ERG is experiencing <strong>high volatility</strong>. Large price swings are occurring.
              This is common during market uncertainty or low liquidity periods.
            </>
          )}
        </p>
      </div>

      <div className="price-main">
        <div className="price-current">
          <div className="price-label-row">
            <span className="price-label">Current Price</span>
            <span className="context-tag">Market Signal (Contextual)</span>
          </div>
          <div className="price-value-container">
            <span className="price-value">${priceData.usd.toFixed(4)}</span>
            <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
          <span className="price-timeframe">24h change</span>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-compact">
          <div className="metric-header">
            <span className="metric-label">
              Volatility (7d)
              <span className="tooltip">
                <AlertCircle size={14} />
                <span className="tooltip-text">
                  Annualized price volatility based on 7-day returns. Lower = more stable. Crypto avg: 60-100%.
                </span>
              </span>
            </span>
          </div>
          <div className="metric-value-small">{volatility.volatilityPercent.toFixed(1)}%</div>
        </div>

        {priceData.usd_24h_vol && (
          <div className="metric-compact">
            <div className="metric-header">
              <span className="metric-label">
                24h Volume
                <span className="tooltip">
                  <AlertCircle size={14} />
                  <span className="tooltip-text">
                    Total USD trading volume in the last 24 hours across all exchanges.
                  </span>
                </span>
              </span>
            </div>
            <div className="metric-value-small">
              ${(priceData.usd_24h_vol / 1_000_000).toFixed(2)}M
            </div>
          </div>
        )}

        {priceData.usd_market_cap && (
          <div className="metric-compact">
            <div className="metric-header">
              <span className="metric-label">
                Market Cap
                <span className="tooltip">
                  <AlertCircle size={14} />
                  <span className="tooltip-text">
                    Total market value of all circulating ERG tokens (price × supply).
                  </span>
                </span>
              </span>
            </div>
            <div className="metric-value-small">
              ${(priceData.usd_market_cap / 1_000_000).toFixed(1)}M
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
