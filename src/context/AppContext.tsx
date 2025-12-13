/**
 * Application Context
 * Global state management for dashboard data
 */

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchNetworkState, fetchRecentBlocks, checkAPIHealth, MOCK_NETWORK_STATE, MOCK_BLOCKS } from '../api/ergo';
import { fetchErgPrice, fetchHistoricalPrices, type PriceData, MOCK_PRICE_DATA } from '../api/price';
import { normalizeBlockData, normalizeNetworkState, aggregateBlockMetrics, type NormalizedBlock, type BlockMetrics, type NormalizedNetworkState } from '../utils/normalize';
import { calculateOverallStability, type StabilityScore } from '../utils/risk';

interface AppState {
  // Data
  networkState: NormalizedNetworkState | null;
  blocks: NormalizedBlock[];
  blockMetrics: BlockMetrics | null;
  priceData: PriceData | null;
  historicalPrices: number[];
  stabilityScore: StabilityScore | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  apiHealthy: boolean;
  lastUpdated: Date | null;
  usingMockData: boolean;
  
  // KYA State
  kyaShown: boolean;
  setKyaShown: (shown: boolean) => void;
  
  // Actions
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export { AppContext };

export function AppProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NormalizedNetworkState | null>(null);
  const [blocks, setBlocks] = useState<NormalizedBlock[]>([]);
  const [blockMetrics, setBlockMetrics] = useState<BlockMetrics | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [historicalPrices, setHistoricalPrices] = useState<number[]>([]);
  const [stabilityScore, setStabilityScore] = useState<StabilityScore | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const [kyaShown, setKyaShown] = useState(() => {
    return localStorage.getItem('kyaShown') === 'true';
  });

  const fetchAllData = useCallback(async (useMock: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check API health first
      if (!useMock) {
        const health = await checkAPIHealth();
        setApiHealthy(health.healthy);
        
        if (!health.healthy) {
          console.warn('API unhealthy, using mock data');
          useMock = true;
        }
      }

      let networkData, blocksData, priceInfo, historicalData;

      if (useMock) {
        // Use mock data
        setUsingMockData(true);
        networkData = normalizeNetworkState(MOCK_NETWORK_STATE);
        const normalizedBlocks = normalizeBlockData(MOCK_BLOCKS);
        blocksData = normalizedBlocks;
        priceInfo = MOCK_PRICE_DATA;
        historicalData = Array.from({ length: 7 }, () => 2.5 * (0.85 + Math.random() * 0.3));
      } else {
        // Fetch real data
        setUsingMockData(false);
        
        const [networkRes, blocksRes, priceRes, historicalRes] = await Promise.all([
          fetchNetworkState(),
          fetchRecentBlocks(100),
          fetchErgPrice(),
          fetchHistoricalPrices(7),
        ]);

        networkData = normalizeNetworkState(networkRes as Record<string, unknown>);
        blocksData = normalizeBlockData(blocksRes as Record<string, unknown>);
        priceInfo = priceRes;
        historicalData = historicalRes;
      }

      // Update state
      setNetworkState(networkData);
      setBlocks(blocksData);
      setPriceData(priceInfo);
      setHistoricalPrices(historicalData);

      // Calculate metrics
      const metrics = aggregateBlockMetrics(blocksData);
      setBlockMetrics(metrics);

      // Calculate stability score
      const stability = calculateOverallStability(blocksData, metrics);
      setStabilityScore(stability);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // Fallback to mock data on error
      if (!usingMockData) {
        await fetchAllData(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [usingMockData]);

  const refreshData = async () => {
    await fetchAllData(usingMockData);
  };

  const clearError = () => {
    setError(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchAllData(usingMockData);
    }, 120000);

    return () => clearInterval(interval);
  }, [fetchAllData, usingMockData]);

  // Save KYA state to localStorage
  useEffect(() => {
    localStorage.setItem('kyaShown', kyaShown.toString());
  }, [kyaShown]);

  const value: AppState = {
    networkState,
    blocks,
    blockMetrics,
    priceData,
    historicalPrices,
    stabilityScore,
    isLoading,
    error,
    apiHealthy,
    lastUpdated,
    usingMockData,
    kyaShown,
    setKyaShown,
    refreshData,
    clearError,
  };


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}