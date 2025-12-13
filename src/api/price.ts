/**
 * Price API Client
 * Fetches ERG price data from multiple sources with fallback
 */

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const CACHE_DURATION = 120000; // 2 minutes for price data

interface PriceCache {
  data: PriceData;
  timestamp: number;
}

export interface PriceData {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol?: number;
  usd_market_cap?: number;
}

let priceCache: PriceCache | null = null;

/**
 * Fetch ERG price from CoinGecko
 */
export async function fetchErgPrice(): Promise<PriceData> {
  // Check cache
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.data;
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}?ids=ergo&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.ergo) {
      throw new Error('Invalid price data structure');
    }

    const priceData: PriceData = {
      usd: data.ergo.usd,
      usd_24h_change: data.ergo.usd_24h_change || 0,
      usd_24h_vol: data.ergo.usd_24h_vol,
      usd_market_cap: data.ergo.usd_market_cap,
    };

    // Update cache
    priceCache = {
      data: priceData,
      timestamp: Date.now(),
    };

    // Store in localStorage for fallback
    localStorage.setItem('ergPriceCache', JSON.stringify(priceCache));

    return priceData;
  } catch (error) {
    console.error('Price fetch failed:', error);
    
    // Try localStorage fallback
    const cached = localStorage.getItem('ergPriceCache');
    if (cached) {
      const parsed = JSON.parse(cached) as PriceCache;
      // Use cache if less than 1 hour old
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.data;
      }
    }

    // Return mock data as last resort
    return MOCK_PRICE_DATA;
  }
}

/**
 * Fetch historical price data (last 7 days)
 * Used for volatility calculations
 */
export async function fetchHistoricalPrices(days: number = 7): Promise<number[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/ergo/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid historical price data');
    }

    // Extract prices from [timestamp, price] pairs
    return data.prices.map((entry: [number, number]) => entry[1]);
  } catch (error) {
    console.error('Historical price fetch failed:', error);
    
    // Return mock historical data
    const currentPrice = priceCache?.data.usd || 2.5;
    return Array.from({ length: days }, () => 
      currentPrice * (0.85 + Math.random() * 0.3)
    );
  }
}

/**
 * Calculate price volatility metrics
 */
export async function fetchPriceVolatility(): Promise<{
  volatility: number;
  volatilityPercent: number;
  riskLevel: 'stable' | 'caution' | 'volatile';
}> {
  const prices = await fetchHistoricalPrices(7);
  
  // Calculate standard deviation
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  
  // Volatility as percentage of mean
  const volatilityPercent = (stdDev / mean) * 100;
  
  // Risk levels based on crypto volatility norms
  let riskLevel: 'stable' | 'caution' | 'volatile';
  if (volatilityPercent < 10) {
    riskLevel = 'stable';
  } else if (volatilityPercent < 20) {
    riskLevel = 'caution';
  } else {
    riskLevel = 'volatile';
  }
  
  return {
    volatility: stdDev,
    volatilityPercent,
    riskLevel,
  };
}

/**
 * Mock price data (fallback)
 */
export const MOCK_PRICE_DATA: PriceData = {
  usd: 2.5,
  usd_24h_change: -3.2,
  usd_24h_vol: 5000000,
  usd_market_cap: 100000000,
};

/**
 * Check if price data is stale
 */
export function isPriceDataStale(): boolean {
  if (!priceCache) return true;
  return Date.now() - priceCache.timestamp > CACHE_DURATION;
}

/**
 * Get cached price without fetching
 */
export function getCachedPrice(): PriceData | null {
  return priceCache?.data || null;
}
