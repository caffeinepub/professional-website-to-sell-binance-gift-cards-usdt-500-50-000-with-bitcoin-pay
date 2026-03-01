import { RateSource } from '@/hooks/useBtcUsdtRate';

/**
 * Format BTC rate for display
 */
export function formatBtcRate(rate: number): string {
  return `$${rate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Get user-facing status message for BTC rate
 */
export function getBtcRateStatusMessage(source: RateSource, isLoading: boolean, isFetched: boolean): string {
  if (isLoading && !isFetched) {
    return 'Loading BTC price…';
  }
  
  switch (source) {
    case 'CoinGecko':
      return 'Live from CoinGecko';
    case 'Binance':
      return 'Live from Binance';
    case 'Cached':
      return 'Cached rate';
    case 'CachedStale':
      return 'Cached rate (stale)';
    case 'Fallback':
      return 'Rate unavailable';
    case 'Loading':
      return 'Loading…';
    default:
      return 'Unknown';
  }
}

/**
 * Get short status label for ticker display
 */
export function getBtcRateTickerLabel(source: RateSource, isLoading: boolean, isFetched: boolean): string {
  if (isLoading && !isFetched) {
    return 'Loading BTC price…';
  }
  
  switch (source) {
    case 'CoinGecko':
    case 'Binance':
      return 'Live';
    case 'Cached':
      return 'Cached';
    case 'CachedStale':
      return 'Cached (stale)';
    case 'Fallback':
      return 'Unavailable';
    case 'Loading':
      return 'Loading…';
    default:
      return '';
  }
}

/**
 * Check if rate should show warning indicator
 */
export function shouldShowRateWarning(source: RateSource): boolean {
  return source === 'Fallback' || source === 'CachedStale';
}
