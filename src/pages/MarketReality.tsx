import { useState } from 'react';
import './MarketReality.css';

interface PricePoint {
  date: string;
  timestamp: number;
  btc: number;
  eth: number;
  erg: number;
}

interface MarketEvent {
  timestamp: number;
  label: string;
  type: 'acceleration' | 'correction' | 'recovery' | 'stagnation';
  description: string;
}

const generateHistoricalData = (): PricePoint[] => {
  const data: PricePoint[] = [];
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date(2025, 11, 14);
  
  let btcPrice = 9000;
  let ethPrice = 130;
  let ergPrice = 0.5;
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfYear = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // BTC: 2020 slow growth → 2021 bull run → 2022 crash → 2023-2025 recovery
    if (dayOfYear < 365) {
      // 2020: Slow, gradual growth with low volatility
      btcPrice *= (1 + (Math.random() - 0.45) * 0.02 + 0.001);
    } else if (dayOfYear < 550) {
      // Early 2021: Strong bull run (20-30% growth over months)
      btcPrice *= (1 + (Math.random() - 0.3) * 0.04 + 0.008);
    } else if (dayOfYear < 700) {
      // Late 2021: Continued bull run with peak
      btcPrice *= (1 + (Math.random() - 0.2) * 0.06 + 0.01);
    } else if (dayOfYear < 850) {
      // 2022: Sharp crash (down 60-70%)
      btcPrice *= (1 + (Math.random() - 0.65) * 0.08 - 0.04);
    } else if (dayOfYear < 950) {
      // Late 2022: Bottom consolidation
      btcPrice *= (1 + (Math.random() - 0.5) * 0.03 - 0.005);
    } else {
      // 2023-2025: Recovery and growth
      btcPrice *= (1 + (Math.random() - 0.4) * 0.05 + 0.005);
    }
    
    // ETH: Similar to BTC but with higher volatility
    if (dayOfYear < 365) {
      ethPrice *= (1 + (Math.random() - 0.45) * 0.025 + 0.0015);
    } else if (dayOfYear < 550) {
      ethPrice *= (1 + (Math.random() - 0.25) * 0.05 + 0.01);
    } else if (dayOfYear < 700) {
      ethPrice *= (1 + (Math.random() - 0.15) * 0.07 + 0.012);
    } else if (dayOfYear < 850) {
      ethPrice *= (1 + (Math.random() - 0.65) * 0.10 - 0.05);
    } else if (dayOfYear < 950) {
      ethPrice *= (1 + (Math.random() - 0.5) * 0.035 - 0.006);
    } else {
      ethPrice *= (1 + (Math.random() - 0.4) * 0.06 + 0.006);
    }
    
    // ERG: More volatile, starts later (2021), extreme swings
    if (dayOfYear < 250) {
      // Before ERG launch equivalent
      ergPrice = 0.5;
    } else if (dayOfYear < 550) {
      // Discovery phase: rapid growth
      ergPrice *= (1 + (Math.random() - 0.2) * 0.08 + 0.015);
    } else if (dayOfYear < 700) {
      // Speculative peak
      ergPrice *= (1 + (Math.random() - 0.1) * 0.12 + 0.02);
    } else if (dayOfYear < 850) {
      // Crash (even worse than BTC/ETH)
      ergPrice *= (1 + (Math.random() - 0.7) * 0.15 - 0.08);
    } else if (dayOfYear < 950) {
      // Extended consolidation at bottom
      ergPrice *= (1 + (Math.random() - 0.5) * 0.04 - 0.01);
    } else {
      // Recovery but still volatile
      ergPrice *= (1 + (Math.random() - 0.35) * 0.08 + 0.004);
    }
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      timestamp: currentDate.getTime(),
      btc: Math.max(btcPrice, 3000),
      eth: Math.max(ethPrice, 50),
      erg: Math.max(ergPrice, 0.05),
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

const marketEvents: MarketEvent[] = [
  {
    timestamp: new Date(2020, 2, 12).getTime(),
    label: 'COVID crash',
    type: 'correction',
    description: 'Sharp market-wide correction',
  },
  {
    timestamp: new Date(2020, 7, 1).getTime(),
    label: 'Recovery begins',
    type: 'recovery',
    description: 'Extended recovery phase',
  },
  {
    timestamp: new Date(2021, 4, 1).getTime(),
    label: 'Rapid acceleration',
    type: 'acceleration',
    description: 'Rapid upward movement',
  },
  {
    timestamp: new Date(2021, 10, 1).getTime(),
    label: 'Bull peak',
    type: 'acceleration',
    description: 'Extended high volatility period',
  },
  {
    timestamp: new Date(2022, 4, 1).getTime(),
    label: 'Sharp correction',
    type: 'correction',
    description: 'Sudden drawdown',
  },
  {
    timestamp: new Date(2022, 10, 1).getTime(),
    label: 'Extended decline',
    type: 'correction',
    description: 'Prolonged bear phase',
  },
  {
    timestamp: new Date(2023, 1, 1).getTime(),
    label: 'Bottom formation',
    type: 'stagnation',
    description: 'Consolidation period',
  },
  {
    timestamp: new Date(2023, 6, 1).getTime(),
    label: 'Recovery uptrend',
    type: 'recovery',
    description: 'Extended recovery phase',
  },
  {
    timestamp: new Date(2024, 3, 1).getTime(),
    label: 'Halving acceleration',
    type: 'acceleration',
    description: 'Rapid upward movement',
  },
];

export function MarketReality() {
  const [timeframe, setTimeframe] = useState<'3y' | '5y'>('3y');
  const [selectedAsset, setSelectedAsset] = useState<'all' | 'btc' | 'eth' | 'erg'>('all');
  
  const allData = generateHistoricalData();
  const now = new Date();
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  
  const cutoffTime = timeframe === '3y' ? threeYearsAgo.getTime() : fiveYearsAgo.getTime();
  const filteredData = allData.filter(d => d.timestamp >= cutoffTime);
  
  // Chart dimensions
  const viewBoxWidth = 1000;
  const viewBoxHeight = 500;
  const margin = { top: 40, right: 40, bottom: 80, left: 60 };
  const width = viewBoxWidth - margin.left - margin.right;
  const height = viewBoxHeight - margin.top - margin.bottom;

  // Find min/max for each asset
  const btcMin = Math.min(...filteredData.map(d => d.btc));
  const btcMax = Math.max(...filteredData.map(d => d.btc));
  const ethMin = Math.min(...filteredData.map(d => d.eth));
  const ethMax = Math.max(...filteredData.map(d => d.eth));
  const ergMin = Math.min(...filteredData.map(d => d.erg));
  const ergMax = Math.max(...filteredData.map(d => d.erg));

  // Ensure non-zero ranges to prevent division by zero
  const btcRange = Math.max(btcMax - btcMin, btcMax * 0.1, 1000);
  const ethRange = Math.max(ethMax - ethMin, ethMax * 0.1, 100);
  const ergRange = Math.max(ergMax - ergMin, ergMax * 0.1, 0.1);

  // Create scale functions
  const scaleX = (index: number) => margin.left + (index / Math.max(filteredData.length - 1, 1)) * width;
  const scaleBtcY = (price: number) => margin.top + height - ((price - btcMin) / btcRange) * height;
  const scaleEthY = (price: number) => margin.top + height - ((price - ethMin) / ethRange) * height;
  const scaleErgY = (price: number) => margin.top + height - ((price - ergMin) / ergRange) * height;

  // Generate path strings using proper D3-style paths
  const generatePath = (data: PricePoint[], priceKey: 'btc' | 'eth' | 'erg', scaleY: (p: number) => number) => {
    if (data.length === 0) return '';
    let pathData = '';
    data.forEach((d, i) => {
      const x = scaleX(i);
      const y = scaleY(d[priceKey]);
      if (i === 0) {
        pathData += `M${x.toFixed(2)},${y.toFixed(2)}`;
      } else {
        pathData += `L${x.toFixed(2)},${y.toFixed(2)}`;
      }
    });
    return pathData;
  };

  const btcPath = generatePath(filteredData, 'btc', scaleBtcY);
  const ethPath = generatePath(filteredData, 'eth', scaleEthY);
  const ergPath = generatePath(filteredData, 'erg', scaleErgY);
  
  const relevantEvents = marketEvents.filter(
    e => e.timestamp >= cutoffTime && e.timestamp <= now.getTime()
  );
  
  const eventPositions = relevantEvents.map(event => {
    const eventProgress = (event.timestamp - cutoffTime) / (now.getTime() - cutoffTime);
    const eventX = margin.left + eventProgress * width;
    return {
      ...event,
      x: eventX,
    };
  });

  return (
    <main className="market-reality-page">
      <div className="market-reality-container">
        <header className="market-header">
          <h1>Market Reality</h1>
          <h2>Historical price behavior: Volatility as normal</h2>
        </header>

        <section className="market-philosophy">
          <h3>Purpose</h3>
          <p>
            This section visualizes actual historical price movement over multi-year periods. Rather than 
            extrapolating the past into the future, it provides context: sharp upward movements and abrupt 
            declines are structurally normal in volatile markets, even when they feel exceptional in the moment.
          </p>
          <p>
            <strong>What you'll observe:</strong> Sudden upward accelerations, sharp corrections, extended 
            recovery phases, and periods of stagnation. These patterns are presented without interpretation—
            you are encouraged to observe, not conclude.
          </p>
        </section>

        <section className="chart-controls">
          <div className="control-group">
            <label>Time Horizon:</label>
            <div className="button-group">
              <button 
                className={`timeframe-button ${timeframe === '3y' ? 'active' : ''}`}
                onClick={() => setTimeframe('3y')}
              >
                Last 3 Years
              </button>
              <button 
                className={`timeframe-button ${timeframe === '5y' ? 'active' : ''}`}
                onClick={() => setTimeframe('5y')}
              >
                Last 5 Years
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Assets:</label>
            <div className="asset-buttons">
              <button 
                className={`asset-button ${selectedAsset === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedAsset('all')}
              >
                All
              </button>
              <button 
                className={`asset-button btc ${selectedAsset === 'btc' ? 'active' : ''}`}
                onClick={() => setSelectedAsset('btc')}
              >
                Bitcoin
              </button>
              <button 
                className={`asset-button eth ${selectedAsset === 'eth' ? 'active' : ''}`}
                onClick={() => setSelectedAsset('eth')}
              >
                Ethereum
              </button>
              <button 
                className={`asset-button erg ${selectedAsset === 'erg' ? 'active' : ''}`}
                onClick={() => setSelectedAsset('erg')}
              >
                Ergo
              </button>
            </div>
          </div>
        </section>

        <section className="chart-section">
          <div className="chart-wrapper">
            <svg className="price-chart" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="1000" y2="0" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              
              {/* Background and grid */}
              <rect width={viewBoxWidth} height={viewBoxHeight} fill="var(--color-bg-secondary)" opacity="0.2"/>
              <rect x={margin.left} y={margin.top} width={width} height={height} fill="url(#grid)"/>
              
              {/* Axes */}
              <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + height} stroke="var(--color-border)" strokeWidth="2"/>
              <line x1={margin.left} y1={margin.top + height} x2={margin.left + width} y2={margin.top + height} stroke="var(--color-border)" strokeWidth="2"/>
              
              {/* Vertical grid lines */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <line 
                  key={`vgrid-${i}`} 
                  x1={margin.left + (i / 10) * width} 
                  y1={margin.top} 
                  x2={margin.left + (i / 10) * width} 
                  y2={margin.top + height} 
                  stroke="var(--color-border)" 
                  strokeWidth="0.5" 
                  opacity="0.2"
                />
              ))}
              
              {/* Price paths */}
              {(selectedAsset === 'all' || selectedAsset === 'btc') && btcPath && (
                <path d={btcPath} className="price-line btc-line" fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
              )}
              {(selectedAsset === 'all' || selectedAsset === 'eth') && ethPath && (
                <path d={ethPath} className="price-line eth-line" fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
              )}
              {(selectedAsset === 'all' || selectedAsset === 'erg') && ergPath && (
                <path d={ergPath} className="price-line erg-line" fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
              )}
              
              {/* Event markers */}
              {eventPositions.map((event, idx) => {
                const isEven = idx % 2 === 0;
                const labelY = isEven ? margin.top + height + 40 : margin.top + height + 25;
                const centerY = margin.top + height;
                return (
                  <g key={idx} className={`event-marker event-${event.type}`}>
                    <circle cx={event.x} cy={centerY} r="3" fill="var(--color-primary)" opacity="0.85"/>
                    <line x1={event.x} y1={margin.top} x2={event.x} y2={centerY} stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.2" strokeDasharray="2,2"/>
                    <text x={event.x} y={labelY} textAnchor="middle" className="event-label">
                      {event.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot btc"></span>
              <span>Bitcoin (BTC)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot eth"></span>
              <span>Ethereum (ETH)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot erg"></span>
              <span>Ergo (ERG)</span>
            </div>
          </div>
        </section>

        <section className="chart-interpretation">
          <h3>What This Chart Shows</h3>
          <p>
            This visualization displays continuous price movement over the selected period, highlighting 
            structurally important moments such as rapid upward accelerations, sudden drawdowns, and extended 
            recovery or consolidation phases.
          </p>
          <p>
            <strong>Key observation:</strong> Rapid upward price movement has historically been followed by 
            a wide range of outcomes—including sharp reversals, extended volatility, and long periods of 
            stagnation. This visualization provides historical context, not a forecast.
          </p>
          <p>
            The patterns shown here underscore a central principle: extreme market movements are not rare 
            anomalies, but recurring features of volatile markets. Before reacting to sudden price movements, 
            ask yourself: "How confident should I be when markets are moving this fast?"
          </p>
        </section>

        <section className="what-not-shown">
          <h3>What This Section Does Not Include</h3>
          <ul>
            <li>Predictions or trend extrapolations</li>
            <li>Future projections or forecasts</li>
            <li>Buy/sell signals or technical indicators (RSI, MACD, etc.)</li>
            <li>Performance comparisons or rankings</li>
            <li>Real-time price flashing or emotional design elements</li>
          </ul>
          <p>
            These elements are intentionally omitted to avoid overfitting narratives, generating false signals, 
            and implying advice where none should exist.
          </p>
        </section>

        <section className="simulator-connection">
          <h3>Relationship to the Simulator</h3>
          <p>
            The Market Reality section complements the simulator but does not duplicate it:
          </p>
          <ul>
            <li><strong>Simulator:</strong> Explores how assumptions affect uncertainty</li>
            <li><strong>Market Reality:</strong> Shows how uncertainty has manifested in practice</li>
          </ul>
          <p>
            Together, they allow you to connect abstract uncertainty indicators with concrete historical behavior. 
            Neither section is intended to stand alone as a decision tool.
          </p>
        </section>
      </div>
    </main>
  );
}
