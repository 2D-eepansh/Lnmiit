/**
 * Price Chart Component
 * Shows ERG price history with volatility indicators
 */


import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../context/useApp';
import { TrendingUp } from 'lucide-react';
import './Charts.css';

export function PriceChart() {
  const { historicalPrices, isLoading } = useApp();

  if (isLoading || historicalPrices.length === 0) {
    return (
      <div className="chart-container loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-chart"></div>
      </div>
    );
  }

  // Prepare data
  const chartData = historicalPrices.map((price, index) => ({
    day: `Day ${index + 1}`,
    price: price,
  })).reverse(); // Oldest to newest

  const minPrice = Math.min(...historicalPrices);
  const maxPrice = Math.max(...historicalPrices);
  const priceRange = maxPrice - minPrice;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <TrendingUp className="chart-icon" />
        <h3>ERG Price (7 Days)</h3>
        <span className="chart-subtitle">USD</span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5722" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="day"
            stroke="#999"
            tick={{ fill: '#999', fontSize: 12 }}
          />
          <YAxis
            stroke="#999"
            tick={{ fill: '#999', fontSize: 12 }}
            domain={[minPrice * 0.95, maxPrice * 1.05]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #FF5722',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#FF5722"
            strokeWidth={3}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-stat">Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
        </div>
        <div className="legend-item">
          <span className="legend-stat">Variance: {((priceRange / minPrice) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
