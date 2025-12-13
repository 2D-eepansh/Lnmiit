/**
 * Normalization utilities tests
 */
/// <reference types="jest" />

import { normalizeBlockData, aggregateBlockMetrics, type NormalizedBlock } from '../normalize';

describe('normalizeBlockData', () => {
  it('should normalize raw block data', () => {
    const rawBlocks = {
      items: [
        {
          height: 1000,
          timestamp: 1000000,
          transactionsCount: 5,
          difficulty: 1e9,
          minerReward: 67.5,
          size: 5000,
        },
        {
          height: 999,
          timestamp: 999880,
          transactionsCount: 3,
          difficulty: 1e9,
          minerReward: 67.5,
          size: 4500,
        },
      ],
    };

    const result = normalizeBlockData(rawBlocks as Record<string, unknown>);
    expect(result).toHaveLength(2);
    expect(result[0].height).toBe(1000);
    expect(result[0].blockTime).toBe(120); // 1000000 - 999880
  });

  it('should handle empty data', () => {
    const result = normalizeBlockData({ items: [] } as Record<string, unknown>);
    expect(result).toEqual([]);
  });

  it('should handle invalid data structure', () => {
    const result = normalizeBlockData({} as Record<string, unknown>);
    expect(result).toEqual([]);
  });
});

describe('aggregateBlockMetrics', () => {
  it('should calculate metrics from blocks', () => {
    const blocks: NormalizedBlock[] = [
      {
        height: 1000,
        timestamp: 1000000,
        txCount: 10,
        difficulty: 1e9,
        minerReward: 67.5,
        size: 5000,
        blockTime: 120,
      },
      {
        height: 999,
        timestamp: 999880,
        txCount: 5,
        difficulty: 1e9,
        minerReward: 67.5,
        size: 4500,
        blockTime: 120,
      },
      {
        height: 998,
        timestamp: 999760,
        txCount: 8,
        difficulty: 1e9,
        minerReward: 67.5,
        size: 4800,
        blockTime: 120,
      },
    ];

    const result = aggregateBlockMetrics(blocks);
    expect(result.averageBlockTime).toBe(120);
    expect(result.averageTxCount).toBeCloseTo(7.67, 1);
    expect(result.blockTimeStdDev).toBe(0); // All same time
  });

  it('should handle empty blocks', () => {
    const result = aggregateBlockMetrics([]);
    expect(result.averageBlockTime).toBe(120000); // Default 2 minutes
  });
});