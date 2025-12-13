/**
 * Risk scoring utilities tests
 */
/// <reference types="jest" />

import {
  calculateBlockTimeStability,
  calculateOverallStability,
  type NormalizedBlock,
} from '../risk';
import type { BlockMetrics } from '../normalize';

describe('Risk Scoring', () => {
  describe('calculateBlockTimeStability', () => {
    it('should return high score for consistent block times', () => {
      const blocks: NormalizedBlock[] = Array(50).fill(null).map((_, i) => ({
        height: 1000 + i,
        timestamp: 1000000 + i * 120000,
        blockTime: 120,
        txCount: 10,
        difficulty: 1e9,
        minerReward: 50,
        size: 500,
      }));
      const result = calculateBlockTimeStability(blocks);
      expect(result.score).toBeGreaterThan(80);
    });

    it('should return low score for volatile block times', () => {
      const blocks: NormalizedBlock[] = [60, 180, 30, 200, 120, 50, 190].map((blockTime, i) => ({
        height: 1000 + i,
        timestamp: 1000000 + i * blockTime,
        blockTime,
        txCount: 10,
        difficulty: 1e9,
        minerReward: 50,
        size: 500,
      }));
      const result = calculateBlockTimeStability(blocks);
      expect(result.score).toBeLessThan(50);
    });

    it('should handle empty input', () => {
      const result = calculateBlockTimeStability([]);
      expect(result.score).toBe(50); // Default neutral
    });
  });

  describe('calculateOverallStability', () => {
    it('should weight factors correctly', () => {
      const metrics: BlockMetrics = {
        averageBlockTime: 120000,
        blockTimeStdDev: 5000,
        averageDifficulty: 1e9,
        totalTxCount: 500,
        timeRange: 300000,
      };

      const score = calculateOverallStability(metrics, [], []);
      expect(score.score).toBeGreaterThan(0);
      expect(score.score).toBeLessThanOrEqual(100);
    });
  });
});
