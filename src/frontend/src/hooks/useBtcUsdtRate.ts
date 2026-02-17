import { useQuery } from '@tanstack/react-query';

interface BtcRateData {
  rate: number;
  timestamp: number;
  source: 'CoinGecko' | 'Cached' | 'Fallback' | 'Loading';
}

const CACHE_KEY = 'btc_usdt_rate_cache';
const FALLBACK_RATE = 67500; // Updated fallback for 2026 market

/**
 * Fetch BTC/USDT rate from CoinGecko API
 */
async function fetchBtcRate(): Promise<BtcRateData> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usdt'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch BTC rate');
    }
    
    const data = await response.json();
    const rate = data.bitcoin?.usdt;
    
    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid rate data');
    }
    
    const rateData: BtcRateData = {
      rate,
      timestamp: Date.now(),
      source: 'CoinGecko',
    };
    
    // Cache the rate in localStorage
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rateData));
    } catch (e) {
      console.warn('Failed to cache BTC rate:', e);
    }
    
    return rateData;
  } catch (error) {
    console.error('Error fetching BTC rate:', error);
    
    // Try to use cached rate
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cachedData = JSON.parse(cached) as BtcRateData;
        // Use cache if it's less than 1 hour old
        if (Date.now() - cachedData.timestamp < 3600000) {
          return { ...cachedData, source: 'Cached' };
        }
      }
    } catch (e) {
      console.warn('Failed to read cached rate:', e);
    }
    
    // Return fallback rate
    return {
      rate: FALLBACK_RATE,
      timestamp: Date.now(),
      source: 'Fallback',
    };
  }
}

/**
 * Hook to fetch and auto-refresh BTC/USDT rate
 * Refreshes every 60 seconds and on window focus
 */
export function useBtcUsdtRate() {
  const query = useQuery<BtcRateData>({
    queryKey: ['btcUsdtRate'],
    queryFn: fetchBtcRate,
    refetchInterval: 60000, // Refresh every 60 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnReconnect: true, // Refresh when network reconnects
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
    retryDelay: 5000,
  });

  // Return explicit state for UI rendering
  return {
    rate: query.data?.rate ?? FALLBACK_RATE,
    timestamp: query.data?.timestamp,
    source: query.data?.source ?? 'Loading',
    isLoading: query.isLoading,
    isError: query.isError,
    isFetched: query.isFetched,
    // Expose the effective rate being used for conversions
    effectiveRate: query.data?.rate ?? FALLBACK_RATE,
    isUsingFallback: query.data?.source === 'Fallback' || !query.data,
  };
}
