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
    blockTimeSec?: number;
    severity: 'low' | 'moderate' | 'elevated';
    expectedBaselineSec: number;
    varianceFactor?: number;
  }>;
} {
  const anomalies: Array<{
    type: 'slow_block' | 'fast_block' | 'empty_block';
    height: number;
    description: string;
    blockTimeSec?: number;
    severity: 'low' | 'moderate' | 'elevated';
    expectedBaselineSec: number;
    varianceFactor?: number;
  }> = [];

  const avgBlockTime = blocks
    .filter(b => b.blockTime && b.blockTime > 0)
    .reduce((sum, b, _, arr) => sum + b.blockTime! / arr.length, 0);

  const expectedBaselineSec = 120; // Ergo target ~2 minutes

  const classifySeverity = (factor: number): 'low' | 'moderate' | 'elevated' => {
    if (factor >= 3) return 'elevated';
    if (factor >= 1.5) return 'moderate';
    return 'low';
  };

  blocks.forEach(block => {
    // Detect slow blocks (> 3x average)
    if (block.blockTime && block.blockTime > avgBlockTime * 3) {
      const blockTimeSec = block.blockTime / 1000;
      const factor = avgBlockTime > 0 ? block.blockTime / avgBlockTime : 0;
      anomalies.push({
        type: 'slow_block',
        height: block.height,
        description: `Block took ${Math.round(blockTimeSec)}s (~${Math.round(factor)}x recent median)`,
        blockTimeSec,
        varianceFactor: factor,
        severity: classifySeverity(factor),
        expectedBaselineSec,
      });
    }

    // Detect very fast blocks (< 0.3x average)
    if (block.blockTime && block.blockTime < avgBlockTime * 0.3) {
      const blockTimeSec = block.blockTime / 1000;
      const factor = avgBlockTime > 0 ? block.blockTime / avgBlockTime : 0;
      anomalies.push({
        type: 'fast_block',
        height: block.height,
        description: `Block mined unusually fast (${Math.round(blockTimeSec)}s)`,
        blockTimeSec,
        varianceFactor: factor,
        severity: classifySeverity(1 / Math.max(factor, 0.01)),
        expectedBaselineSec,
      });
    }

    // Detect empty blocks
    if (block.txCount === 0) {
      anomalies.push({
        type: 'empty_block',
        height: block.height,
        description: 'Block contains no transactions',
        severity: 'low',
        expectedBaselineSec,
      });
    }
  });

  return {
    hasAnomalies: anomalies.length > 0,
    anomalies,
  };
}

/**
 * Summarize anomalies for UI widgets
 * Provides lightweight derived metrics for Phase 2 visualizations
 */
export function summarizeAnomalies(
  blocks: NormalizedBlock[],
  metrics: BlockMetrics | null
): {
  total: number;
  counts: { slow: number; fast: number; empty: number };
  blockTimeCv: number;
  difficultyChange: number;
  activityScore: number;
} {
  const { anomalies } = detectAnomalies(blocks);
  const counts = anomalies.reduce(
    (acc, a) => {
      if (a.type === 'slow_block') acc.slow += 1;
      if (a.type === 'fast_block') acc.fast += 1;
      if (a.type === 'empty_block') acc.empty += 1;
      return acc;
    },
    { slow: 0, fast: 0, empty: 0 }
  );

  const blockTimes = blocks
    .filter(b => b.blockTime && b.blockTime > 0 && b.blockTime < 600000)
    .map(b => b.blockTime!);

  const avgBlockTime = blockTimes.length
    ? blockTimes.reduce((sum, t) => sum + t, 0) / blockTimes.length
    : 120000;

  const variance = blockTimes.length
    ? blockTimes.reduce((sum, t) => sum + Math.pow(t - avgBlockTime, 2), 0) / blockTimes.length
    : 0;

  const blockTimeCv = avgBlockTime > 0 ? Math.sqrt(variance) / avgBlockTime : 0;

  // Difficulty change from calculateDifficultyStability for UI friendliness
  const { changePercent } = calculateDifficultyStability(blocks);

  // Activity score derived from metrics (0-100 similar to calculateNetworkActivityScore)
  const activityScore = metrics
    ? Math.min(100, ((metrics.totalTxCount / Math.max(metrics.timeRange / 60000, 1)) / 10) * 100)
    : 0;

  return {
    total: anomalies.length,
    counts,
    blockTimeCv,
    difficultyChange: changePercent,
    activityScore,
  };
}
