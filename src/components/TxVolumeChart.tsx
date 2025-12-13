/**
 * Transaction Volume Chart
 * Shows transaction activity over recent blocks
 */


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/useApp';
import { Activity } from 'lucide-react';
import './Charts.css';

export function TxVolumeChart() {
  const { blocks, isLoading } = useApp();

  if (isLoading || blocks.length === 0) {
    return (
      <div className="chart-container loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-chart"></div>
      </div>
    );
  }

  // Prepare data (last 50 blocks)
  const chartData = blocks
    .slice(0, 50)
    .reverse()
    .map(block => ({
      height: block.height,
      txCount: block.txCount,
    }));

  const totalTx = chartData.reduce((sum, d) => sum + d.txCount, 0);
  const avgTx = totalTx / chartData.length;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <Activity className="chart-icon" />
        <h3>Transaction Volume</h3>
        <span className="chart-subtitle">Last 50 blocks</span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            label={{ value: 'Transactions', angle: -90, position: 'insideLeft', fill: '#999' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #FF5722',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelFormatter={(value) => `Block ${value}`}
            formatter={(value: number) => [`${value} tx`, 'Count']}
          />
          <Bar dataKey="txCount" fill="#FF5722" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-stat">Total: {totalTx} tx</span>
        </div>
        <div className="legend-item">
          <span className="legend-stat">Avg: {avgTx.toFixed(1)} tx/block</span>
        </div>
      </div>
    </div>
  );
}
