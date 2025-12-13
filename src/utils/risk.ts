/**
 * Risk & Stability Analysis
 * Core algorithms for assessing Ergo blockchain stability
 */

import type { NormalizedBlock, BlockMetrics } from './normalize';

export type RiskLevel = 'stable' | 'caution' | 'volatile';

export interface StabilityScore {
  score: number; // 0-100
  level: RiskLevel;
  factors: {
    blockTimeStability: number;
    difficultyStability: number;
    networkActivity: number;
  };
}

/**
 * Calculate block time stability score
 * Lower variance = higher stability
 */
export function calculateBlockTimeStability(blocks: NormalizedBlock[]): {
  score: number;
  variance: number;
  averageBlockTime: number;
  riskLevel: RiskLevel;
} {
  const blockTimes = blocks
    .filter(b => b.blockTime && b.blockTime > 0 && b.blockTime < 600000) // Filter outliers (< 10 min)
    .map(b => b.blockTime!);

  if (blockTimes.length === 0) {
    return {
      score: 50,
      variance: 0,
      averageBlockTime: 120000,
      riskLevel: 'caution',
    };
  }

  const average = blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length;
  const variance = blockTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / blockTimes.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation (CV) = std dev / mean
  // Lower CV = more stable
  const cv = stdDev / average;
  
  // Score: 100 for CV < 0.1, 0 for CV > 0.5
  const score = Math.max(0, Math.min(100, 100 - (cv * 200)));
  
  let riskLevel: RiskLevel;
  if (score >= 70) riskLevel = 'stable';
  else if (score >= 40) riskLevel = 'caution';
  else riskLevel = 'volatile';

  return {
    score,
    variance,
    averageBlockTime: average,
    riskLevel,
  };
}

/**
 * Calculate difficulty adjustment stability
 * Ergo uses epoch-based difficulty adjustment
 */
export function calculateDifficultyStability(blocks: NormalizedBlock[]): {
  score: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  riskLevel: RiskLevel;
} {
  if (blocks.length < 10) {
    return {
      score: 50,
      trend: 'stable',
      changePercent: 0,
      riskLevel: 'caution',
    };
  }

  // Compare recent difficulty to older difficulty
  const recentDifficulty = blocks.slice(0, 10).reduce((sum, b) => sum + b.difficulty, 0) / 10;
  const olderDifficulty = blocks.slice(-10).reduce((sum, b) => sum + b.difficulty, 0) / 10;
  
  const changePercent = ((recentDifficulty - olderDifficulty) / olderDifficulty) * 100;
  
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (changePercent > 5) trend = 'increasing';
  else if (changePercent < -5) trend = 'decreasing';
  else trend = 'stable';
  
  // Large swings in difficulty indicate instability
  const absChange = Math.abs(changePercent);
  const score = Math.max(0, Math.min(100, 100 - absChange));
  
  let riskLevel: RiskLevel;
  if (score >= 70) riskLevel = 'stable';
  else if (score >= 40) riskLevel = 'caution';
  else riskLevel = 'volatile';

  return {
    score,
    trend,
    changePercent,
    riskLevel,
  };
}

/**
 * Calculate network activity score
 * Higher transaction volume = healthier network
 */
export function calculateNetworkActivityScore(metrics: BlockMetrics): {
  score: number;
  txPerMinute: number;
  riskLevel: RiskLevel;
} {
  const timeRangeMinutes = metrics.timeRange / 60000;
  const txPerMinute = timeRangeMinutes > 0 ? metrics.totalTxCount / timeRangeMinutes : 0;
  
  // Score based on transaction throughput
  // Ergo can handle ~10-20 tx per block, blocks every 2 min = ~5-10 tx/min
  // Score: 100 for > 10 tx/min, scaling down to 0 for < 1 tx/min
  const score = Math.min(100, (txPerMinute / 10) * 100);
  
  let riskLevel: RiskLevel;
  if (score >= 60) riskLevel = 'stable';
  else if (score >= 30) riskLevel = 'caution';
  else riskLevel = 'volatile';

  return {
    score,
    txPerMinute,
    riskLevel,
  };
}

/**
 * Calculate overall stability score
 * Weighted combination of multiple factors
 */
export function calculateOverallStability(
  blocks: NormalizedBlock[],
  metrics: BlockMetrics
): StabilityScore {
  const blockTimeStability = calculateBlockTimeStability(blocks);
  const difficultyStability = calculateDifficultyStability(blocks);
  const networkActivity = calculateNetworkActivityScore(metrics);
  
  // Weighted average (block time is most important for "stability")
  const weights = {
    blockTime: 0.5,
    difficulty: 0.3,
    activity: 0.2,
  };
  
  const score = 
    blockTimeStability.score * weights.blockTime +
    difficultyStability.score * weights.difficulty +
    networkActivity.score * weights.activity;
  
  let level: RiskLevel;
  if (score >= 70) level = 'stable';
  else if (score >= 40) level = 'caution';
  else level = 'volatile';

  return {
    score: Math.round(score),
    level,
    factors: {
      blockTimeStability: Math.round(blockTimeStability.score),
      difficultyStability: Math.round(difficultyStability.score),
      networkActivity: Math.round(networkActivity.score),
    },
  };
}

/**
 * Calculate price volatility
 * Uses standard deviation of returns
 */
export function calculatePriceVolatility(prices: number[]): {
  volatility: number;
  volatilityPercent: number;
  riskLevel: RiskLevel;
} {
  if (prices.length < 2) {
    return {
      volatility: 0,
      volatilityPercent: 0,
      riskLevel: 'caution',
    };
  }

  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const return_ = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(return_);
  }

  // Calculate standard deviation of returns
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  // Annualized volatility percentage
  const volatilityPercent = volatility * Math.sqrt(365) * 100;
  
  // Risk levels based on crypto norms
  // < 50%: stable, 50-100%: caution, > 100%: volatile
  let riskLevel: RiskLevel;
  if (volatilityPercent < 50) riskLevel = 'stable';
  else if (volatilityPercent < 100) riskLevel = 'caution';
  else riskLevel = 'volatile';

  return {
    volatility,
    volatilityPercent,
    riskLevel,
  };
}

/**
 * Calculate average transaction fee (as indicator of network congestion)
 */
export function calculateAverageFee(): {
  avgFeePerTx: number;
  trend: 'increasing' | 'decreasing' | 'stable';
} {
  // This would require fee data from blocks
  // Placeholder implementation
  return {
    avgFeePerTx: 0.001, // ERG
    trend: 'stable',
  };
}

/**
 * Detect anomalies in block production
 */
export function detectAnomalies(blocks: NormalizedBlock[]): {
  hasAnomalies: boolean;
  anomalies: Array<{
    type: 'slow_block' | 'fast_block' | 'empty_block';
    height: number;
    description: string;
  }>;
} {
  const anomalies: Array<{
    type: 'slow_block' | 'fast_block' | 'empty_block';
    height: number;
    description: string;
  }> = [];

  const avgBlockTime = blocks
    .filter(b => b.blockTime && b.blockTime > 0)
    .reduce((sum, b, _, arr) => sum + b.blockTime! / arr.length, 0);

  blocks.forEach(block => {
    // Detect slow blocks (> 3x average)
    if (block.blockTime && block.blockTime > avgBlockTime * 3) {
      anomalies.push({
        type: 'slow_block',
        height: block.height,
        description: `Block took ${Math.round(block.blockTime / 1000)}s (${Math.round(block.blockTime / avgBlockTime)}x normal)`,
      });
    }

    // Detect very fast blocks (< 0.3x average)
    if (block.blockTime && block.blockTime < avgBlockTime * 0.3) {
      anomalies.push({
        type: 'fast_block',
        height: block.height,
        description: `Block mined unusually fast (${Math.round(block.blockTime / 1000)}s)`,
      });
    }

    // Detect empty blocks
    if (block.txCount === 0) {
      anomalies.push({
        type: 'empty_block',
        height: block.height,
        description: 'Block contains no transactions',
      });
    }
  });

  return {
    hasAnomalies: anomalies.length > 0,
    anomalies,
  };
}
