/**
 * Block Time Chart Component
 * Visualizes block production consistency over time
 */


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useApp } from '../context/useApp';
import { Clock } from 'lucide-react';
import './Charts.css';

export function BlockTimeChart() {
  const { blocks, isLoading } = useApp();

  if (isLoading || blocks.length === 0) {
    return (
      <div className="chart-container loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-chart"></div>
      </div>
    );
  }

  // Prepare data (last 50 blocks for readability)
  const chartData = blocks
    .slice(0, 50)
    .reverse()
    .filter(b => b.blockTime && b.blockTime > 0)
    .map(block => ({
      height: block.height,
      blockTime: Number((block.blockTime! / 1000).toFixed(1)), // Convert to seconds with 0.1s precision
    }));

  const avgBlockTime = chartData.reduce((sum, d) => sum + d.blockTime, 0) / chartData.length;
  const expectedTime = 120; // 2 minutes in seconds

  return (
    <div className="chart-container">
      <div className="chart-header">
        <Clock className="chart-icon" />
        <h3>Block Time History</h3>
        <span className="chart-subtitle">Last 50 blocks (seconds)</span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="height"
            stroke="#999"
            tick={{ fill: '#999', fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            stroke="#999"
            tick={{ fill: '#999', fontSize: 12 }}
            label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#999' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #FF5722',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelFormatter={(value) => `Block ${value}`}
            formatter={(value: number) => [`${value.toFixed(1)}s`, 'Block Time']}
          />
          <ReferenceLine
            y={expectedTime}
            stroke="#FF9800"
            strokeDasharray="5 5"
            label={{ value: 'Target (2min)', fill: '#FF9800', fontSize: 12, position: 'right' }}
          />
          <Line
            type="monotoneX"
            dataKey="blockTime"
            stroke="#FF5722"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{ fill: '#FF5722', r: 3.5 }}
            activeDot={{ r: 5.5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#FF5722' }}></div>
          <span>Actual Block Time</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ borderColor: '#FF9800' }}></div>
          <span>Target (120s)</span>
        </div>
        <div className="legend-item">
          <span className="legend-stat">Avg: {avgBlockTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}
