import { useQuery } from '@tanstack/react-query';

export type RateSource = 'CoinGecko' | 'Binance' | 'Cached' | 'CachedStale' | 'Fallback' | 'Loading';

interface BtcRateData {
  rate: number;
  timestamp: number;
  source: RateSource;
  isCachedStale?: boolean;
}

const CACHE_KEY = 'btc_usdt_rate_cache';
const FALLBACK_RATE = 67500; // Updated fallback for 2026 market
const CACHE_MAX_AGE = 3600000; // 1 hour in milliseconds

/**
 * Fetch BTC/USDT rate from CoinGecko API (primary provider)
 */
async function fetchFromCoinGecko(): Promise<BtcRateData> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usdt',
    { signal: AbortSignal.timeout(10000) } // 10 second timeout
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  const rate = data.bitcoin?.usdt;
  
  if (!rate || typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
    throw new Error('Invalid rate data from CoinGecko');
  }
  
  return {
    rate,
    timestamp: Date.now(),
    source: 'CoinGecko',
  };
}

/**
 * Fetch BTC/USDT rate from Binance API (fallback provider)
 */
async function fetchFromBinance(): Promise<BtcRateData> {
  const response = await fetch(
    'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    { signal: AbortSignal.timeout(10000) } // 10 second timeout
  );
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }
  
  const data = await response.json();
  const rate = parseFloat(data.price);
  
  if (!rate || typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
    throw new Error('Invalid rate data from Binance');
  }
  
  return {
    rate,
    timestamp: Date.now(),
    source: 'Binance',
  };
}

/**
 * Get cached rate from localStorage
 */
function getCachedRate(): BtcRateData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const cachedData = JSON.parse(cached) as BtcRateData;
    if (!cachedData.rate || !cachedData.timestamp) return null;
    
    const age = Date.now() - cachedData.timestamp;
    const isCachedStale = age >= CACHE_MAX_AGE;
    
    return {
      ...cachedData,
      source: isCachedStale ? 'CachedStale' : 'Cached',
      isCachedStale,
    };
  } catch (e) {
    console.warn('Failed to read cached rate:', e);
    return null;
  }
}

/**
 * Save rate to localStorage cache
 */
function cacheRate(rateData: BtcRateData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rateData));
  } catch (e) {
    console.warn('Failed to cache BTC rate:', e);
  }
}

/**
 * Fetch BTC/USDT rate with automatic fallback
 * Tries CoinGecko first, then Binance, then cached rate, then hardcoded fallback
 */
async function fetchBtcRate(): Promise<BtcRateData> {
  // Try primary provider (CoinGecko)
  try {
    const rateData = await fetchFromCoinGecko();
    cacheRate(rateData);
    return rateData;
  } catch (error) {
    console.warn('CoinGecko fetch failed:', error);
  }
  
  // Try fallback provider (Binance)
  try {
    const rateData = await fetchFromBinance();
    cacheRate(rateData);
    return rateData;
  } catch (error) {
    console.warn('Binance fetch failed:', error);
  }
  
  // Try cached rate (even if stale)
  const cachedRate = getCachedRate();
  if (cachedRate) {
    console.info('Using cached rate:', cachedRate.source);
    return cachedRate;
  }
  
  // Use hardcoded fallback as last resort
  console.warn('All providers failed, using hardcoded fallback rate');
  return {
    rate: FALLBACK_RATE,
    timestamp: Date.now(),
    source: 'Fallback',
  };
}

/**
 * Hook to fetch and auto-refresh BTC/USDT rate
 * Refreshes every 60 seconds and on window focus/reconnect
 */
export function useBtcUsdtRate() {
  const query = useQuery<BtcRateData>({
    queryKey: ['btcUsdtRate'],
    queryFn: fetchBtcRate,
    refetchInterval: 60000, // Refresh every 60 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnReconnect: true, // Refresh when network reconnects
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: false, // Don't retry - fetchBtcRate handles fallbacks internally
  });

  const rateData = query.data;
  const effectiveRate = rateData?.rate ?? FALLBACK_RATE;
  const source: RateSource = query.isLoading && !query.isFetched ? 'Loading' : (rateData?.source ?? 'Fallback');

  // Return explicit state for UI rendering
  return {
    rate: effectiveRate,
    timestamp: rateData?.timestamp,
    source,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetched: query.isFetched,
    effectiveRate,
    isUsingFallback: source === 'Fallback',
    isUsingCache: source === 'Cached' || source === 'CachedStale',
    isCachedStale: rateData?.isCachedStale ?? false,
    isLive: source === 'CoinGecko' || source === 'Binance',
  };
}
