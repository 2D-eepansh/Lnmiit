/**
 * Data Normalization Layer
 * Converts raw API responses to predictable, typed data structures
 */

export interface NormalizedBlock {
  height: number;
  timestamp: number;
  txCount: number;
  difficulty: number;
  minerReward: number;
  size: number;
  blockTime?: number; // Time since previous block (ms)
}

export interface NormalizedNetworkState {
  currentHeight: number;
  difficulty: number;
  blockTime: number; // Expected block time in ms
  hashRate?: number;
}

/**
 * Normalize blocks from Ergo Explorer API
 */
export function normalizeBlockData(rawBlocks: Record<string, unknown>): NormalizedBlock[] {
  if (!rawBlocks?.items || !Array.isArray(rawBlocks.items)) {
    console.warn('Invalid block data structure');
    return [];
  }

  const blocks: NormalizedBlock[] = (rawBlocks.items as Array<Record<string, unknown>>).map((block: Record<string, unknown>) => ({
    height: typeof block.height === 'number' ? block.height : 0,
    timestamp: typeof block.timestamp === 'number' ? block.timestamp : Date.now(),
    txCount: typeof block.transactionsCount === 'number' ? block.transactionsCount : 0,
    difficulty: typeof block.difficulty === 'number' ? block.difficulty : 0,
    minerReward: typeof block.minerReward === 'number' ? block.minerReward : 0,
    size: typeof block.size === 'number' ? block.size : 0,
  }));

  // Calculate block times (time between consecutive blocks)
  for (let i = 0; i < blocks.length - 1; i++) {
    blocks[i].blockTime = blocks[i].timestamp - blocks[i + 1].timestamp;
  }

  return blocks;
}

/**
 * Normalize network state
 */
export function normalizeNetworkState(rawState: Record<string, unknown>): NormalizedNetworkState {
  if (!rawState) {
    console.warn('Invalid network state');
    return {
      currentHeight: 0,
      difficulty: 0,
      blockTime: 120000, // 2 minutes default
    };
  }

  const difficulty = typeof rawState.difficulty === 'number' ? rawState.difficulty : 0;
  const params = rawState.params as Record<string, unknown> | undefined;
  const blockTime = params && typeof params.blockTime === 'number' ? params.blockTime : 120000;

  return {
    currentHeight: typeof rawState.height === 'number' ? rawState.height : 0,
    difficulty,
    blockTime,
    hashRate: calculateHashRate(difficulty),
  };
}

/**
 * Calculate network hash rate from difficulty
 * Ergo uses Autolykos PoW algorithm
 */
export function calculateHashRate(difficulty: number): number {
  // Simplified hash rate calculation
  // Real formula is more complex, this is an approximation
  // Hash rate in TH/s
  return difficulty / (120 * 1e9); // Divide by expected block time and unit conversion
}

/**
 * Aggregate block data for time-series analysis
 */
export interface BlockMetrics {
  averageBlockTime: number;
  averageTxCount: number;
  averageDifficulty: number;
  blockTimeStdDev: number;
  totalTxCount: number;
  timeRange: number; // in milliseconds
}

export function aggregateBlockMetrics(blocks: NormalizedBlock[]): BlockMetrics {
  if (blocks.length === 0) {
    return {
      averageBlockTime: 120000,
      averageTxCount: 0,
      averageDifficulty: 0,
      blockTimeStdDev: 0,
      totalTxCount: 0,
      timeRange: 0,
    };
  }

  const blockTimes = blocks
    .filter(b => b.blockTime && b.blockTime > 0)
    .map(b => b.blockTime!);

  const avgBlockTime = blockTimes.length > 0
    ? blockTimes.reduce((sum, time) => sum + time, 0) / blockTimes.length
    : 120000;

  const avgTxCount = blocks.reduce((sum, b) => sum + b.txCount, 0) / blocks.length;
  const avgDifficulty = blocks.reduce((sum, b) => sum + b.difficulty, 0) / blocks.length;
  const totalTxCount = blocks.reduce((sum, b) => sum + b.txCount, 0);

  // Calculate standard deviation of block times
  const blockTimeVariance = blockTimes.length > 0
    ? blockTimes.reduce((sum, time) => sum + Math.pow(time - avgBlockTime, 2), 0) / blockTimes.length
    : 0;
  const blockTimeStdDev = Math.sqrt(blockTimeVariance);

  const timeRange = blocks.length > 1
    ? blocks[0].timestamp - blocks[blocks.length - 1].timestamp
    : 0;

  return {
    averageBlockTime: avgBlockTime,
    averageTxCount: avgTxCount,
    averageDifficulty: avgDifficulty,
    blockTimeStdDev: blockTimeStdDev,
    totalTxCount: totalTxCount,
    timeRange: timeRange,
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

/**
 * Format hash rate for display
 */
export function formatHashRate(hashRate: number): string {
  if (hashRate >= 1000) return `${(hashRate / 1000).toFixed(2)} PH/s`;
  return `${hashRate.toFixed(2)} TH/s`;
}

/**
 * Format time duration
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
