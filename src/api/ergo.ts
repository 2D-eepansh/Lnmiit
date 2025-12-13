/**
 * Ergo Explorer API Client
 * Provides resilient data fetching with fallback mechanisms
 */

const ERGO_API = "https://api.ergoplatform.com/api/v1";
const CACHE_DURATION = 60000; // 1 minute
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Simple cache implementation (stores any type safely)
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry<T>(
  url: string,
  attempts: number = RETRY_ATTEMPTS
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const isLastAttempt = i === attempts - 1;
      if (isLastAttempt) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
    }
  }
  throw new Error('All retry attempts failed');
}

/**
 * Cached fetch wrapper
 */
async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceFresh: boolean = false
): Promise<T> {
  // Check cache first
  if (!forceFresh) {
    const cached = cache.get(key) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  // Fetch fresh data
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() } as CacheEntry<unknown>);
  return data;
}

/**
 * Network state (current blockchain info)
 */
export async function fetchNetworkState() {
  return cachedFetch('networkState', async () => {
    return fetchWithRetry(`${ERGO_API}/networkState`);
  });
}

/**
 * Recent blocks with transaction data
 */
export async function fetchRecentBlocks(limit: number = 100) {
  return cachedFetch(`blocks-${limit}`, async () => {
    return fetchWithRetry(`${ERGO_API}/blocks?limit=${limit}&offset=0`);
  });
}

/**
 * Blockchain general info
 */
export async function fetchBlockchainInfo() {
  return cachedFetch('info', async () => {
    return fetchWithRetry(`${ERGO_API}/info`);
  });
}

/**
 * Get specific block by height
 */
export async function fetchBlockByHeight(height: number) {
  return fetchWithRetry(`${ERGO_API}/blocks/${height}`);
}

/**
 * Get address balances (for top addresses)
 */
export async function fetchAddressBalance(address: string) {
  return cachedFetch(`address-${address}`, async () => {
    return fetchWithRetry(`${ERGO_API}/addresses/${address}/balance/total`);
  });
}

/**
 * API Health Check
 */
export async function checkAPIHealth(): Promise<{
  healthy: boolean;
  latency: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const res = await fetch(`${ERGO_API}/info`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return {
      healthy: true,
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mock data for fallback (when API is down)
 */
export const MOCK_NETWORK_STATE = {
  height: 1234567,
  difficulty: 1234567890123456,
  blockTime: 120000,
  params: {
    blockTime: 120000,
  },
};

export const MOCK_BLOCKS = {
  items: Array.from({ length: 50 }, (_, i) => ({
    height: 1234567 - i,
    timestamp: Date.now() - i * 120000,
    transactionsCount: Math.floor(Math.random() * 20) + 5,
    difficulty: 1234567890123456 + Math.random() * 10000000000,
    minerReward: 67500000000,
    size: Math.floor(Math.random() * 100000) + 50000,
  })),
  total: 1234567,
};

/**
 * Clear cache (useful for forcing refresh)
 */
export function clearCache() {
  cache.clear();
}
